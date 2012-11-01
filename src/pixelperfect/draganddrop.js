/**
 * HTML5 Drag and Drop sucks real hard, so let's do it old fashioned way. Very simple way. Useless as fully usable dnd function.
 */
DragAndDrop = {
    /**
     * Makes specified collection elements draggable
     * @param {Collection} collection
     * @param {Collection} [handler] Handler element which will be used to trigger drag. If not provided, whole element will be used
     */
    makeDraggable: function( collection, handler ) {
        var e;

        for(e = 0; e < collection.elements_length; e++) {
            if( handler === undefined ) {
                handler = collection.elements[e];
            } else {
                handler = collection.elements[e].querySelector( handler );
                if( !handler ) {
                    handler = collection.elements[e];
                }
            }

            handler.addEventListener( 'mousedown', function(e) {
                document.currentDragged = this;
                document.currentDragged.mouseDiffX = e.pageX - this.offsetLeft;
                document.currentDragged.mouseDiffY = e.pageY - this.offsetTop;
            }.bind( collection.elements[e] ) );

        }
    },

    init: function() {
        var draganddrop, element, pos;
        document.addEventListener( 'mouseup', function() {
            if(this.currentDragged) {
                localStorage.setItem('pixelperfect:draganddrop:' + this.currentDragged.getAttribute('id'), parseInt(this.currentDragged.style.left, 10).toString() + ',' + parseInt(this.currentDragged.style.top, 10).toString());
            }
            this.currentDragged = false;
        } );

        document.addEventListener( 'mousemove', function(e) {
            if( this.currentDragged ) {
                this.currentDragged.style.right = 'auto';
                this.currentDragged.style.bottom = 'auto';
                this.currentDragged.style.left = (e.pageX - this.currentDragged.mouseDiffX).toString() + 'px';
                this.currentDragged.style.top = (e.pageY - this.currentDragged.mouseDiffY).toString() + 'px';
            }

        });

        for(draganddrop in localStorage) {
            if( draganddrop.match(/pixelperfect:draganddrop/) && localStorage.hasOwnProperty(draganddrop) ) {
                element = document.getElementById( draganddrop.replace('pixelperfect:draganddrop:', '') );
                pos = localStorage.getItem(draganddrop).split(',');
                element.style.left = pos[0] + 'px';
                element.style.top = pos[1] + 'px';
            }
        }
    }
};