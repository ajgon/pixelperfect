var PixelPerfect = {
    STYLES: '##CSS_BASE64##',
    layers: [],
    initFileHandling: function() {
        $('#pixelperfect-upload-file').event('click', function(e) {
            e.preventDefault();
            document.getElementById('pixelperfect-fileinput').click();
        });
        $('#pixelperfect-fileinput').event('change', function(e) {
            Layers.insertLayer(window.URL.createObjectURL(e.target.files[0]));
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
        Layers.init();
        this.initStyles();
        this.initFileHandling();
    }

};