/**
 * Simple class for storing HTML collections
 * @param {String|DOMElement} selector a CSS like selector or DOM element
 * @param {String|Boolean} [parentElement] an element which children will be tested against selector, if boolean acts as caching
 * @param {Boolean} [caching] enable/disable internal results cache, don't use with dynamic content!
 * @constructor
 */
var Collection = function(selector, parentElement, caching) {
    var elements, results, l_results, i;

    if(selector.nodeName) {
        this.elements = [selector];
        this.elements_length = 1;
        return this;
    }

    if( typeof(parentElement) === 'boolean' ) {
        caching = parentElement;
        parentElement = undefined;
    }

    if( caching === undefined ) {
        caching = true;
        // I'm using aggresive caching, because most of the times pixelperfect won't change
    }

    if(caching && this.elements === null) {
        elements = [];
        if(parentElement === undefined) {
            parentElement = document;
        }

        results = parentElement.querySelectorAll(selector);
        l_results = results.length;
        for(i = 0; i < l_results; i++) {
            elements.push( results[i] );
        }

        this.elements = elements;
        this.elements_length = elements.length;
    }

    return this;
};

Collection.prototype = {
    /**
     * Internal hash for storing query results
     */
    elements: null,
    /**
     * Number of elements
     */
    elements_length: 0,

    /**
     * Simple event handler for collections
     * @param name Event name
     * @param callback Callback function
     * @return this
     */
    event: function(name, callback) {
        var e;

        this.elements.every(function(element) {
            element.addEventListener(name, callback.bind( new Collection(element) ) );
            return true;
        });

        return this;
    },

    remove: function() {
        this.elements.every(function(element) {
            element.parentNode.removeChild(element);
            return true;
        });

        return this;
    },

    removeClass: function( name ) {
        this.elements.every(function(element) {
            element.className = element.className.replace(RegExp(name, 'g'), '').replace(/^\s+|\s+$/, '');
            return true;
        }.bind(this));

        return this;
    },

    addClass: function( name ) {
        this.removeClass(name);
        this.elements.every(function(element) {
            element.className += ' ' + name;
            return true;
        }.bind(this));

        return this;
    },

    setOpacity: function( value ) {
        this.elements.every(function(element) {
            element.style.opacity = (parseInt(value, 10) / 100.0).toString();
            return true;
        }.bind(this));

        return this;
    },


};