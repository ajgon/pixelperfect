/**
 * HTML5 Drag and Drop sucks real hard, so let's do it old fashioned way. Very simple way. Useless as fully usable dnd function.
 */
/*jslint browser: true, sloppy: true */
/*global Layers */
/*properties
 URL, addEventListener, bind, bottom, call, catchFile, catchFileDragEvent,
 catchFileDropEvent, catchHandlerEvent, className, createObjectURL,
 currentDragged, dataTransfer, draggable, elements, elements_length, files,
 getAttribute, getElementById, getItem, handler, hasOwnProperty, init,
 insertLayer, left, length, makeDraggable, match, mouseDiffX, mouseDiffY,
 offsetLeft, offsetTop, onDrag, onDrop, onMove, options, pageX, pageY,
 preventDefault, querySelector, remember, replace, right, setItem, split,
 stopPropagation, style, target, toString, top, type
 */
var DragAndDrop = {
    /**
     * Makes specified collection elements draggable
     * @param {Collection} collection
     * @param {Object} options
     */
    makeDraggable: function (collection, options) {
        var e;

        if (options === undefined) {
            options = {};
        }

        options = {
            handler: (options.handler === undefined ? false : options.handler),
            remember: (options.remember === undefined ? true : options.remember),
            onDrag: (options.onDrag === undefined ? function () {} : options.onDrag),
            onDrop: (options.onDrop === undefined ? function () {} : options.onDrop),
            onMove: (options.onMove === undefined ? function () {} : options.onMove)
        };

        for (e = 0; e < collection.elements_length; e += 1) {
            if (!options.handler) {
                options.handler = collection.elements[e];
            } else {
                options.handler = collection.elements[e].querySelector(options.handler);
                if (!options.handler) {
                    options.handler = collection.elements[e];
                }
            }

            collection.elements[e].options = options;
            options.handler.addEventListener('mousedown', this.catchHandlerEvent.bind(collection.elements[e]));
            options.handler.draggable = true;

        }
    },
    catchHandlerEvent: function (e) {
        e.preventDefault();
        document.currentDragged = this;
        document.currentDragged.mouseDiffX = e.pageX - this.offsetLeft;
        document.currentDragged.mouseDiffY = e.pageY - this.offsetTop;
        this.options.onDrag.call(this, e);
    },
    catchFileDragEvent: function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'dragover') {
            e.target.className = e.type;
        } else {
            e.target.className = '';
        }
    },
    catchFileDropEvent: function (e) {
        var f, files = e.dataTransfer.files, files_length = files.length;
        e.stopPropagation();
        e.preventDefault();
        e.target.className = '';
        for (f = 0; f < files_length; f += 1) {
            Layers.insertLayer(window.URL.createObjectURL(files[f]));
        }
    },
    catchFile: function (collection) {
        var e, ev, events = ['dragenter', 'dragexit', 'dragover'];
        for (e = 0; e < collection.elements_length; e += 1) {
            for (ev = 0; ev < 3; ev += 1) {
                collection.elements[e].addEventListener(events[ev], this.catchFileDragEvent, false);
            }
            collection.elements[e].addEventListener('drop', this.catchFileDropEvent, false);
        }
    },
    init: function () {
        var draganddrop, element, pos;
        document.addEventListener('mouseup', function (e) {
            if (this.currentDragged) {
                if (this.currentDragged.options.remember) {
                    localStorage.setItem('pixelperfect:draganddrop:' + this.currentDragged.getAttribute('id'), parseInt(this.currentDragged.style.left, 10).toString() + ',' + parseInt(this.currentDragged.style.top, 10).toString());
                }
                this.currentDragged.options.onDrop.call(this.currentDragged, e);
            }
            this.currentDragged = false;
        });

        document.addEventListener('mousemove', function (e) {
            if (this.currentDragged) {
                this.currentDragged.style.right = 'auto';
                this.currentDragged.style.bottom = 'auto';
                this.currentDragged.style.left = (e.pageX - this.currentDragged.mouseDiffX).toString() + 'px';
                this.currentDragged.style.top = (e.pageY - this.currentDragged.mouseDiffY).toString() + 'px';
                this.currentDragged.options.onMove.call(this.currentDragged, e);
            }

        });

        for (draganddrop in localStorage) {
            if (localStorage.hasOwnProperty(draganddrop) && draganddrop.match(/pixelperfect:draganddrop/)) {
                element = document.getElementById(draganddrop.replace('pixelperfect:draganddrop:', ''));
                pos = localStorage.getItem(draganddrop).split(',');
                element.style.left = pos[0] + 'px';
                element.style.top = pos[1] + 'px';
            }
        }
    }
};