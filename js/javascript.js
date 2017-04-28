/* Stencil definition */

var stencil = new joint.dia.Graph;
var stencilPaper = new joint.dia.Paper({
  el: $('#stencil'),
  width: $('#stencil').width(),
  height: $('#stencil').height(),
  model: stencil,
  interactive: false
});
stencilPaper.drawGrid();

var elems = {};

var stencilAVGAggregation = new joint.shapes.basic.Image({
  position : {
    x : 30,
    y : 30
  },
  size : {
    width : 100,
    height : 100
  },
  attrs : {
    image : {
      "xlink:href" : "img/AVG-Aggregation.svg",
      width : 16,
      height : 16
    }
  }
});

var stencilAndDesicion = new joint.shapes.basic.Image({
  position : {
    x : 30,
    y : 130
  },
  size:{
    width : 100,
    height : 100
  },
  attrs : {
    image : {
      "xlink:href" : "img/And-Decision.svg",
      width : 16,
      height : 16
    }
  }
});

var stencilClock = new joint.shapes.basic.Image({
  position : {
    x : 30,
    y : 230
  },
  size:{
    width : 100,
    height : 100
  },
  attrs : {
    image : {
      "xlink:href" : "img/Clock-Scheduler.svg",
      width : 16,
      height : 16
    }
  }
});

stencil.addCells([stencilAVGAggregation, stencilAndDesicion, stencilClock]);

/* End of Stencil */


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




//var stencilAVGAggregation = document.getElementById("avg-aggregation");
var AVGAggregation = new joint.shapes.basic.Image({
  position : {
    x : 100,
    y : 100
  },
  size : {
    width : 100,
    height : 100
  },
  attrs : {
    image : {
      "xlink:href" : "img/AVG-Aggregation.svg",
      width : 16,
      height : 16
    }
  }
});

graph.addCells([rect, rect2, link, AVGAggregation]);
