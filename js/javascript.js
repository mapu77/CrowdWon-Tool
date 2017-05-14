var graph = new joint.dia.Graph;

var paperDOMElement = $('#paper');

var paper = new joint.dia.Paper({
    el: paperDOMElement,
    width: paperDOMElement.width(),
    height: paperDOMElement.height(),
    model: graph,
    gridSize: 15,
    drawGrid: "fixedDot"
});
paper.drawGrid();

//Copies from the export modal to our clipboard
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("#export").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}


//when we click to export button, 
//we generate the JSON format of the graph we created so far
$('#exp').click(function () {
    document.getElementById('result').innerHTML = JSON.stringify(graph.toJSON());
});

//when we click to import button and we want to import a model,
//we create the new graph
$('#imp').click(function () {
    var text = $("#comment").val();
    graph.fromJSON(JSON.parse(text));
});

function buildCell(imgSelected) {
    if (imgSelected === "img/decision.svg") {
        return new joint.shapes.basic.Decision();
    } else if (imgSelected === "img/aggregation.svg") {
        return new joint.shapes.basic.Generator();
    } else if (imgSelected === "img/task.svg") {
        var task = new joint.shapes.basic.Task();
        return task;
    }
    else {
        alert("Not implemented yet");
        throw Error("Not implemented yet");
    }
}

// General functions to add element on graph when click on it
$('.crowdwon-item').click(function (element) {
    var imgSelected = element.target.src.split('CrowdWon-Tool/')[1];
    var cell = buildCell(imgSelected);
    graph.addCell(cell);
});

$('.crowdwon-container').click(function (element) {
    var imgSelected = element.target.children[0].src.split('CrowdWon-Tool/')[1];
    var cell = buildCell(imgSelected);
    graph.addCell(cell);
});

//delete button or suppress button detection
$(document).keydown(function (event) {
    if (event.keyCode === 46 || event.keyCode === 8) {
        if (!_.isEmpty(highlightedCell)) {
            var cell = graph.getCell(highlightedCell[0].model.id);
            graph.removeCells(cell);
        }
    }
});

// Highlight control
var highlightedCell = [];
function highlightCell(cellView) {
    var cell = graph.getCell(cellView.model.id);
    if (cell.attributes.type === 'basic.Rect' || cell.attributes.type === 'basic.Path') {
        highlightedCell.forEach(function (cellView) {
            cellView.unhighlight();
        });
        highlightedCell = [];
        cellView.highlight();
        highlightedCell.push(cellView);
    }
}

$("#type").change(function () {
    if (!_.isEmpty(highlightedCell)) {
        highlightedCell[0].model.attr('.type/text', this.options[this.options.selectedIndex].text);
    }
});

$('#task').change(function () {
    if (!_.isEmpty(highlightedCell)) {
        highlightedCell[0].model.attr('.task/text', this.value);
    }
});

$('#description').change(function () {
    if (!_.isEmpty(highlightedCell)) {
        var cell = graph.getCell(highlightedCell[0].model.id);
        cell.editor.description = this.value;
    }
});

function displayTypeEditor(cellView) {
    $('#type-selector').css('display', 'block');
    var selectTag = $("#type");
    selectTag.empty();
    var cell = graph.getCell(cellView.model.id);
    _.forEach(cell.editor.types, function (type) {
        selectTag.append("<option>" + type + "</option>");
    });
    selectTag.val(cellView.model.attr('.type/text'));
}
function appendTaskEditor(cellView) {
    var cell = graph.getCell(cellView.model.id);
    if (!_.isUndefined(cell.editor.task)) {
        $('#task-input').css('display', 'block');
        $("#task").val(cellView.model.attr('.task/text'));
    }
}
function appendDescriptionEditor(cellView) {
    var cell = graph.getCell(cellView.model.id);
    if (!_.isUndefined(cell.editor.description)) {
        $('#description-input').css('display', 'block');
        $("#description").val(cell.editor.description);
    }
}
function showOptions(cellView) {
    displayTypeEditor(cellView);
    appendTaskEditor(cellView);
    appendDescriptionEditor(cellView);
}

paper.on('cell:pointerdown', function (cellView) {
    hideOptions();
    var cell = graph.getCell(cellView.model.id);
    if (!cell.isLink()) {
        highlightCell(cellView);
        showOptions(cellView);
    }
});

function hideOptions() {
    $('#type-selector').css('display', 'none');
    $('#task-input').css('display', 'none');
    $('#description-input').css('display', 'none');
}

paper.on('blank:pointerclick', function () {
    if (!_.isEmpty(highlightedCell)) highlightedCell[0].unhighlight();
    hideOptions();
});

joint.shapes.basic.Decision = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text class="type"/><circle id="input" cx="-50"/><circle id="output" cx="50"/></g>',
    type: 'Decision',
    editor: {
        types: ['Loop', 'And', 'Xor']
    },
    defaults: joint.util.deepSupplement({
        type: 'basic.Rect',
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            rect: {fill: 'white', stroke: 'black', width: 1, height: 1, transform: 'rotate(45)'},
            '.type': {
                'font-size': 14,
                text: 'Loop',
                'ref-x': .5,
                'ref-y': .5,
                ref: 'rect',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
            circle: {
                magnet: true,
                fill: 'green',
                r: 4,
                cy: 50,
                z: 0
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.basic.Generator = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><path/></g><text class="type"/><circle id="input"/><circle id="output"/></g>',
    type: 'Generator',
    editor: {
        types: ['N', 'N+', 'For Each', 'MV', 'N%']
    },
    defaults: joint.util.deepSupplement({
        type: 'basic.Path',
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            path: {
                d: 'M 50 0 L 0 20 0 80 50 100 100 80 100 20 z',
                fill: "white",
                stroke: "black",
                'stroke-width': 1,
                transform: 'rotate(90)'
            },
            '.type': {
                'font-size': 14,
                text: 'N',
                'ref-x': .5,
                'ref-y': .5,
                ref: 'path',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
            circle: {
                magnet: true,
                fill: 'green',
                r: 4,
                cy: 50,
                z: 0
            },
            '#input': {
                cx: -100
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.basic.Task = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><path/></g><text class="type"/><text class="task"/><circle id="input"/><circle id="output"/></g>',
    type: 'Task',
    editor: {
        types: ['Human', 'Collection', 'Computation'],
        task: '',
        description: ''
    },
    defaults: joint.util.deepSupplement({
        type: 'basic.Path',
        position: {x: 450, y: 100},
        size: {width: 200, height: 50},
        attrs: {
            path: {
                d: 'M 0 0 L 200 0 L 200 50 L 0 50 z',
                fill: "white",
                stroke: "black", 'stroke-width': 1
            },
            '.type': {
                'font-size': 12,
                text: 'Human',
                'ref-x': .5,
                'ref-y': .20,
                ref: 'path',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-style': 'italic',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
            '.task': {
                'font-size': 14,
                text: 'Score',
                'ref-x': .5,
                'ref-y': .6,
                ref: 'path',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
            circle: {
                magnet: true,
                fill: 'green',
                r: 4,
                cy: 25,
                z: 0
            },
            '#input': {
                cx: 200
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});

