/// <reference path="../lib/loodash.js" />

var filters = {};

function register(name, factory) {

    if (_.isObject(name)) {
        return _.map(name, function (factory, name) {
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

 function deepCompare(actual, expected, comparator) {
        if (_.isObject(actual)) {
            return _.some(actual, function (value) {
                return deepCompare(value, expected, comparator);
            });
        } else {
            return comparator(actual, expected);
        }
    }


function createPredicateFn(expression) {

   

    function comparator(actual, expected) {
        actual = actual.toLowerCase();
        expected = expected.toLowerCase();
        return actual.indexOf(expected) !== -1;
    }

    return function predicateFn(item) {

        return deepCompare(item, expression, comparator);
    }
}

function filterFilter() {
    return function (array, filterExpr) {
        var predicateFn;
        if (_.isFunction(filterExpr)) {
            predicateFn = filterExpr;
        } else if (_.isString(filterExpr)) {
            predicateFn = createPredicateFn(filterExpr);
        } else {
            return array;
        }

        return _.filter(array, predicateFn);
    };
}

register('filter', filterFilter);

