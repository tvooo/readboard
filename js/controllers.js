var readboardApp = angular.module('readboardApp', ['readboardServices', 'ngSanitize', 'readboardFilters']);

readboardApp.controller('ReadboardCtrl', function ($scope, $filter, Articles) {
    $scope.articles = Articles.query( {}, function( res ) {
        $scope.unread = $filter('filter')($scope.articles, {'toread': 'yes'});
    });

    $scope.setActive = function( article ) {
        $scope.active = article;
    };

    $scope.setOrder = function( orderProperty ) {
        $scope.orderDirection = ($scope.orderProperty === orderProperty) ? !$scope.orderDirection : $scope.orderDirection;
        $scope.orderProperty = orderProperty;
    };

    $scope.keyPress = function( event ) {
        if ( 27 === event.keyCode ) {
            $scope.setActive( null );
        }
    };
});

angular.module('readboardFilters', []).
    filter('readingtime', function () {
        return function (text) {
            if ( !text ) {
                return "";
            }
            var time = parseFloat( text );
            minutes = Math.floor( time );
            seconds = Math.floor( 60 * (time - minutes ) );
            return [minutes, seconds].join(':');

        };
    });