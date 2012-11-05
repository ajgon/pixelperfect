//= require "./pixelperfect/collection"
//= require "./pixelperfect/draganddrop"
//= require "./pixelperfect/layers"
//= require "./pixelperfect/pixelperfect"
//= require "./pixelperfect/hacks"

$ = function(selector, parentElement, caching) {
    return new Collection(selector, parentElement, caching);
}
window.$ = $;

window.onload = function() {
    Hacks.preLoad();
    PixelPerfect.init();
    Hacks.postLoad();
};

