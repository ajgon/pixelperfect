/*jslint browser: true, sloppy: true */
/*global $, DragAndDrop, PrefixedProperties */
var Hacks = {
    // keyboard handling on browsers... this is madness!
    pre_keyCodes: function () {
        if (navigator.userAgent.match(/Gecko/) && !navigator.userAgent.match(/KHTML/)) {
            PrefixedProperties.keys.arrowEvent = 'keypress';
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
        if (window.opera) {
            PrefixedProperties.keys.event = 'keyup';
            PrefixedProperties.keys['^?'] = 191;
            PrefixedProperties.keys['^X'] = 88;
            PrefixedProperties.keys['^M'] = 77;
            PrefixedProperties.keys['^H'] = 72;
            PrefixedProperties.keys['^O'] = 79;
            PrefixedProperties.keys.O = 79;
            PrefixedProperties.keys.B = 66;
            PrefixedProperties.keys['^P'] = 80;
            PrefixedProperties.keys.X = 88;
            PrefixedProperties.keys.Y = 89;
            PrefixedProperties.keys['^F'] = 70;
            PrefixedProperties.keys.F = 70;
            PrefixedProperties.keys.U = 85;
            PrefixedProperties.keys['^A'] = 65;
            PrefixedProperties.keys.L = 76;
            PrefixedProperties.keys.C = 67;
            PrefixedProperties.keys.R = 82;
            PrefixedProperties.keys.T = 84;
            PrefixedProperties.keys.M = 77;
            PrefixedProperties.keys['^T'] = 84;
            PrefixedProperties.keys['^<'] = 188;
            PrefixedProperties.keys['^>'] = 190;
            PrefixedProperties.keys['^['] = 219;
            PrefixedProperties.keys['^]'] = 221;
            PrefixedProperties.keys['^R'] = 82;
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
                this.style.top = '-7px';
                this.style.left = range.value.toString() + '%';
                range.elements = [range];
                range.events.change.call(range);
            };


            $(range).event('click', adjustSlider);

            DragAndDrop.makeDraggable($(slider), {
                remember: false,
                onMove: adjustSlider
            });

            setInterval(function () {
                range.firstChild.style.left = range.value + '%';
            }, 50);
        }
    },
    // http://caniuse.com/filereader
    post_FileReader: function () {
        if (!window.FileReader || window.opera) { // Newest Opera (12.10) fails miserably
            $('#pixelperfect-fileinput, #pixelperfect-upload-file, #pixelperfect-drop-file').remove();
        }
    },
    preLoad: function () {
        var hack;

        for (hack in this) {
            if (this.hasOwnProperty(hack) && hack.match(/^pre_/)) {
                this[hack]();
            }
        }
    },
    postLoad: function () {
        var hack;

        for (hack in this) {
            if (this.hasOwnProperty(hack) && hack.match(/^post_/)) {
                this[hack]();
            }
        }
    }
};