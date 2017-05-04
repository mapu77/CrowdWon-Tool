var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: $('#paper').width(),
    height: $('#paper').height(),
    model: graph,
    gridSize: 15,
    drawGrid: "fixedDot"
});
paper.drawGrid();

paper.on('cell:pointerclick', function (cellView) {
    cellView.highlight();
});

var rect = new joint.shapes.basic.Rect({
    position: {x: 100, y: 30},
    size: {width: 100, height: 30},
    attrs: {rect: {fill: 'blue'}, text: {text: 'my box', fill: 'white'}}
});

var port = {
    id: 'abc',
    group: 'a',
    args: {},
    label: {
        position: {
            name: 'top',
            args: {}
        },
        markup: '<text class="label-text" fill="blue"/>'
    },
    attrs: {text: {text: 'port1'}},
    markup: '<rect width="10" height="10" stroke="red"/>'
};

rect.addPort(port);

var rect2 = rect.clone();
rect2.translate(300);

var link = new joint.dia.Link({
    source: {id: rect.id},
    target: {id: rect2.id}
});

graph.addCells([rect, rect2, link]);



//when we click to export button, 
//we generate the JSON format of the graph we created so far

$('#exp').click(function(){
    var jsonObject = graph.toJSON();
    console.log(jsonObject);
    var text = JSON.stringify(jsonObject);
    console.log(text);
    document.getElementById('result').innerHTML=text;

});