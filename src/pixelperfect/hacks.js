/*jslint browser: true, sloppy: true */
/*global $, DragAndDrop, PrefixedProperties */
/*properties
 URL, '^A', '^F', '^H', '^M', '^O', '^P', '^R', '^T', '^X', appendChild, bind,
 call, change, className, clientWidth, createElement, elements, event, events,
 firstChild, getElementById, hasOwnProperty, insertBefore, keys, left,
 makeDraggable, match, max, min, offsetLeft, onMove, pageX, parentNode,
 postLoad, post_opacityRange, preLoad, pre_keyCodes, pre_windowURL,
 preventDefault, remember, removeChild, round, setAttribute, stopPropagation,
 style, toString, top, type, userAgent, value, webkitURL
 */
var Hacks = {
    // http://caniuse.com/bloburls
    pre_windowURL: function () {
        if (!window.URL) {
            if (!window.webkitURL) {
                window.URL = false;
                // Opera and IE
                // let's figure something out later
            } else {
                window.URL = window.webkitURL;
            }
        }
    },
    pre_keyCodes: function () {
        if (navigator.userAgent.match(/Gecko/) && !navigator.userAgent.match(/KHTML/)) {
            PrefixedProperties.keys['^X'] = 120;
            PrefixedProperties.keys['^M'] = 109;
            PrefixedProperties.keys['^H'] = 104;
            PrefixedProperties.keys['^O'] = 111;
            PrefixedProperties.keys['^P'] = 112;
            PrefixedProperties.keys['^F'] = 102;
            PrefixedProperties.keys['^A'] = 97;
            PrefixedProperties.keys['^T'] = 116;
            PrefixedProperties.keys['^R'] = 114;
        }
    },
    // http://caniuse.com/input-range
    post_opacityRange: function () {
        var range = document.createElement('input'), originalRange,
            slider, adjustSlider;

        range.setAttribute('type', 'range');
        if (range.type !== 'range') {
            originalRange = document.getElementById('pixelperfect-opacity-range');
            range = document.createElement('span');
            slider = document.createElement('span');

            range.className = 'pixelperfect-range';
            slider.className = 'pixelperfect-slider';
            range.appendChild(slider);
            range.value = originalRange.value;
            range.events = originalRange.events;

            originalRange.parentNode.insertBefore(range, originalRange);
            originalRange.parentNode.removeChild(originalRange);
            range.setAttribute('id', 'pixelperfect-opacity-range');

            adjustSlider = function (e) {
                var range = document.getElementById('pixelperfect-opacity-range'),
                    container = document.getElementById('pixelperfect');
                e.preventDefault();
                e.stopPropagation();

                range.value = Math.round((Math.max(0, Math.min(100, (e.pageX - range.offsetLeft - container.offsetLeft - 10) / range.clientWidth * 100 + 10))));
                this.style.top = '-4px';
                this.style.left = range.value.toString() + '%';
                range.elements = [range];
                range.events.change.call(range);
            }.bind(slider);


            $(range).event('click', adjustSlider);

            DragAndDrop.makeDraggable($(slider), {
                remember: false,
                onMove: adjustSlider
            });

            setInterval(function () {
                this.firstChild.style.left = this.value + '%';
            }.bind(document.getElementById('pixelperfect-opacity-range')), 50);
        }
    },
    preLoad: function () {
        var hack;

        for (hack in this) {
            if (this.hasOwnProperty(hack) && hack !== 'preLoad' && hack.match(/^pre_/)) {
                this[hack]();
            }
        }
    },
    postLoad: function () {
        var hack;

        for (hack in this) {
            if (this.hasOwnProperty(hack) && hack !== 'postLoad' && hack.match(/^post_/)) {
                this[hack]();
            }
        }
    }
};