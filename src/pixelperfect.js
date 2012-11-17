//= require "./pixelperfect/collection"
//= require "./pixelperfect/draganddrop"
//= require "./pixelperfect/layers"
//= require "./pixelperfect/pixelperfect"
//= require "./pixelperfect/hacks"
/*jslint browser: true, sloppy: true */
/*global Collection, Hacks, PixelPerfect */

var $ = function (selector, parentElement, caching) {
    return new Collection(selector, parentElement, caching);
};
window.$ = $;

window.onload = function () {
    Hacks.preLoad();
    PixelPerfect.init();
    Hacks.postLoad();
};

