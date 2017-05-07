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
    var target = element.target;
    var im = new joint.shapes.basic.Image({
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            text: {text: ''},
            image: {'xlink:href': target.src.split('CrowdWon-Tool/')[1], width: 150, height: 150}
        }
    });
    graph.addCell(im);
});

$('.crowdwon-container').click(function (element) {
    var target = element.target.children[0];
    var cell = new joint.shapes.basic.Image({
        position: {x: 450, y: 100},
        size: {width: 100, height: 100},
        attrs: {
            text: {text: ''},
            image: {'xlink:href': target.src.split('CrowdWon-Tool/')[1], width: 150, height: 150}
        }
    });
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
paper.on('cell:pointerdown', function (cellView) {
    var cell = graph.getCell(cellView.model.id);
    if (cell.attributes.type === 'basic.Rect' || cell.attributes.type === 'basic.Image') {
        highlightedCell.forEach(function (cellView) {
            cellView.unhighlight();
            highlightedCell = [];
        });
        cellView.highlight();
        highlightedCell.push(cellView);
    }
});

paper.on('blank:pointerclick', function () {
    if (!_.isEmpty(highlightedCell)) highlightedCell[0].unhighlight();
});