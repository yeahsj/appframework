//desktopBrowsers contributed by Carlos Ouro @ Badoo
//translates desktop browsers events to touch events and prevents defaults
//It can be used independently in other apps but it is required for using the touchLayer in the desktop

(function ($) {
	
	var preventAll = function(e) 
    {
        e.preventDefault();
		e.stopPropagation();
    }
	
	var redirectMouseToTouch = function(type, originalEvent, newTarget) 
	{

		var theTarget = newTarget ? newTarget : originalEvent.target;
		
	    //stop propagation, and remove default behavior for everything but INPUT, TEXTAREA & SELECT fields
	    if (theTarget.tagName.toUpperCase().indexOf("SELECT") == -1 && 
	    theTarget.tagName.toUpperCase().indexOf("TEXTAREA") == -1 && 
	    theTarget.tagName.toUpperCase().indexOf("INPUT") == -1)  //SELECT, TEXTAREA & INPUT
	    {
	        preventAll(originalEvent);
	    }
    
	    var touchevt = document.createEvent("Event");
	    touchevt.initEvent(type, true, true);
		if(type!='touchend'){
		    touchevt.touches = new Array();
		    touchevt.touches[0] = new Object();
		    touchevt.touches[0].pageX = originalEvent.pageX;
		    touchevt.touches[0].pageY = originalEvent.pageY;
			//target
		    touchevt.touches[0].target = theTarget;
		    touchevt.changedTouches = touchevt.touches; //for jqtouch
		    touchevt.targetTouches = touchevt.touches;  //for jqtouch
		}
		//target
	    touchevt.target = theTarget;
		
		touchevt.mouseToTouch = true;
	    theTarget.dispatchEvent(touchevt);
	}
	
    var mouseDown = false,
		lastTarget = null,firstMove=false;

    document.addEventListener("mousedown", function(e) 
    {
		mouseDown = true;
		lastTarget = e.target;
        redirectMouseToTouch("touchstart", e);
        firstMove = true;
    }, true);

    document.addEventListener("mouseup", function(e) 
    {
		if(!mouseDown) return;
        redirectMouseToTouch("touchend", e, lastTarget);	//bind it to initial mousedown target
		lastTarget = null;
		mouseDown = false;
    }, true);

    document.addEventListener("mousemove", function(e) 
    {
        if (!mouseDown) return;
        if(firstMove) return firstMove=false
        redirectMouseToTouch("touchmove", e);
    }, true);
		
		
	//prevent all mouse events which dont exist on touch devices
    document.addEventListener("drag", preventAll, true);
	document.addEventListener("dragstart", preventAll, true);
	document.addEventListener("dragenter", preventAll, true);
	document.addEventListener("dragover", preventAll, true);
	document.addEventListener("dragleave", preventAll, true);
	document.addEventListener("dragend", preventAll, true);
	document.addEventListener("drop", preventAll, true);
	document.addEventListener("selectstart", preventAll, true);
	document.addEventListener("click", function(e) 
    {
		if(!e.mouseToTouch&&e.target==lastTarget){
	        preventAll(e);
		}
    }, true);
	
	
	window.addEventListener("resize",function(){
		var touchevt = document.createEvent("Event");
	 	touchevt.initEvent("orientationchange", true, true);
	    document.dispatchEvent(touchevt);
	},false);
	
})(jq)
