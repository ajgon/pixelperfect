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
        document.addEventListener( 'mouseup', function() {
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
    }
};