/*jslint browser: true, sloppy: true */
/*global $, DragAndDrop, Layers, PP */
/*properties
 B, C, DEFAULTS, DOM, DOWN, F, HTML, L, M, O, R, STYLES, T, U, UP, X, Y, '^<',
 '^>', '^?', '^A', '^F', '^H', '^M', '^O', '^P', '^R', '^T', '^X', '^[', '^]',
 active, addEventListener, align, animate, appendChild, applyOptions,
 arrowEvent, attributes, body, call, catchFile, charCode, checked, className,
 click, clientHeight, content, createElement, ctrlKey, defaultView, display,
 elements, event, every, file, fileinput, files, fillSelected, focus,
 getAttribute, getComputedStyle, getElementById, getItem, handler,
 hasOwnProperty, head, height, help, hidden, init, initFileHandling, initHTML,
 initInterfaceEvents, initKeyEvents, initOptions, initStyles, initWrapper,
 innerHTML, innerHeight, innerWidth, insertLayer, keyCode, keys, layers, left,
 makeDraggable, margin, match, max, maxHeight, min, minHeight, minimized,
 name, next, onDrop, opacity, 'opacity-range', options, overflow, overlay,
 'overlay-below', 'overlay-over', position, preventDefault, previous,
 readFile, refreshInterface, refreshOptions, refreshOverlay, remember, remove,
 removeLayer, replace, round, self, setAttribute, setByIndex, setDefaults,
 setItem, setOpacity, setParam, split, src, storeOptions, style, target,
 toString, toggleClass, top, updateOptions, value, visible, which, width,
 wrapper, x, y, zIndex
 */
var PixelPerfect = {
    STYLES: '##CSS_BASE64##',
    HTML: '##HTML##',
    DOM: {},
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
    help: function () {
        var help = $('#pixelperfect-help-popup');
        help.elements[0].style.zIndex = (help.elements[0].visible ? -2147483647 : 2147483647);
        help.animate({
            opacity: (help.elements[0].visible ? 0 : 1)
        });
        $('#pixelperfect-help').toggleClass('pixelperfect-button-active', !help.elements[0].visible);
        help.elements[0].visible = !help.elements[0].visible;
    },
    refreshOverlay: function (layer_id) {
        var overlay, self = this;

        if (layer_id !== undefined) {
            $('#pixelperfect-overlay').remove();
            overlay = new Image();
            overlay.src = localStorage.getItem(layer_id);
            overlay.setAttribute('id', 'pixelperfect-overlay');
            if (!this.options.active) {
                overlay.style.display = 'none';
            }
            document.body.appendChild(overlay);
            DragAndDrop.makeDraggable($(overlay), {
                remember: false,
                onDrop: function () {
                    self.options.position.x = parseInt(this.style.left, 10);
                    self.options.position.y = parseInt(this.style.top, 10);
                    self.refreshInterface.call(self);
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
            overlay.style.zIndex = '-2147483645';
        } else {
            $(this.wrapper).setOpacity(100);
            $(overlay).setOpacity(this.options.opacity);
            overlay.style.zIndex = '2147483645';
        }

        if (!this.options.active) {
            $('body > .pixelperfect-wrapper').setOpacity(100);
        }

        overlay.style.left = this.options.position.x + 'px';
        overlay.style.top = this.options.position.y + 'px';
        this.updateOptions();
    },

    refreshInterface: function () {
        var maxHeight, layers = $('#pixelperfect #pixelperfect-layers').elements[0],
            layerHeight, overlay, self = this;
        if (this.options.minimized) {
            this.DOM.content.style.display = 'none';
        } else {
            this.DOM.content.style.display = 'block';
        }
        $('#pixelperfect-minimized').toggleClass('pixelperfect-button-active', this.options.minimized);

        if (this.options.hidden) {
            this.DOM.self.style.display = 'none';
        } else {
            this.DOM.self.style.display = 'block';
        }

        overlay = document.getElementById('pixelperfect-overlay');

        if (overlay) {
            if (this.options.active) {
                overlay.style.display = 'block';
                this.refreshOverlay();
            } else {
                overlay.style.display = 'none';
            }
        }
        $('#pixelperfect-active').toggleClass('pixelperfect-button-active', this.options.active);

        this.updateOptions();
        this.storeOptions();

        setTimeout(function () {
            var fileDropItem = $('#pixelperfect #pixelperfect-drop-file').elements[0];
            layerHeight = fileDropItem ? fileDropItem.clientHeight : 0;
            maxHeight = window.innerHeight - self.DOM.self.clientHeight - 40 + layers.clientHeight;
            layers.style.maxHeight = Math.max(layerHeight, maxHeight).toString() + 'px';
        }, 40);
    },

    refreshOptions: function () {
        this.applyOptions();
        this.storeOptions();
        this.refreshOverlay();
    },

    updateOptions: function () {
        this.DOM['overlay-' + this.options.overlay].checked = true;
        this.DOM.opacity.value = this.options.opacity;
        this.DOM['opacity-range'].value = this.options.opacity;
        this.DOM.x.value = this.options.position.x;
        this.DOM.y.value = this.options.position.y;
    },

    applyOptions: function () {
        this.options.overlay = this.DOM['overlay-over'].checked ? 'over' : 'below';
        this.options.opacity = this.DOM.opacity.value;
        this.options.position.x = (parseInt(this.DOM.x.value, 10) || 0).toString();
        this.options.position.y = (parseInt(this.DOM.y.value, 10) || 0).toString();
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
            this.DOM.x.value = x;
        }

        if (y !== false) {
            this.DOM.y.value = y;
        }

        this.refreshOptions();
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
        var self = this;
        $('#pixelperfect-upload-file').event('click', function (e) {
            e.preventDefault();
            self.DOM.fileinput.click();
        });
        $('#pixelperfect-fileinput').event('change', function (e) {
            e.preventDefault();
            Layers.readFile(e.target.files[0]);
        });
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

        /*jslint forin: true*/
        for (el in body_css) {
            if (!el.match(/^[0-9]/) && el.match(/^background/) && wrapper_css[el] !== body_css[el]) {
                tmp = wrapper_css[el];
                wrapper.style[el] = body_css[el];
                document.body.style[el] = tmp;
            }
        }
        /*jslint forin: false*/

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
            wrapper.style.minHeight = window.innerHeight.toString() + 'px';
        };
        adjustWrapper();

        window.addEventListener('resize', adjustWrapper);
    },

    initHTML: function () {
        var pixelperfect = document.createElement('div'), help, self = this;
        pixelperfect.setAttribute('id', 'pixelperfect');
        pixelperfect.innerHTML = this.HTML;
        document.body.appendChild(pixelperfect);
        help = document.getElementById('pixelperfect-help-popup');
        document.body.appendChild(help);
        help.visible = false;
        this.DOM.self = pixelperfect;
        $('#pixelperfect [id]').elements.every(function (element) {
            self.DOM[element.getAttribute('id').replace(/^pixelperfect-/, '')] = element;
            return true;
        });
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
        var self = this;
        $('#pixelperfect-overlay-over, #pixelperfect-overlay-below, #pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y').event('change', function () {

            self.DOM['opacity-range'].value = self.DOM.opacity.value;
            self.applyOptions();
            self.storeOptions();
            self.refreshOverlay();
        });
        $('#pixelperfect-aligns > .pixelperfect-button').event('click', function (e) {
            e.preventDefault();

            self.align(this.elements[0].getAttribute('id').replace(/pixelperfect-[a-z]+-/, ''));
        });

        $('#pixelperfect-top > .pixelperfect-button').event('click', function (e) {
            var option = this.elements[0].getAttribute('id').replace('pixelperfect-', '');
            e.preventDefault();

            if (option === 'help') {
                self.help();
            } else {
                self.options[option] = !self.options[option];
                self.refreshInterface();
            }
        });

        $('#pixelperfect-opacity-range').event('change', function () {
            self.DOM.opacity.value = this.elements[0].value;
            self.applyOptions();
            self.refreshInterface();
        });
    },
    setParam: function (item, value) {
        if (typeof item === 'string') {
            item = $('#pixelperfect-' + item);
        }
        if (item.elements[0].getAttribute('data-max')) {
            value = Math.min(parseInt(item.elements[0].getAttribute('data-max'), 10), value);
        }
        if (item.elements[0].getAttribute('data-min')) {
            value = Math.max(parseInt(item.elements[0].getAttribute('data-min'), 10), value);
        }
        item.elements[0].value = value;
        this.refreshOptions();
    },
    initKeyEvents: function () {
        var overlayMode = false, positionMode = false, alignMode = false, fileMode = false, self = this;
        $('#pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y').event(PP.keys.arrowEvent, function (e) {
            var newValue = parseInt(this.elements[0].value, 10),
                which = e.which === 0 ? e.keyCode : e.which;
            if (alignMode || overlayMode || positionMode || fileMode) {
                e.preventDefault();
                return;
            }
            if (which === PP.keys.UP || which === PP.keys.DOWN) {
                e.preventDefault();
                newValue = newValue + (which === PP.keys.UP ? 1 : -1);
            }
            self.setParam(this, newValue);
        });

        $(document).event(PP.keys.event, function (e) {
            var overlayRadio = false, option;
            // overlay
            // over [ O ]
            if (overlayMode && !e.ctrlKey && e.which === PP.keys.O) {
                overlayRadio = self.DOM['overlay-over'];
            }
            // below [ B ]
            if (overlayMode && !e.ctrlKey && e.which === PP.keys.B) {
                overlayRadio = self.DOM['overlay-below'];
            }
            if (overlayRadio) {
                overlayRadio.setAttribute('checked', 'checked');
                overlayRadio.checked = true;
            }
            if (e.which !== 17) {
                overlayMode = (e.ctrlKey && e.which === PP.keys['^O']);
            }

            // position
            // x [ X ]
            if (positionMode && !e.ctrlKey && e.which === PP.keys.X) {
                self.DOM.x.focus();
            }
            // y [ Y ]
            if (positionMode && !e.ctrlKey && e.which === PP.keys.Y) {
                self.DOM.y.focus();
            }
            if (e.which !== 17) {
                positionMode = (e.ctrlKey && e.which === PP.keys['^P']);
            }
            // align
            // left [ L ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.L) {
                self.align('left');
            }
            // center [ C ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.C) {
                self.align('center');
            }
            // right [ R ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.R) {
                self.align('right');
            }
            // top [ T ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.T) {
                self.align('top');
            }
            // middle [ M ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.M) {
                self.align('middle');
            }
            // bottom [ B ]
            if (alignMode && !e.ctrlKey && e.which === PP.keys.B) {
                self.align('bottom');
            }
            if (e.which !== 17) {
                alignMode = (e.ctrlKey && e.which === PP.keys['^A']);
            }

            // file
            // upload [ F ]
            if (fileMode && !e.ctrlKey && e.which === PP.keys.F) {
                if (self.DOM.fileinput) {
                    self.DOM.fileinput.click();
                }
            }
            // URL [ U ]
            if (fileMode && !e.ctrlKey && e.which === PP.keys.U) {
                self.DOM.file.focus();
            }
            if (e.which !== 17) {
                fileMode = (e.ctrlKey && e.which === PP.keys['^F']);
            }

            // layer
            // number [ 1-9,0 ]
            if (e.ctrlKey && e.which >= 48 && e.which <= 57) {
                Layers.setByIndex(e.which === 48 ? 9 : e.which - 49);
            }
            // next [ ] ]
            if (e.ctrlKey && e.which === PP.keys['^]']) {
                Layers.next();
            }
            // prev [ [ ]
            if (e.ctrlKey && e.which === PP.keys['^[']) {
                Layers.previous();
            }
            // remove [ R ]
            if (e.ctrlKey && e.which === PP.keys['^R']) {
                Layers.removeLayer(Layers.fillSelected());
            }

            // opacity
            // focus on input [ T ]
            if (e.ctrlKey && e.which === PP.keys['^T']) {
                self.DOM.opacity.focus();
            }
            // increase [ > ]
            if (e.ctrlKey && e.which === PP.keys['^>']) {
                self.setParam('opacity', parseInt(self.options.opacity, 10) + 1);
            }
            // decrease [ < ]
            if (e.ctrlKey && e.which === PP.keys['^<']) {
                self.setParam('opacity', self.options.opacity - 1);
            }

            // hide [ H ]
            // minimize [ M ]
            // on/off [ X ]
            if (e.ctrlKey && (e.which === PP.keys['^H'] || e.which === PP.keys['^M'] || e.which === PP.keys['^X'])) {
                switch (e.which) {
                case PP.keys['^H']:
                    option = 'hidden';
                    break;
                case PP.keys['^M']:
                    option = 'minimized';
                    break;
                case PP.keys['^X']:
                    option = 'active';
                    break;
                }
                self.options[option] = !self.options[option];
                self.refreshInterface();
            }

            // help [ ? ]
            if (e.ctrlKey && e.which === PP.keys['^?']) {
                self.help();
            }
            self.refreshOptions();
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