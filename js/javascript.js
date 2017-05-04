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
$('#exp').click(function(){
    //var jsonObject = graph.toJSON();
    //console.log(jsonObject);
    var text = JSON.stringify(graph);
    console.log(text);
    document.getElementById('result').innerHTML=text;

});

//when we click to import button and we want to import a model,
//we create the new graph
$('#imp').click(function(){
    var text = $("#comment").val()
    console.log(text);
    graph.fromJSON(JSON.parse(text));
    console.log(graph);

});


//so much replicated code.... We should solve this.
$('#xor').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/Xor-Decision.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#and').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/And-Decision.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#loop').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/Loop-Decision.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#inf').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/Inf-Generator.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#n').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/N-Generator.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#nplus').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/NPlus-Generator.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#foreach').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/ForEach-Generator.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});


$('#empty').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/Empty-Aggregation.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#avg').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/AVG-Aggregation.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});

$('#MV').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/MV-Aggregation.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});


$('#nper').click(function(){
    var im = new joint.shapes.basic.Image({
        position: { x: 450, y: 50 },
        size: { width: 150, height: 150 },
        attrs: {
            text: { text: '' },
            image: { 'xlink:href': 'img/N%25-Aggregation.svg', width: 150, height: 150 }
        }
    });
        graph.addCell(im);
});


//delete button or suprimir button detection
$(document).keydown(function(event){
  if(event.keyCode == 46 || event.keyCode == 8) console.log(event.which); 
});


//highlightning of objects when clicking them
var highlighter = V('rect', {
  'stroke': '#ff7e5d',
  'stroke-width': '6px',
  'fill': 'transparent',
  'pointer-events': 'none'
});

paper.off('cell:highlight cell:unhighlight').on({

  'cell:highlight': function(cellView, el, opt) {
    var bbox = V(el).bbox(false, paper.viewport);
    highlighter.attr(bbox);
    V(paper.viewport).append(highlighter);
  },

  'cell:unhighlight': function(cellView, el, opt) {
    highlighter.remove();
  }
});

var highlighted = false;
paper.on('element:pointerdown', function(elementView) {
    if (highlighted) {
    elementView.unhighlight();
    highlighted = false;
  } else {
    elementView.highlight();
    highlighted = true;
  }
});