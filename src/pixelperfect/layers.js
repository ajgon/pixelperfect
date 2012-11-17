/*jslint browser: true, sloppy: true */
/*global $, PixelPerfect */
/*properties
 URL, addClass, appendChild, appendLayer, bind, call, className,
 createElement, drawImage, elements, elements_length, event, fillSelected,
 getAttribute, getContext, getItem, getSelected, hasOwnProperty, height, init,
 innerHTML, insertLayer, join, match, next, nextSibling, onload, parentNode,
 preventDefault, previous, previousSibling, refresh, refreshOverlay, remove,
 removeClass, removeItem, removeLayer, replace, revokeObjectURL, selectLayer,
 setAttribute, setByIndex, setItem, src, target, toDataURL, width
 */
var Layers = {
    insertLayer: function (src, layer_id) {
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

        if (src.match(/(^blob:)|(^http)/)) {
            img.onload = function () {
                var blob, layer_id;
                blob = img.src.replace(/^blob:/, '');
                layer_id = 'pixelperfect:layer:' + blob.match(/[a-zA-Z0-9]+/g).join('');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                try {
                    localStorage.setItem(layer_id, canvas.toDataURL('image/jpeg'));
                } catch (e) {
                    localStorage.setItem(layer_id, src);
                }
                div_layer.setAttribute('data-id', layer_id);
                if (src.match(/^blob:/)) {
                    window.URL.revokeObjectURL(blob);
                }
                this.appendLayer(div_layer);
                this.selectLayer(this.fillSelected());
            }.bind(this);
        } else {
            if (layer_id !== undefined) {
                div_layer.setAttribute('data-id', layer_id);
            }
            this.appendLayer(div_layer);
            this.selectLayer(this.fillSelected());
        }

        img.src = src;
    },
    appendLayer: function (layer_container) {
        $('#pixelperfect-layers').elements[0].appendChild(layer_container);
    },
    selectLayer: function (layer_id) {
        /*var selected_layer = localStorage.getItem('pixelperfect:selected');
        if (layer_id == selected_layer) {
            return;
        } */

        if (layer_id === undefined) {
            layer_id = this.fillSelected();
        }

        if (layer_id) {
            $('#pixelperfect-layers .pixelperfect-layer').removeClass('pixelperfect-layer-selected');
            $('#pixelperfect-layers .pixelperfect-layer[data-id="' + layer_id + '"]').addClass('pixelperfect-layer-selected');
            localStorage.setItem('pixelperfect:selected', layer_id);
            PixelPerfect.refreshOverlay(layer_id);
        }
    },
    removeLayer: function (layer_id) {
        $('#pixelperfect-layers .pixelperfect-layer[data-id="' + layer_id + '"]').remove();
        localStorage.removeItem(layer_id);
        this.selectLayer(this.fillSelected());
        if ($('#pixelperfect-layers .pixelperfect-layer').elements_length === 0) {
            $('#pixelperfect-overlay').remove();
        }
    },
    fillSelected: function () {
        var layer,
            selected = localStorage.getItem('pixelperfect:selected');

        if (!selected || !localStorage.getItem(selected)) {
            for (layer in localStorage) {
                if (localStorage.hasOwnProperty(layer) && layer.match(/^pixelperfect:layer/)) {
                    selected = layer;
                    break;
                }
            }
        }

        return selected;
    },
    getSelected: function () {
        return $('#pixelperfect-layers .pixelperfect-layer-selected, #pixelperfect-layers .pixelperfect-layer[data-id="' + this.fillSelected() + '"]').elements[0];
    },
    next: function () {
        var selectedLayer = this.getSelected();
        if (selectedLayer && selectedLayer.nextSibling) {
            this.selectLayer(selectedLayer.nextSibling.getAttribute('data-id'));
        }
    },
    previous: function () {
        var selectedLayer = this.getSelected();
        if (selectedLayer && selectedLayer.previousSibling) {
            this.selectLayer(selectedLayer.previousSibling.getAttribute('data-id'));
        }
    },
    setByIndex: function (index) {
        var selectedLayer = $('#pixelperfect-layers .pixelperfect-layer').elements[index];
        if (selectedLayer) {
            this.selectLayer(selectedLayer.getAttribute('data-id'));
        }
    },
    refresh: function () {
        var layer;

        $('#pixelperfect-layers .pixelperfect-layer').remove();
        for (layer in localStorage) {
            if (localStorage.hasOwnProperty(layer) && layer.match(/^pixelperfect:layer/)) {
                this.insertLayer(localStorage.getItem(layer), layer);
            }
        }
        this.selectLayer();
    },
    init: function () {
        this.refresh();

        $('#pixelperfect-layers').event('click', function (e) {
            var id;
            e.preventDefault();
            if (e.target.className.match('pixelperfect-button')) {
                Layers.removeLayer.call(Layers, e.target.parentNode.getAttribute('data-id'));
            } else {
                id = e.target.getAttribute('data-id');
                if (!id) {
                    id = e.target.parentNode.getAttribute('data-id');
                }
                if (id) {
                    Layers.selectLayer(id);
                }
            }
        });
    }
};