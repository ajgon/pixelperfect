var Hacks = {
    // http://caniuse.com/bloburls
    pre_windowURL: function() {
        if(!window.URL) {
            if(!window.webkitURL) {
                // Opera and IE
                // Todo let's figure something out later
            } else {
                window.URL = window.webkitURL;
            }
        }
    },
    // http://caniuse.com/input-range
    post_opacityRange: function() {
        var range = document.createElement('input'),
            originalRange, slider, adjustSlider;

        range.setAttribute('type', 'range');
        if(range.type !== 'range') {
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

            adjustSlider = function(e) {
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

            setInterval(function() {
                this.firstChild.style.left = this.value + '%';
            }.bind(document.getElementById('pixelperfect-opacity-range')), 50);
        }
    },
    preLoad: function() {
        var hack;

        for(hack in this) {
            if(hack != 'preLoad' && hack.match(/^pre_/) && this.hasOwnProperty(hack)) {
                this[hack]();
            }
        }
    },
    postLoad: function() {
        var hack;

        for(hack in this) {
            if(hack != 'postLoad' && hack.match(/^post_/) && this.hasOwnProperty(hack)) {
                this[hack]();
            }
        }
    }
};