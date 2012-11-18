/*jslint browser: true, sloppy: true */
/*global $, PixelPerfect */
/*properties
 addClass, addToList, appendChild, appendLayer, bind, call, charCodeAt,
 className, createElement, elements, elements_length, event, fillSelected,
 getAttribute, getItem, getSelected, hasOwnProperty, hash, indexOf, init,
 innerHTML, insertLayer, join, length, list, match, next, nextSibling, onload,
 parentNode, preventDefault, previous, previousSibling, push, refresh,
 refreshOverlay, remove, removeClass, removeFromList, removeItem, removeLayer,
 selectLayer, setAttribute, setByIndex, setItem, splice, split, src, target,
 toString
 */
var Layers = {
    list: [],
    hash: function (str) {
        /*jslint bitwise: true*/
        var i, char, hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (i = 0; i < str.length; i += 1) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        /*jslint bitwise: false*/
        return hash.toString(16);
    },
    addToList: function (layer_id) {
        if (this.list.indexOf(layer_id) === -1) {
            this.list.push(layer_id);
        }
        localStorage.setItem('pixelperfect:list', this.list.join(','));
    },
    removeFromList: function (layer_id) {
        var listPos = this.list.indexOf(layer_id);
        if (listPos !== -1) {
            this.list.splice(listPos, 1);
        }
        localStorage.setItem('pixelperfect:list', this.list.join(','));
    },
    insertLayer: function (src, layer_id) {
        var div_layer = document.createElement('div'),
            a_remove = document.createElement('a'),
            img = new Image();
        div_layer.className = 'pixelperfect-layer';
        a_remove.className = 'pixelperfect-button';
        a_remove.innerHTML = '&#10008;';
        div_layer.appendChild(img);
        div_layer.appendChild(a_remove);
        if (src.match(/(^data:)|(^http)/)) {
            img.onload = function () {
                var layer_id;
                layer_id = 'pixelperfect:layer:' + Layers.hash(img.src);
                localStorage.setItem(layer_id, img.src);
                div_layer.setAttribute('data-id', layer_id);
                this.appendLayer(div_layer);
                this.selectLayer(this.fillSelected());
                this.addToList(layer_id);
            }.bind(this);
        } else {
            if (layer_id !== undefined) {
                div_layer.setAttribute('data-id', layer_id);
                this.addToList(layer_id);
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
        this.removeFromList(layer_id);
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
        var l, listLength = this.list.length;

        $('#pixelperfect-layers .pixelperfect-layer').remove();
        for (l = 0; l < listLength; l += 1) {
            if (this.list[l].match(/^pixelperfect:layer/)) {
                this.insertLayer(localStorage.getItem(this.list[l]), this.list[l]);
            }
        }
        this.selectLayer();
    },
    init: function () {
        var lsList = localStorage.getItem('pixelperfect:list');
        if (lsList) {
            this.list = lsList.split(',');
        }
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