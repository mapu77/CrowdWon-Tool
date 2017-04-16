// target elements with the "draggable" class

/*interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    interaction.start({ name: 'drag-1' },
        event.interactable,
        clone);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
*/

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("#export").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}




interact('.crowdwon-item').draggable({
  'manualStart' : true,      
  'onmove' : function (event) {

    var target = event.target;

    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

  },
  'onend' : function (event) {

    console.log('Draggable: ', event);

  }
}).on('move', function (event) {

  var interaction = event.interaction;

  // if the pointer was moved while being held down
  // and an interaction hasn't started yet
  if (interaction.pointerIsDown && !interaction.interacting() 
    && event.currentTarget.classList.contains('drag-element-source')) {

    var original = event.currentTarget;
    
    // create a clone of the currentTarget element
    var clone = event.currentTarget.cloneNode(true);

    // Remove CSS class using JS only (not jQuery or jQLite) - http://stackoverflow.com/a/2155786/4972844
    clone.className = clone.className.replace(/\bdrag-element-source\b/,'');
      
    // insert the clone to the page
    // TODO: position the clone appropriately
    document.getElementById('main').appendChild(clone);

    // start a drag interaction targeting the clone
    interaction.start({ name: 'drag' }, event.interactable, clone);

  } else {
    interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
  }

});

// enable draggables to be dropped into this
interact('#drop-container').dropzone({
  // only accept elements matching this CSS selector
  accept: '.crowdwon-item',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:
  ondropactivate: function (event) {
      
    // add active dropzone feedback
    event.target.classList.add('drop-active');
      
  },
  ondragenter: function (event) {
      
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
      
  },
  ondragleave: function (event) {
      
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
      
  },
  ondrop: function (event) {

      console.log('Drop Zone: ', event);
      console.log('Dropped Element: ', event.relatedTarget);
      
      event.relatedTarget.classList.remove('can-drop');
      event.relatedTarget.classList.add('dropped');
      
  },
  ondropdeactivate: function (event) {
      
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
      
  }
});

