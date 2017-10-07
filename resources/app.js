///
/// presentation

// Reveal is loaded and ready
Reveal.addEventListener( 'ready', function( event ) {
	// event.currentSlide, event.indexh, event.indexv

    if (document.documentElement.classList.contains("xrslide")) {
        document.body.style.backgroundColor = "transparent";
    } else {
        document.body.style.backgroundColor = "black";        
    }

    var xrSession = document.querySelector('.webxr-sessions');
    if (xrSession) {
        xrSession.style.visibility = "hidden";        
    }
    var xrReality = document.querySelector('.webxr-realities');
    if (xrReality) {
        xrReality.style.visibility = "hidden";        
    }
} );


// new slide
Reveal.addEventListener( 'slidechanged', function( event ) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv

    var xrSession = document.querySelector('.webxr-sessions');
    var xrReality = document.querySelector('.webxr-realities');

    if (document.documentElement.classList.contains("xrslide")) {
        document.body.style.backgroundColor = "transparent";
        if (xrSession) {
            xrSession.style.visibility = "visible";
        }
        if (xrReality) {
            xrReality.style.visibility = "visible";
        }
    } else {
        document.body.style.backgroundColor = "black";
        if (xrSession) {
            xrSession.style.visibility = "hidden";
        }
        if (xrReality) {
            xrReality.style.visibility = "hidden";
        }
    }  
} );

// If you set ``data-state="somestate"`` on a slide ``<section>``, "somestate" will 
// be applied as a class on the document element when that slide is opened.
// Furthermore you can also listen to these changes in state via JavaScript:

Reveal.addEventListener( 'xrslide', function( event ) {
	// // event.active
    // var xrSession = document.querySelector('.webxr-sessions');
    // var xrReality = document.querySelector('.webxr-realities');

    // if (event.active) {
    //     document.body.style.backgroundColor = "transparent";
    //     xrSession.style.visibility = "visible";
    //     xrReality.style.visibility = "visible";
    // } else {
    //     document.body.style.backgroundColor = "black";
    //     xrSession.style.visibility = "hidden";
    //     xrReality.style.visibility = "hidden";
    // }
} );

Reveal.addEventListener( 'arstuff', function( event ) {
} );

//var spinbox = document.querySelector('#spinbox');
Reveal.addEventListener( 'spinbox', function( event ) {
	// event.active
  //  spinbox.setAttribute('visible', event.active);
} );

//var geoAR = document.querySelector('#geo');
Reveal.addEventListener( 'geomarkers', function( event ) {
	// event.active
  //  geoAR.setAttribute('visible', event.active);
} );

//var vuforia = document.querySelector('#frame');
Reveal.addEventListener( 'vuforia', function( event ) {
	// event.active
  //  vuforia.setAttribute('trackvisibility', event.active);
} );

//
// fragments.  Perhaps I can add/remove 3D content when I step through some fragmets in a slide
//

Reveal.addEventListener( 'fragmentshown', function( event ) {
	// event.fragment = the fragment DOM element
} );
Reveal.addEventListener( 'fragmenthidden', function( event ) {
	// event.fragment = the fragment DOM element
} );

