var readboardServices = angular.module('readboardServices', ['ngResource']);

readboardServices.factory('Articles', ['$resource',
    function($resource) {
        var all = $resource('all.json', {}, {
            query: {
                method:'GET',
                isArray: true
            }
        });

        return all;
    }
]);
