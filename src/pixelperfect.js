//= require "./pixelperfect/prefixedproperties"
//= require "./pixelperfect/collection"
//= require "./pixelperfect/layers"
//= require "./pixelperfect/draganddrop"
//= require "./pixelperfect/hacks"
//= require "./pixelperfect/pixelperfect"
/*jslint browser: true, sloppy: true */
/*global Collection, Hacks, PixelPerfect */

var $ = function (selector, parentElement, caching) {
    return new Collection(selector, parentElement, caching);
};
window.$ = $;
window.PP = PixelPerfect;

window.onload = function () {
    PrefixedProperties.init();
    Hacks.preLoad();
    PixelPerfect.init();
    Hacks.postLoad();
};

