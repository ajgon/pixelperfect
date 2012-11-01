var Layers = {
    insertLayer: function( src, layer_id ) {
        var div_layer = document.createElement('div'),
            a_remove = document.createElement('a'),
            img = new Image(),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        div_layer.className = 'pixelperfect-layer';
        a_remove.className = 'pixelperfect-button';
        a_remove.innerHTML = '&#10008;';
        div_layer.appendChild(img);
        div_layer.appendChild(a_remove);

        if( src.match(/^blob:/) ) {
            img.onload = function() {
                var blob, layer_id;
                blob = img.src.replace('blob:', '');
                layer_id = 'pixelperfect:layer:' + blob;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                localStorage.setItem(layer_id, canvas.toDataURL('image/jpeg'));
                div_layer.setAttribute('data-id', layer_id);
                URL.revokeObjectURL(blob);
                this.appendLayer(div_layer);
                this.selectLayer( this.fillSelected() );
            }.bind(this);
        } else {
            if( layer_id !== undefined ) {
                div_layer.setAttribute('data-id', layer_id);
            }
            this.appendLayer(div_layer);
            this.selectLayer( this.fillSelected() );
        }

        img.src = src;
    },
    appendLayer: function( layer_container ) {
        $('#pixelperfect-layers').elements[0].appendChild(layer_container);
    },
    selectLayer: function( layer_id ) {
        var img,
            selected_layer = localStorage.getItem('pixelperfect:selected');

        if(layer_id == selected_layer) {
            return;
        }

        if( layer_id === undefined ) {
            layer_id = this.fillSelected();
        }
        if(layer_id) {
            $('#pixelperfect-layers .pixelperfect-layer').removeClass('pixelperfect-layer-selected');
            $('#pixelperfect-layers .pixelperfect-layer[data-id="' + layer_id + '"]').addClass('pixelperfect-layer-selected');
            localStorage.setItem('pixelperfect:selected', layer_id);
            PixelPerfect.refreshOverlay( layer_id );
        }
    },
    removeLayer: function( layer_id ) {
        $('#pixelperfect-layers .pixelperfect-layer[data-id="' + layer_id + '"]').remove();
        localStorage.removeItem( layer_id );
        this.selectLayer( this.fillSelected() );
    },
    fillSelected: function() {
        var layer,
            selected = localStorage.getItem('pixelperfect:selected');

        if(!selected || !localStorage.getItem(selected)) {
            for( layer in localStorage ) {
                if( layer.match(/^pixelperfect:layer/) && localStorage.hasOwnProperty(layer) ) {
                    selected = layer;
                    break;
                }
            }
        }

        return selected;
    },
    refresh: function() {
        var layer;

        $('#pixelperfect-layers .pixelperfect-layer').remove();
        for( layer in localStorage ) {
            if( layer.match(/^pixelperfect:layer/) && localStorage.hasOwnProperty(layer) ) {
                this.insertLayer( localStorage.getItem(layer), layer );
            }
        }
        this.selectLayer();
    },
    init: function() {
        this.refresh();

        $('#pixelperfect-layers').event('click', function(e) {
            var id;
            e.preventDefault();
            if(e.target.className.match('pixelperfect-button')) {
                Layers.removeLayer.call( Layers, e.target.parentNode.getAttribute('data-id') );
            } else if((id = e.target.getAttribute('data-id')) || (id = e.target.parentNode.getAttribute('data-id'))) {
                Layers.selectLayer( id );
            }
        });
    }
};