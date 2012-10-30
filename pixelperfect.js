(function() {

    /**
     * Simple class for storing HTML collections
     * @param {String|DOMElement} selector a CSS like selector or DOM element
     * @param {String|Boolean} parentElement an element which children will be tested against selector, if boolean acts as caching
     * @param {Boolean} caching enable/disable internal results cache, don't use with dynamic content!
     * @constructor
     */
    var Selector = function(selector, parentElement, caching) {
        var elements, results, l_results, i;

        if(selector.nodeName) {
            this.elements = [selector];
            this.elements_length = 1;
            return this;
        }

        if( typeof(parentElement) === 'boolean' ) {
            caching = parentElement;
            parentElement = undefined;
        }

        if( caching === undefined ) {
            caching = true;
            // I'm using aggresive caching, because most of the times pixelperfect won't change
        }

        if(caching && this.elements === null) {
            elements = [];
            if(parentElement === undefined) {
                parentElement = document;
            }

            results = parentElement.querySelectorAll(selector);
            l_results = results.length;
            for(i = 0; i < l_results; i++) {
                elements.push( results[i] );
            }

            this.elements = elements;
            this.elements_length = elements.length;
        }

        return this;
    };

    Selector.prototype = {
        /**
         * Internal hash for storing query results
         */
        elements: null,
        elements_length: 0,

        /**
         * Very simple elements selector with caching support

         */
        css: function(rules) {
            var e, property,
                capitalizedProperty,
                prefixables = {
                    'borderRadius': true,
                    'boxShadow': true
                };

            for(property in rules) {
                if( rules.hasOwnProperty(property) ) {
                    capitalizedProperty = false;
                    if( prefixables.hasOwnProperty( property ) ) {
                        capitalizedProperty = property[0].toUpperCase() + property.substring(1);
                    }

                    for(e = 0; e < this.elements_length; e++) {
                        this.elements[e].style[property] = rules[property];
                        if( capitalizedProperty ) {
                            this.elements[e].style['moz' + capitalizedProperty] = rules[property];
                            this.elements[e].style['webkit' + capitalizedProperty] = rules[property];
                            this.elements[e].style['o' + capitalizedProperty] = rules[property];
                            this.elements[e].style['ms' + capitalizedProperty] = rules[property];
                        }
                    }
                }
            }

            return this;
        },

        hoverCss: function( rulesOn, rulesOff ) {
            // TODO: Prevent from attaching multiple events
            this.event('mouseover', function() {
                this.css(rulesOn);
            }).event('mouseout', function() {
                this.css(rulesOff);
            });

        },

        event: function(name, callback) {
            var e;

            for(e = 0; e < this.elements_length; e++) {
                this.elements[e].addEventListener(name, callback.bind( new Selector(this.elements[e]) ) );
            }

            return this;
        },

        /**
         * HTML5 Drag and Drop sucks real hard, so let's do it old fashioned way. Very simple way. Useless as fully usable dnd function.
         */
        makeDraggable: function(handler) {
            var e;

            for(e = 0; e < this.elements_length; e++) {
                if( handler === undefined ) {
                    handler = this.elements[e];
                } else {
                    handler = this.elements[e].querySelector( handler );
                    if( !handler ) {
                        handler = this.elements[e];
                    }
                }

                handler.addEventListener( 'mousedown', function(e) {
                    document.currentDragged = this;
                    document.currentDragged.mouseDiffX = e.pageX - this.offsetLeft;
                    document.currentDragged.mouseDiffY = e.pageY - this.offsetTop;
                }.bind( this.elements[e] ) );

            }

        },

        initDefaults: function() {
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


    var PixelPerfect = {
        BUTTONS_GRADIENT: 'R0lGODdhAQAUAIQUAKKioqWlpaenp6qqqqysrK+vr7GxsbS0tLa2trm5ubu7u76+vsDAwMPDw8XFxcjIyMrKys3Nzc/Pz9LS0v///////////////////////////////////////////////ywAAAAAAQAUAAAFEeAkRdDjNMyiJMhhFMQgBEAIADs=',
        init: function() {
            this.setInitialStyles();
            this.styleLayers();
            Selector.prototype.initDefaults();
            this.initFileHandling();
        },
        setInitialStyles: function() {
            $('#pixelperfect *').css({
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '12px',
                textDecoration: 'none'
            });
            $('#pixelperfect').css({
                width: '200px',
                borderRadius: '8px',
                boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)',
                padding: '10px',
                position: 'fixed',
                right: '20px',
                top: '20px',
                cursor: 'default'

            }).makeDraggable('#pixelperfect-top');
            $('#pixelperfect > div').css({
                overflow: 'hidden',
                height: '20px',
                lineHeight: '20px',
                padding: '5px 0'
            });
            $('#pixelperfect-top').css({
                margin: '-10px -10px 0',
                padding: '10px',
                borderBottom: '1px solid #dadada',
                lineHeight: '20px',
                cursor: 'move'

            })
            $('#pixelperfect-layers').css({height: 'auto'});
            $('#pixelperfect input[type="text"]').css({
                width: '35px',
                height: '14px',
                padding: '2px',
                border: '1px solid #c0c0c0',
                borderRadius: '3px'
            });
            $('#pixelperfect-lang-y').css({
                marginLeft: '10px'
            });
            $('#pixelperfect .pixelperfect-label').css({
                width: '55px',
                paddingRight: '5px',
                textAlign: 'right',
                display: 'block',
                cssFloat: 'left',
                fontWeight: 'bold'
            });
            $('#pixelperfect-addlayer').css({
                borderTop: '1px solid #dadada',
                borderBottom: '1px solid #dadada',
                margin: '0 -10px',
                padding: '5px 10px'
            });
            $('#pixelperfect-file').css({width: '110px'});
            $('#pixelperfect-fileinput').css({display: 'none'});
        },

        styleLayers: function() {
            $('#pixelperfect .pixelperfect-button').css({
                width: '20px',
                height: '20px',
                background: '#b6b6b6 url(data:image/gif;base64,' + this.BUTTONS_GRADIENT + ') repeat-x center center',
                display: 'block',
                cssFloat: 'right',
                marginLeft: '4px',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: '20px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
            }).hoverCss({
                opacity: '0.8'
            }, {
                opacity: '1'
            });
            $('#pixelperfect-vertical-top').css({ lineHeight: '6px' });
            $('#pixelperfect-vertical-bottom').css({ lineHeight: '30px' });
            $('#pixelperfect-horizontal-left').css({ marginLeft: '0' });
            $('#pixelperfect-layers .pixelperfect-layer').css({
                maxHeight: '120px',
                padding: '5px 25px 5px 5px',
                borderRadius: '10px',
                overflow: 'auto',
                position: 'relative',
                textAlign: 'center',
                background: '#ffffff',
                marginBottom: '5px'
            });
            $('#pixelperfect-layers .pixelperfect-layer-selected').css({
                background: '#edeff4'
            });
            $('#pixelperfect-layers .pixelperfect-layer')
            $('#pixelperfect-layers .pixelperfect-layer img').css({
                maxWidth: '165px',
                maxHeight: '120px'
            });
            $('#pixelperfect-layers .pixelperfect-button').css({
                position: 'absolute',
                top: '5px',
                right: '5px'
            });
        },

        initFileHandling: function() {
            $('#pixelperfect-upload-file').event('click', function(e) {
                e.preventDefault();
                document.getElementById('pixelperfect-fileinput').click();
            });
            $('#pixelperfect-fileinput').event('change', function(e) {
                var div_layer = document.createElement('div'),
                    a_remove = document.createElement('a'),
                    img = new Image(),
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                div_layer.className = 'pixelperfect-layer pixelperfect-layer-selected';
                a_remove.className = 'pixelperfect-button';
                a_remove.innerHTML = '&#10008;';
                console.log( e.target.files[0] );

                img.onload = function() {
                    var blob;
                    blob = img.src.replace('blob:', '');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    localStorage.setItem('pixelperfect:' + blob, canvas.toDataURL());
                    URL.revokeObjectURL(blob);
                    div_layer.appendChild(img);
                    div_layer.appendChild(a_remove);
                    $('#pixelperfect-layers').elements[0].appendChild(div_layer);
                    this.styleLayers();
                }.bind(this);

                img.src = window.URL.createObjectURL(e.target.files[0]);

            }.bind(this));
        }
    };


    /*var ctx = document.getElementById('canvas').getContext('2d');
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 20, 20);
    }
    img.src = url;*/

    $ = function(selector, parentElement, caching) {
        return new Selector(selector, parentElement, caching);
    }
    window.$ = $;

    window.onload = function() {
        PixelPerfect.init();
    }

}());
