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

    refreshOverlay: function( layer_id ) {
        var overlay;

        if( layer_id !== undefined ) {
            $('#pixelperfect-overlay').remove();
            overlay = new Image();
            overlay.src = localStorage.getItem(layer_id);
            overlay.setAttribute('id', 'pixelperfect-overlay');
            document.body.appendChild(overlay);
            DragAndDrop.makeDraggable( $(overlay), {
                remember: false,
                onDrop: function() {
                    PixelPerfect.options.position.x = parseInt(this.style.left, 10);
                    PixelPerfect.options.position.y = parseInt(this.style.top, 10);
                    PixelPerfect.refreshInterface.call(PixelPerfect);
                }
            } );
        } else {
            overlay = document.getElementById('pixelperfect-overlay');
        }

        if(!overlay) {
            return false;
        }

        if( this.options.overlay == 'below' ) {
            $(this.wrapper).setOpacity( this.options.opacity );
            $(overlay).setOpacity(100);
            overlay.style.zIndex = '-2147483646';
        } else {
            $(this.wrapper).setOpacity(100);
            $(overlay).setOpacity( this.options.opacity );
            overlay.style.zIndex = '2147483646';
        }

        overlay.style.left = this.options.position.x + 'px';
        overlay.style.top = this.options.position.y + 'px';
        this.updateOptions();
    },

    refreshInterface: function() {
        var maxHeight, layers = $('#pixelperfect #pixelperfect-layers').elements[0],
            layerHeight;
        if(this.options.minimized) {
            document.getElementById('pixelperfect-content').style.display = 'block';
        } else {
            document.getElementById('pixelperfect-content').style.display = 'none';
        }

        if(document.getElementById('pixelperfect-overlay')) {
            if(this.options.active) {
                document.getElementById('pixelperfect-overlay').style.display = 'block';
                this.refreshOverlay();
            } else {
                document.getElementById('pixelperfect-overlay').style.display = 'none';
                $('body > .pixelperfect-wrapper').setOpacity(100);
            }
        }

        // TODO: add hidden support, when keyboard shortcuts invoked

        this.updateOptions();
        this.storeOptions();

        setTimeout(function() {
            layerHeight = $('#pixelperfect #pixelperfect-drop-file').elements[0].clientHeight;
            maxHeight = window.innerHeight - document.getElementById('pixelperfect').clientHeight - 40 + layers.clientHeight;
            layers.style.maxHeight = Math.max(layerHeight, maxHeight).toString() + 'px';
        }, 40);
    },

    updateOptions: function() {
        document.getElementById('pixelperfect-overlay-' + this.options.overlay).checked = true;
        document.getElementById('pixelperfect-opacity').value = this.options.opacity;
        document.getElementById('pixelperfect-opacity-range').value = this.options.opacity;
        document.getElementById('pixelperfect-x').value = this.options.position.x;
        document.getElementById('pixelperfect-y').value = this.options.position.y;
    },

    applyOptions: function() {
        this.options.overlay = document.getElementById('pixelperfect-overlay-over').checked ? 'over' : 'below';
        this.options.opacity = document.getElementById('pixelperfect-opacity').value;
        this.options.position.x = (parseInt(document.getElementById('pixelperfect-x').value, 10) || 0).toString();
        this.options.position.y = (parseInt(document.getElementById('pixelperfect-y').value, 10) || 0).toString();
    },

    storeOptions: function() {
        var option;

        for( option in this.options ) {
            if( this.options.hasOwnProperty(option) ) {
                if(option == 'position') {
                    localStorage.setItem('pixelperfect:options:' + option, this.options[option].x + ',' + this.options[option].y);
                } else {
                    localStorage.setItem('pixelperfect:options:' + option, this.options[option]);
                }
            }
        }
    },

    setDefaults: function() {
        var option;

        for( option in this.DEFAULTS ) {
            if(this.DEFAULTS.hasOwnProperty(option) && !localStorage.getItem('pixelperfect:options:' + option)) {
                if(option == 'position') {
                    localStorage.setItem('pixelperfect:options:' + option, this.DEFAULTS[option].x + ',' + this.DEFAULTS[option].y);
                } else {
                    localStorage.setItem('pixelperfect:options:' + option, this.DEFAULTS[option]);
                }
            }
        }
    },

    initOptions: function() {
        var option, pos;

        for( option in this.options ) {
            if( this.options.hasOwnProperty(option) ) {
                if(option == 'position') {
                    pos = localStorage.getItem('pixelperfect:options:' + option).split(',');
                    this.options[option] = {};
                    this.options[option].x = pos[0];
                    this.options[option].y = pos[1];
                } else if(option == 'active' || option == 'minimized' || option == 'hidden') {
                    this.options[option] = (localStorage.getItem('pixelperfect:options:' + option) === 'true');
                } else {
                    this.options[option] = localStorage.getItem('pixelperfect:options:' + option);
                }
            }
        }
    },

    initFileHandling: function() {
        $('#pixelperfect-upload-file').event('click', function(e) {
            e.preventDefault();
            document.getElementById('pixelperfect-fileinput').click();
        });
        $('#pixelperfect-fileinput').event('change', function(e) {
            Layers.insertLayer(window.URL.createObjectURL(e.target.files[0]));
        }.bind(this));
        $('#pixelperfect-file').event('keypress', function(e) {
            if(e.keyCode === 13 || e.charCode === 13) {
                Layers.insertLayer(this.elements[0].value);
            }
        });
    },

    initWrapper: function() {
        var wrapper = document.createElement('div'),
            body_css = document.defaultView.getComputedStyle(document.body),
            body_attributes = document.body.attributes,
            wrapper_css = document.defaultView.getComputedStyle(wrapper),
            el, tmp, adjustWrapper;

        for(el in body_attributes) {
            if(body_attributes.hasOwnProperty(el)) {
                wrapper.setAttribute(body_attributes[el].name, body_attributes[el].value);
            }
        }

        for(el in body_css) {
            if(!el.match(/^[0-9]/) && el.match(/^background/) && wrapper_css[el] != body_css[el]) {
                tmp = wrapper_css[el];
                wrapper.style[el] = body_css[el];
                document.body.style[el] = tmp;
            }
        }

        wrapper.className = document.body.className + ' pixelperfect-wrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        wrapper.style.margin = '0';

        $('body > *').elements.every(function(element) {
            wrapper.appendChild(element);
            return true;
        });

        document.body.appendChild(wrapper);

        this.wrapper = wrapper;

        adjustWrapper = function() {
            this.wrapper.style.minHeight = window.innerHeight.toString() + 'px';
        }.bind(this);
        adjustWrapper();

        window.addEventListener('resize', adjustWrapper);
    },

    initHTML: function() {
        var pixelperfect = document.createElement('div');
        pixelperfect.setAttribute('id', 'pixelperfect');
        pixelperfect.innerHTML = this.HTML;
        document.body.appendChild(pixelperfect);
    },

    initStyles: function() {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('media', 'all');
        link.setAttribute('href', 'data:text/css;base64,' + this.STYLES);
        document.head.appendChild(link);
    },

    initInterfaceEvents: function() {
        $('#pixelperfect-overlay-over, #pixelperfect-overlay-below, #pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y').event('change', function() {

            document.getElementById('pixelperfect-opacity-range').value = document.getElementById('pixelperfect-opacity').value;
            this.applyOptions.call(this);
            this.storeOptions.call(this);
            this.refreshOverlay.call(this);
        }.bind(this));
        $('#pixelperfect-aligns > .pixelperfect-button').event('click', function(e) {
            var x = false, y = false,
                overlay = document.getElementById('pixelperfect-overlay');

            e.preventDefault();
            switch(this.elements[0].getAttribute('id')) {
                case 'pixelperfect-horizontal-left':
                    x = 0;
                    break;
                case 'pixelperfect-horizontal-center':
                    x = Math.round(window.innerWidth / 2.0 - overlay.width / 2.0);
                    break;
                case 'pixelperfect-horizontal-right':
                    x = window.innerWidth - overlay.width;
                    break;
                case 'pixelperfect-vertical-top':
                    y = 0;
                    break;
                case 'pixelperfect-vertical-middle':
                    y = Math.round(window.innerHeight / 2.0 - overlay.height / 2.0);
                    break;
                case 'pixelperfect-vertical-bottom':
                    y = window.innerHeight - overlay.height;
                    break;
            }

            if( x !== false ) {
                document.getElementById('pixelperfect-x').value = x;
            }

            if( y !== false ) {
                document.getElementById('pixelperfect-y').value = y;
            }

            PixelPerfect.applyOptions();
            PixelPerfect.storeOptions();
            PixelPerfect.refreshOverlay();
        });

        $('#pixelperfect-top > .pixelperfect-button').event('click', function(e) {
            var option = this.elements[0].getAttribute('id').replace('pixelperfect-', '');
            e.preventDefault();

            PixelPerfect.options[option] = ! PixelPerfect.options[option];

            PixelPerfect.refreshInterface();
        });

        $('#pixelperfect-opacity-range').event('change', function() {
            document.getElementById('pixelperfect-opacity').value = this.elements[0].value;
            PixelPerfect.applyOptions();
            PixelPerfect.refreshInterface();
        });
    },

    init: function() {
        this.setDefaults();
        this.initOptions();

        this.initWrapper();
        this.initHTML();
        this.initStyles();
        this.initInterfaceEvents();

        DragAndDrop.init();
        DragAndDrop.makeDraggable( $('#pixelperfect'), {handler: '#pixelperfect-top'} );
        DragAndDrop.catchFile( $('#pixelperfect-drop-file') );
        Layers.init();
        this.initFileHandling();
        this.refreshInterface();
    }

};