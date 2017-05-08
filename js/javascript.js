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


var rect = new joint.shapes.basic.Rect({
    position: {x: 100, y: 30},
    size: {width: 100, height: 30},
    attrs: {rect: {fill: '#adb5c2'}, text: {text: 'my box', fill: 'white'}}
});
/*
 var port = {
 id: 'abc',
 group: 'a',
 args: {},
 label: {
 position: {
 name: 'top center',
 args: {}
 },
 markup: '<text class="label-text" fill="blue"/>'
 },
 attrs: {text: {text: 'port1'}},
 markup: '<rect width="10" height="10" stroke="red"/>'
 };

 rect.addPort(port);*/

var rect2 = rect.clone();
rect2.translate(300);

var link = new joint.dia.Link({
    source: {id: rect.id},
    target: {id: rect2.id}
});

graph.addCells([rect, rect2, link]);


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

// General function to add element on graph when click on it
$('.crowdwon-item').click(function (element) {
    var imgSelected = element.target.src.split('CrowdWon-Tool/')[1];
    var cell = buildCell(imgSelected);
    graph.addCell(cell);
});

function buildCell(imgSelected) {
    if (imgSelected === "img/decision.svg") {
        return new joint.shapes.basic.Decision();
    } else if (imgSelected === "img/aggregation.svg") {
        return new joint.shapes.basic.Generator();
    }
    else {
        alert("Not implemented yet");
        throw Error("Not implemented yet");
    }
}

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
            highlightedCell = [];
        });
        cellView.highlight();
        highlightedCell.push(cellView);
    }
}

function appendNameEditor(cellView) {
    var selectTag = $("#type-selector");
    selectTag.empty();
    var cell = graph.getCell(cellView.model.id);
    if (cell.type === "Decision") {
        selectTag.append("<option>Loop</option><option>And</option><option>Xor</option>");
    } else if(cell.type === "Generator") {
        selectTag.append("<option>N</option><option>N+</option><option>For Each</option>");
    }
}
function showOptions(cellView) {
    $("#cell-options").css("display", "block");
    appendNameEditor(cellView);
}

paper.on('cell:pointerdown', function (cellView) {
    highlightCell(cellView);
    showOptions(cellView);
});

function hideOptions() {
    $("#cell-options").css("display", "none");
}

paper.on('blank:pointerclick', function () {
    if (!_.isEmpty(highlightedCell)) highlightedCell[0].unhighlight();
    hideOptions();
});

joint.shapes.basic.Decision = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
    type: 'Decision',
    defaults: joint.util.deepSupplement({
        type: 'basic.Rect',
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            rect: {fill: 'white', stroke: 'black', width: 1, height: 1, transform: 'rotate(45)'},
            text: {
                'font-size': 14,
                text: '',
                'ref-x': .5,
                'ref-y': .5,
                ref: 'rect',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.basic.Generator = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><path/><text/></g>',
    type: 'Generator',
    defaults: joint.util.deepSupplement({
        type: 'basic.Path',
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            path: { d: 'M 50 0 L 0 20 0 80 50 100 100 80 100 20 z', fill: "white", stroke:"black", 'stroke-width': 1, transform: 'rotate(90)'},
            text: {
                'font-size': 14,
                text: '',
                'ref-x': .5,
                'ref-y': .5,
                ref: 'path',
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                fill: 'black',
                'font-family': 'Roboto, sans-serif',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});