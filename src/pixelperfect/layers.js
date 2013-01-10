/*jslint browser: true, sloppy: true */
/*global $, PixelPerfect */
/*properties
 FileReader, addClass, addToList, appendChild, appendLayer, call, charCodeAt,
 className, createElement, elements, elements_length, event, fillSelected,
 getAttribute, getItem, getOptions, getSelected, hasOwnProperty, hash,
 indexOf, init, innerHTML, insertLayer, join, length, list, match, next,
 nextSibling, onload, opacity, options, overlay, parentNode, position,
 preventDefault, previous, previousSibling, push, readAsDataURL, readFile,
 refresh, refreshOverlay, remove, removeClass, removeFromList, removeItem,
 removeLayer, replace, result, selectLayer, setAttribute, setByIndex, setItem,
 splice, split, src, storeOptions, target, toString, x, y
 */
var Layers = {
    list: [],
    options: {
        overlay: 'below',
        opacity: '50',
        position: {
            x: '0',
            y: '0'
        }
    },
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
    readFile: function (handler) {
        var fileReader = new window.FileReader(), self = this;
        fileReader.onload = function (e) {
            self.insertLayer(e.target.result);
        };
        fileReader.readAsDataURL(handler);
    },
    storeOptions: function (layer_id, values) {
        var option;

        layer_id = layer_id.replace(/pixelperfect:layer:([0-9a-f]+):image/, "$1");
        values = values === undefined ? this.getOptions(layer_id) : values;

        for (option in values) {
            if (values.hasOwnProperty(option)) {
                if (option === 'position') {
                    localStorage.setItem('pixelperfect:layer:' + layer_id + ':' + option, values[option].x + ',' + values[option].y);
                } else {
                    localStorage.setItem('pixelperfect:layer:' + layer_id + ':' + option, values[option]);
                }
            }
        }
    },
    getOptions: function (layer_id) {
        var option, options = {}, pos;
        if (!layer_id) {
            return this.options;
        }
        layer_id = layer_id.replace(/pixelperfect:layer:([0-9a-f]+):image/, "$1");
        for (option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                if (!localStorage.getItem('pixelperfect:layer:' + layer_id + ':' + option)) {
                    return this.options;
                }
                if (option === 'position') {
                    pos = localStorage.getItem('pixelperfect:layer:' + layer_id + ':' + option).split(',');
                    options[option] = {};
                    options[option].x = pos[0];
                    options[option].y = pos[1];
                } else {
                    options[option] = localStorage.getItem('pixelperfect:layer:' + layer_id + ':' + option);
                }
            }
        }
        return options;
    },
    insertLayer: function (src, layer_id) {
        var div_layer = document.createElement('div'),
            a_remove = document.createElement('a'),
            img = new Image(),
            self = this;
        div_layer.className = 'pixelperfect-layer';
        a_remove.className = 'pixelperfect-button';
        a_remove.innerHTML = '&#10008;';
        div_layer.appendChild(img);
        div_layer.appendChild(a_remove);
        if (src.match(/(^data:)|(^http)/)) {
            img.onload = function () {
                var layer_id;
                layer_id = 'pixelperfect:layer:' + self.hash(img.src) + ':image';
                localStorage.setItem(layer_id, img.src);
                div_layer.setAttribute('data-id', layer_id);
                self.appendLayer(div_layer);
                self.storeOptions(layer_id);
                self.selectLayer(self.fillSelected());
                self.addToList(layer_id);
            };
        } else {
            if (layer_id !== undefined) {
                div_layer.setAttribute('data-id', layer_id);
                this.addToList(layer_id);
                this.storeOptions(layer_id);
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
        var option;
        $('#pixelperfect-layers .pixelperfect-layer[data-id="' + layer_id + '"]').remove();
        for (option in localStorage) {
            if (localStorage.hasOwnProperty(option) && option.match(layer_id.replace(/:image$/, ''))) {
                localStorage.removeItem(option);
            }
        }
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
                if (localStorage.hasOwnProperty(layer) && layer.match(/^pixelperfect:layer:[0-9a-f]+:image/)) {
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
            if (this.list[l].match(/^pixelperfect:layer:[0-9a-f]+:image/)) {
                this.insertLayer(localStorage.getItem(this.list[l]), this.list[l]);
            }
        }
        this.selectLayer();
    },
    init: function () {
        var lsList = localStorage.getItem('pixelperfect:list'),
            self = this;
        if (lsList) {
            this.list = lsList.split(',');
        }
        this.refresh();

        $('#pixelperfect-layers').event('click', function (e) {
            var id;
            e.preventDefault();
            if (e.target.className.match('pixelperfect-button')) {
                self.removeLayer.call(self, e.target.parentNode.getAttribute('data-id'));
            } else {
                id = e.target.getAttribute('data-id');
                if (!id) {
                    id = e.target.parentNode.getAttribute('data-id');
                }
                if (id) {
                    self.selectLayer(id);
                }
            }
        });
    }
};