/// <reference path="../lib/loodash.js" />

var filters = {};

function register(name, factory) {

    if (_.isObject(name)) {
        return _.map(name, function(factory, name) {
            return register(name, factory);
        });

    } else {
        var filter = factory();
        filters[name] = filter;
        return filter;
    }
}

function filter(name) {
    return filters[name];
}

function filterFilter() {
    return function (array,filterExpr) {
        return _.filter(array, filterExpr);
    };
}

register('filter', filterFilter);

