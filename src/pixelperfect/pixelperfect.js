/*jslint browser: true, sloppy: true */
/*global $, DragAndDrop, Layers */
/*properties
 DEFAULTS, HTML, STYLES, URL, active, addEventListener, align, appendChild,
 applyOptions, attributes, bind, body, call, catchFile, charCode, checked,
 className, click, clientHeight, createElement, createObjectURL, ctrlKey,
 defaultView, display, elements, event, every, files, fillSelected, focus,
 getAttribute, getComputedStyle, getElementById, getItem, handler,
 hasOwnProperty, head, height, hidden, init, initFileHandling, initHTML,
 initInterfaceEvents, initKeyEvents, initOptions, initStyles, initWrapper,
 innerHTML, innerHeight, innerWidth, insertLayer, keyCode, layers, left,
 makeDraggable, margin, match, max, maxHeight, min, minHeight, minimized,
 name, next, onDrop, opacity, options, overflow, overlay, position,
 preventDefault, previous, refreshInterface, refreshOptions, refreshOverlay,
 remember, remove, removeLayer, replace, round, setAttribute, setByIndex,
 setDefaults, setItem, setOpacity, split, src, storeOptions, style, target,
 toString, top, updateOptions, value, width, wrapper, x, y, zIndex
 */
var PixelPerfect = {
    STYLES: '##CSS_BASE64##',
    HTML: '##HTML##',
    DEFAULTS: {
        overlay: 'below',
        opacity: '50',
        position: {
            x: 0,
            y: 0
        },
        minimized: false,
        hidden: false,
        active: true
    },
    options: {
        overlay: false,
        opacity: false,
        position: false,
        align: false,
        minimized: false,
        hidden: false,
        active: false
    },
    layers: [],
    wrapper: null,

    refreshOverlay: function (layer_id) {
        var overlay;

        if (layer_id !== undefined) {
            $('#pixelperfect-overlay').remove();
            overlay = new Image();
            overlay.src = localStorage.getItem(layer_id);
            overlay.setAttribute('id', 'pixelperfect-overlay');
            document.body.appendChild(overlay);
            DragAndDrop.makeDraggable($(overlay), {
                remember: false,
                onDrop: function () {
                    PixelPerfect.options.position.x = parseInt(this.style.left, 10);
                    PixelPerfect.options.position.y = parseInt(this.style.top, 10);
                    PixelPerfect.refreshInterface.call(PixelPerfect);
                }
            });
        } else {
            overlay = document.getElementById('pixelperfect-overlay');
        }

        if (!overlay) {
            return false;
        }

        if (this.options.overlay === 'below') {
            $(this.wrapper).setOpacity(this.options.opacity);
            $(overlay).setOpacity(100);
            overlay.style.zIndex = '-2147483646';
        } else {
            $(this.wrapper).setOpacity(100);
            $(overlay).setOpacity(this.options.opacity);
            overlay.style.zIndex = '2147483646';
        }

        overlay.style.left = this.options.position.x + 'px';
        overlay.style.top = this.options.position.y + 'px';
        this.updateOptions();
    },

    refreshInterface: function () {
        var maxHeight, layers = $('#pixelperfect #pixelperfect-layers').elements[0],
            layerHeight;
        if (this.options.minimized) {
            document.getElementById('pixelperfect-content').style.display = 'none';
        } else {
            document.getElementById('pixelperfect-content').style.display = 'block';
        }

        if (this.options.hidden) {
            document.getElementById('pixelperfect').style.display = 'none';
        } else {
            document.getElementById('pixelperfect').style.display = 'block';
        }

        if (document.getElementById('pixelperfect-overlay')) {
            if (this.options.active) {
                document.getElementById('pixelperfect-overlay').style.display = 'block';
                this.refreshOverlay();
            } else {
                document.getElementById('pixelperfect-overlay').style.display = 'none';
                $('body > .pixelperfect-wrapper').setOpacity(100);
            }
        }

        this.updateOptions();
        this.storeOptions();

        setTimeout(function () {
            layerHeight = $('#pixelperfect #pixelperfect-drop-file').elements[0].clientHeight;
            maxHeight = window.innerHeight - document.getElementById('pixelperfect').clientHeight - 40 + layers.clientHeight;
            layers.style.maxHeight = Math.max(layerHeight, maxHeight).toString() + 'px';
        }, 40);
    },

    refreshOptions: function () {
        PixelPerfect.applyOptions();
        PixelPerfect.storeOptions();
        PixelPerfect.refreshOverlay();
    },

    updateOptions: function () {
        document.getElementById('pixelperfect-overlay-' + this.options.overlay).checked = true;
        document.getElementById('pixelperfect-opacity').value = this.options.opacity;
        document.getElementById('pixelperfect-opacity-range').value = this.options.opacity;
        document.getElementById('pixelperfect-x').value = this.options.position.x;
        document.getElementById('pixelperfect-y').value = this.options.position.y;
    },

    applyOptions: function () {
        this.options.overlay = document.getElementById('pixelperfect-overlay-over').checked ? 'over' : 'below';
        this.options.opacity = document.getElementById('pixelperfect-opacity').value;
        this.options.position.x = (parseInt(document.getElementById('pixelperfect-x').value, 10) || 0).toString();
        this.options.position.y = (parseInt(document.getElementById('pixelperfect-y').value, 10) || 0).toString();
    },

    storeOptions: function () {
        var option;

        for (option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                if (option === 'position') {
                    localStorage.setItem('pixelperfect:options:' + option, this.options[option].x + ',' + this.options[option].y);
                } else {
                    localStorage.setItem('pixelperfect:options:' + option, this.options[option]);
                }
            }
        }
    },

    setDefaults: function () {
        var option;

        for (option in this.DEFAULTS) {
            if (this.DEFAULTS.hasOwnProperty(option) && !localStorage.getItem('pixelperfect:options:' + option)) {
                if (option === 'position') {
                    localStorage.setItem('pixelperfect:options:' + option, this.DEFAULTS[option].x + ',' + this.DEFAULTS[option].y);
                } else {
                    localStorage.setItem('pixelperfect:options:' + option, this.DEFAULTS[option]);
                }
            }
        }
    },

    align: function (where) {
        var x = false, y = false,
            overlay = document.getElementById('pixelperfect-overlay');

        switch (where) {
        case 'left':
            x = 0;
            break;
        case 'center':
            x = Math.round(window.innerWidth / 2.0 - overlay.width / 2.0);
            break;
        case 'right':
            x = window.innerWidth - overlay.width;
            break;
        case 'top':
            y = 0;
            break;
        case 'middle':
            y = Math.round(window.innerHeight / 2.0 - overlay.height / 2.0);
            break;
        case 'bottom':
            y = window.innerHeight - overlay.height;
            break;
        }

        if (x !== false) {
            document.getElementById('pixelperfect-x').value = x;
        }

        if (y !== false) {
            document.getElementById('pixelperfect-y').value = y;
        }

        PixelPerfect.refreshOptions();
    },

    initOptions: function () {
        var option, pos;

        for (option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                if (option === 'position') {
                    pos = localStorage.getItem('pixelperfect:options:' + option).split(',');
                    this.options[option] = {};
                    this.options[option].x = pos[0];
                    this.options[option].y = pos[1];
                } else if (option === 'active' || option === 'minimized' || option === 'hidden') {
                    this.options[option] = (localStorage.getItem('pixelperfect:options:' + option) === 'true');
                } else {
                    this.options[option] = localStorage.getItem('pixelperfect:options:' + option);
                }
            }
        }
    },

    initFileHandling: function () {
        $('#pixelperfect-upload-file').event('click', function (e) {
            e.preventDefault();
            document.getElementById('pixelperfect-fileinput').click();
        });
        $('#pixelperfect-fileinput').event('change', function (e) {
            Layers.insertLayer(window.URL.createObjectURL(e.target.files[0]));
        }.bind(this));
        $('#pixelperfect-file').event('keypress', function (e) {
            if (e.keyCode === 13 || e.charCode === 13) {
                Layers.insertLayer(this.elements[0].value);
            }
        });
    },

    initWrapper: function () {
        var wrapper = document.createElement('div'),
            body_css = document.defaultView.getComputedStyle(document.body),
            body_attributes = document.body.attributes,
            wrapper_css = document.defaultView.getComputedStyle(wrapper),
            tmp,
            el,
            adjustWrapper;

        for (el in body_attributes) {
            if (body_attributes.hasOwnProperty(el)) {
                wrapper.setAttribute(body_attributes[el].name, body_attributes[el].value);
            }
        }

        for (el in body_css) {
            if (body_css.hasOwnProperty(el) && !el.match(/^[0-9]/) && el.match(/^background/) && wrapper_css[el] !== body_css[el]) {
                tmp = wrapper_css[el];
                wrapper.style[el] = body_css[el];
                document.body.style[el] = tmp;
            }
        }

        wrapper.className = document.body.className + ' pixelperfect-wrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        wrapper.style.margin = '0';

        $('body > *').elements.every(function (element) {
            wrapper.appendChild(element);
            return true;
        });

        document.body.appendChild(wrapper);

        this.wrapper = wrapper;

        adjustWrapper = function () {
            this.wrapper.style.minHeight = window.innerHeight.toString() + 'px';
        }.bind(this);
        adjustWrapper();

        window.addEventListener('resize', adjustWrapper);
    },

    initHTML: function () {
        var pixelperfect = document.createElement('div');
        pixelperfect.setAttribute('id', 'pixelperfect');
        pixelperfect.innerHTML = this.HTML;
        document.body.appendChild(pixelperfect);
    },

    initStyles: function () {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('media', 'all');
        link.setAttribute('href', 'data:text/css;base64,' + this.STYLES);
        document.head.appendChild(link);
    },

    initInterfaceEvents: function () {
        $('#pixelperfect-overlay-over, #pixelperfect-overlay-below, #pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y').event('change', function () {

            document.getElementById('pixelperfect-opacity-range').value = document.getElementById('pixelperfect-opacity').value;
            this.applyOptions.call(this);
            this.storeOptions.call(this);
            this.refreshOverlay.call(this);
        }.bind(this));
        $('#pixelperfect-aligns > .pixelperfect-button').event('click', function (e) {
            e.preventDefault();

            PixelPerfect.align(this.elements[0].getAttribute('id').replace(/pixelperfect-[a-z]+-/, ''));
        });

        $('#pixelperfect-top > .pixelperfect-button').event('click', function (e) {
            var option = this.elements[0].getAttribute('id').replace('pixelperfect-', '');
            e.preventDefault();

            PixelPerfect.options[option] = !PixelPerfect.options[option];

            PixelPerfect.refreshInterface();
        });

        $('#pixelperfect-opacity-range').event('change', function () {
            document.getElementById('pixelperfect-opacity').value = this.elements[0].value;
            PixelPerfect.applyOptions();
            PixelPerfect.refreshInterface();
        });
    },
    initKeyEvents: function () {
        var overlayMode = false, positionMode = false, alignMode = false, fileMode = false;
        $('#pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y').event('keypress', function (e) {
            if (alignMode || overlayMode || positionMode || fileMode) {
                e.preventDefault();
                return;
            }
            var newValue = parseInt(this.elements[0].value, 10);
            if (e.keyCode === 38 || e.keyCode === 40) {
                newValue = newValue + (e.keyCode === 38 ? 1 : -1);
            }
            if (this.elements[0].getAttribute('data-max')) {
                newValue = Math.min(parseInt(this.elements[0].getAttribute('data-max'), 10), newValue);
            }
            if (this.elements[0].getAttribute('data-min')) {
                newValue = Math.max(parseInt(this.elements[0].getAttribute('data-min'), 10), newValue);
            }
            this.elements[0].value = newValue;
            PixelPerfect.refreshOptions();
        });

        $(document).event('keypress', function (e) {
            var overlayRadio = false, option;
            // overlay
            // over [ O ]
            if (overlayMode && !e.ctrlKey && e.charCode === 111) {
                overlayRadio = document.getElementById('pixelperfect-overlay-over');
            }
            // below [ B ]
            if (overlayMode && !e.ctrlKey && e.charCode === 98) {
                overlayRadio = document.getElementById('pixelperfect-overlay-below');
            }
            if (overlayRadio) {
                overlayRadio.setAttribute('checked', 'checked');
                overlayRadio.checked = true;
            }
            overlayMode = (e.ctrlKey && e.charCode === 111);

            // position
            // x [ X ]
            if (positionMode && !e.ctrlKey && e.charCode === 120) {
                document.getElementById('pixelperfect-x').focus();
            }
            // y [ Y ]
            if (positionMode && !e.ctrlKey && e.charCode === 121) {
                document.getElementById('pixelperfect-y').focus();
            }
            positionMode = (e.ctrlKey && e.charCode === 112);

            // align
            // left [ L ]
            if (alignMode && !e.ctrlKey && e.charCode === 108) {
                PixelPerfect.align('left');
            }
            // center [ C ]
            if (alignMode && !e.ctrlKey && e.charCode === 99) {
                PixelPerfect.align('center');
            }
            // right [ R ]
            if (alignMode && !e.ctrlKey && e.charCode === 114) {
                PixelPerfect.align('right');
            }
            // top [ T ]
            if (alignMode && !e.ctrlKey && e.charCode === 116) {
                PixelPerfect.align('top');
            }
            // middle [ M ]
            if (alignMode && !e.ctrlKey && e.charCode === 109) {
                PixelPerfect.align('middle');
            }
            // bottom [ B ]
            if (alignMode && !e.ctrlKey && e.charCode === 98) {
                PixelPerfect.align('bottom');
            }
            alignMode = (e.ctrlKey && e.charCode === 97);

            // file
            // upload [ F ]
            if (fileMode && !e.ctrlKey && e.charCode === 102) {
                document.getElementById('pixelperfect-fileinput').click();
            }
            // URL [ U ]
            if (fileMode && !e.ctrlKey && e.charCode === 117) {
                document.getElementById('pixelperfect-file').focus();
            }
            fileMode = (e.ctrlKey && e.charCode === 102);

            // layer
            // number [ 1-9,0 ]
            if (e.ctrlKey && e.charCode >= 48 && e.charCode <= 57) {
                Layers.setByIndex(e.charCode === 48 ? 9 : e.charCode - 49);
            }
            // next [ ] ]
            if (e.ctrlKey && e.charCode === 29) {
                Layers.next();
            }
            // prev [ [ ]
            if (e.ctrlKey && e.charCode === 27) {
                Layers.previous();
            }
            // remove [ R ]
            if (e.ctrlKey && e.charCode === 114) {
                Layers.removeLayer(Layers.fillSelected());
            }

            // opacity [ T ]
            if (e.ctrlKey && e.charCode === 116) {
                document.getElementById('pixelperfect-opacity').focus();
            }

            // hide [ H ]
            // minimize [ M ]
            // on/off [ X ]
            if (e.ctrlKey && (e.charCode === 104 || e.charCode === 109 || e.charCode === 120)) {
                switch (e.charCode) {
                case 104:
                    option = 'hidden';
                    break;
                case 109:
                    option = 'minimized';
                    break;
                case 120:
                    option = 'active';
                    break;
                }
                PixelPerfect.options[option] = !PixelPerfect.options[option];
                PixelPerfect.refreshInterface();
            }

            PixelPerfect.refreshOptions();
        });
    },

    init: function () {
        this.setDefaults();
        this.initOptions();

        this.initWrapper();
        this.initHTML();
        this.initStyles();
        this.initInterfaceEvents();
        this.initKeyEvents();

        DragAndDrop.init();
        DragAndDrop.makeDraggable($('#pixelperfect'), {handler: '#pixelperfect-top'});
        DragAndDrop.catchFile($('#pixelperfect-drop-file'));
        Layers.init();
        this.initFileHandling();
        this.refreshInterface();
    }

};