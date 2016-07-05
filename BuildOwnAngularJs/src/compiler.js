

function $CompileProvider($provide) {

    this.hasDirectives = {};

    this.directive = function (name, directiveFactory) {

        if (_.isString(name)) {
            if (name === 'hasOwnProperty') {
                throw 'hasOwnProperty is not a valid directive name';
            }

            if (!this.hasDirectives.hasOwnProperty(name)) {
                this.hasDirectives[name] = [];
                var hasDirectives = this.hasDirectives;
                $provide.factory(name + 'Directive', [
                    '$injector', function($injector) {
                        var factories = hasDirectives[name];
                        return _.map(factories, $injector.invoke);
                    }
                ]);
            }
            this.hasDirectives[name].push(directiveFactory);
        } else {
            var me = this;
            _.forEach(name, function (directiveFactory, name) {
                me.directive(name, directiveFactory);
            }, this);
        }
    }

    this.$get= function() {
        

    }

}