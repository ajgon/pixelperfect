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
    },
    options: {
        overlay: false,
        opacity: false,
        position: false,
        align: false,
        minimized: false,
        hidden: false
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
        } else {
            overlay = document.getElementById('pixelperfect-overlay');
        }

        if( this.options.overlay == 'below' ) {
            $(this.wrapper).setOpacity( this.options.opacity );
            overlay.style.zIndex = '-2147483646';
        } else {
            $(overlay).setOpacity( this.options.opacity );
            overlay.style.zIndex = '2147483646';
        }

        // TODO Don't forget to bring the towel... errr... align!
        overlay.style.left = this.options.position.x + 'px';
        overlay.style.top = this.options.position.y + 'px';
        this.updateOptions();
    },

    updateOptions: function() {
        document.getElementById('pixelperfect-overlay-' + this.options.overlay).checked = true;
        document.getElementById('pixelperfect-opacity').value = this.options.opacity;
        document.getElementById('pixelperfect-x').value = this.options.position.x;
        document.getElementById('pixelperfect-y').value = this.options.position.y;
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
            if(!el.match(/^[0-9]/) && wrapper_css[el] != body_css[el]) {
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

    init: function() {
        this.setDefaults();
        this.initOptions();

        this.initWrapper();
        this.initHTML();
        this.initStyles();

        DragAndDrop.init();
        DragAndDrop.makeDraggable( $('#pixelperfect'), '#pixelperfect-top' );
        Layers.init();
        this.initFileHandling();
    }

};