var PixelPerfect = {
    STYLES: '##CSS_BASE64##',
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

            img.onload = function() {
                var blob;
                blob = img.src.replace('blob:', '');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                //localStorage.setItem('pixelperfect:' + blob, canvas.toDataURL());
                URL.revokeObjectURL(blob);
                div_layer.appendChild(img);
                div_layer.appendChild(a_remove);
                $('#pixelperfect-layers').elements[0].appendChild(div_layer);
            }.bind(this);

            img.src = window.URL.createObjectURL(e.target.files[0]);

        }.bind(this));
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
        DragAndDrop.init();
        this.initStyles();
        this.initFileHandling();
    }

};