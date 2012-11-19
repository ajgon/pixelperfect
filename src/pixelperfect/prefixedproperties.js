/*jslint browser: true, sloppy: true */
/*properties
 B, C, DOWN, F, L, M, O, R, T, U, UP, X, Y, '^<', '^>', '^?', '^A', '^F',
 '^H', '^M', '^O', '^P', '^R', '^T', '^X', '^[', '^]', arrowEvent, body,
 cssProperties, event, init, keys, length, style, substring, toUpperCase,
 vendors
 */
var PrefixedProperties = {
    vendors: ['ms', 'moz', 'webkit', 'o'],
    cssProperties: ['transitionDuration'],
    keys: {
        event: 'keypress',
        arrowEvent: 'keydown',
        'UP': 38,
        'DOWN': 40,
        '^?': 47,
        '^X': 24,
        '^M': 13,
        '^H': 8,
        '^O': 15,
        'O': 111,
        'B': 98,
        '^P': 16,
        'X': 120,
        'Y': 121,
        '^F': 6,
        'F': 102,
        'U': 117,
        '^A': 1,
        'L': 108,
        'C': 99,
        'R': 114,
        'T': 116,
        'M': 109,
        '^T': 20,
        '^<': 44,
        '^>': 46,
        '^[': 27,
        '^]': 29,
        '^R': 18
    },
    init: function () {
        var p, v, cssPropertiesLength = this.cssProperties.length,
            vendorsLength = this.vendors.length;
        for (p = 0; p < cssPropertiesLength; p += 1) {
            if (document.body.style[this.cssProperties[p]] !== undefined) {
                this[this.cssProperties[p]] = this.cssProperties[p];
            }
            for (v = 0; v < vendorsLength && document.body.style[this[this.cssProperties[p]]] === undefined; v += 1) {
                this[this.cssProperties[p]] = this.vendors[v] + this.cssProperties[p][0].toUpperCase() + this.cssProperties[p].substring(1);
            }
        }
    }
},
    PP = PrefixedProperties;