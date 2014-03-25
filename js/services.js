var readboardServices = angular.module('readboardServices', ['ngResource']);

readboardServices.factory('Articles', ['$resource',
    function($resource) {
        var all = $resource('/posts', {}, {
            query: {
                method:'GET',
                isArray: true
            }
        });

        return all;
    }
]);

readboardServices.factory('Article', ['$resource',
    function($resource) {
        var all = $resource('/posts', { id: active}, {
            query: {
                method:'GET',
                isArray: true
            }
        });

        return all;
    }
]);

readboardServices.factory('DoneReading', ['$resource',
    function($resource) {
        var all = $resource('/markasread/:hash', {}, {
            query: {
                method:'GET'
            }
        });

        return all;
    }
]);
