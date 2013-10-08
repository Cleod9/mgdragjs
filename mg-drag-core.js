/*
* MGDragObject - by Greg McLeod
*
* Description: This code allows you to make an object draggable without the need for jQuery. 
* I wrote this mainly to practice writing things myself in JS, since I was annoyed with how someone else had written theirs
* Naturally jQuery has many more features, but this was fun practice =]
*
*
* Use as you wish, no credit is needed. Just don't claim it as anyone else's!
*/


/* 
* elem_drag_arg = the element that will be moved around
* elem_grab_arg = the element that is clickable (so you can create "grab" handles, will default to the first parameter)
* startCallback_arg = an optional function to call when the dragging starts
* moveCallback_arg = an optional function to call while the mouse moves during dragging
* endCallback_arg = an optional function to call when the dragging ends
*/

function MGDragObject(elem_drag_arg, elem_grab_arg, startCallback_arg, moveCallback_arg, endCallback_arg)
{
	//Initialize all 
	var elem_drag = elem_drag_arg;
	var elem_grab = (elem_grab_arg) ? elem_grab_arg : elem_drag_arg;
	var startCallback = startCallback_arg;
	var moveCallback = moveCallback_arg;
	var endCallback = endCallback_arg;
	var start_position = {x: 0, y: 0};
	var start_position_global = {x: 0, y: 0};
	var disposed = false;
	var dragging = false;
	
	
	//Preps events and the initial positions of the dragged element
	function startDragging(e)
	{
		if(disposed)
			return;
		dragging = true;
		window.addEventListener('mousemove', update);
		window.addEventListener('mouseup', stopDragging);
		start_position.x = e.pageX - elem_drag.offsetLeft;
		start_position.y = e.pageY - elem_drag.offsetTop;
		start_position_global.x = e.pageX;
		start_position_global.y = e.pageY;
		if(startCallback)
			startCallback(elem_drag);
	}
	
	//Called automatically as the mouse moves while the dragging occurs
	function update(e)
	{
		if(disposed)
			return;
		if(dragging)
		{
			var targetPoint = {x: start_position_global.x + (e.pageX - start_position_global.x) - start_position.x, y: start_position_global.y + (e.pageY - start_position_global.y) - start_position.y };
			elem_drag.style.left = targetPoint.x;
			elem_drag.style.top = targetPoint.y;
			if(moveCallback)
				moveCallback(elem_drag, targetPoint);
		}
	}
	
	//Called automatically once the mouse has been let go
	function stopDragging(e)
	{
		if(disposed)
			return;
		dragging = false;
		window.removeEventListener('mousemove', update);
		window.removeEventListener('mouseup', stopDragging);
		if(endCallback)
			endCallback(elem_drag);
	}
	
	//Call this once you're permanently done with the object for proper cleanup
	this.dispose = function()
	{
		elem_grab.removeEventListener('mousedown', startDragging);
		if(dragging)
		{
			window.removeEventListener('mousemove', update);
			window.removeEventListener('mouseup', stopDragging);
		}
		elem_drag = null;
		elem_grab = null;
		startCallback = null;
		moveCallback = null;
		disposed = true;
		dragging = false;
	}
	
	elem_grab.addEventListener('mousedown', startDragging);
}