/**
 * HTML5 Drag and Drop sucks real hard, so let's do it old fashioned way. Very simple way. Useless as fully usable dnd function.
 */
DragAndDrop = {
    /**
     * Makes specified collection elements draggable
     * @param {Collection} collection
     * @param {Object} options
     */
    makeDraggable: function( collection, options ) {
        var e;

        if( options === undefined) {
            options = {};
        }

        options = {
            handler: (options.handler === undefined ? false : options.handler),
            remember: (options.remember === undefined ? true : options.remember),
            onDrag: (options.onDrag === undefined ? function() {} : options.onDrag),
            onDrop: (options.onDrop === undefined ? function() {} : options.onDrop),
            onMove: (options.onMove === undefined ? function() {} : options.onMove)
        };

        for(e = 0; e < collection.elements_length; e++) {
            if( !options.handler ) {
                options.handler = collection.elements[e];
            } else {
                options.handler = collection.elements[e].querySelector( options.handler );
                if( !options.handler ) {
                    options.handler = collection.elements[e];
                }
            }

            collection.elements[e].options = options;

            options.handler.addEventListener( 'mousedown', function(e) {
                e.preventDefault();
                document.currentDragged = this;
                document.currentDragged.mouseDiffX = e.pageX - this.offsetLeft;
                document.currentDragged.mouseDiffY = e.pageY - this.offsetTop;
                this.options.onDrag.call(this, e);
            }.bind( collection.elements[e] ) );

        }
    },

    init: function() {
        var draganddrop, element, pos;
        document.addEventListener( 'mouseup', function(e) {
            if(this.currentDragged) {
                if(this.currentDragged.options.remember) {
                    localStorage.setItem('pixelperfect:draganddrop:' + this.currentDragged.getAttribute('id'), parseInt(this.currentDragged.style.left, 10).toString() + ',' + parseInt(this.currentDragged.style.top, 10).toString());
                }
                this.currentDragged.options.onDrop.call(this.currentDragged, e);
            }
            this.currentDragged = false;
        } );

        document.addEventListener( 'mousemove', function(e) {
            if( this.currentDragged ) {
                this.currentDragged.style.right = 'auto';
                this.currentDragged.style.bottom = 'auto';
                this.currentDragged.style.left = (e.pageX - this.currentDragged.mouseDiffX).toString() + 'px';
                this.currentDragged.style.top = (e.pageY - this.currentDragged.mouseDiffY).toString() + 'px';
                this.currentDragged.options.onMove.call(this.currentDragged, e);
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