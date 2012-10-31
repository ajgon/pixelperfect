//= require "./pixelperfect/collection"
//= require "./pixelperfect/draganddrop"
//= require "./pixelperfect/pixelperfect"


$ = function(selector, parentElement, caching) {
    return new Collection(selector, parentElement, caching);
}
window.$ = $;

window.onload = function() {
    PixelPerfect.init();
};

