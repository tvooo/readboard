var readboardApp = angular.module('readboardApp', ['readboardServices', 'ngSanitize', 'readboardFilters']);

readboardApp.controller('ReadboardCtrl', function ($scope, $filter, Articles, DoneReading) {
    $scope.articles = Articles.query( {}, function( res ) {
        //$scope.unread = $filter('filter')($scope.articles, {'toread': 'yes'});
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

    $scope.markAsRead = function( hash ) {
        DoneReading.query( {hash: hash}, function( res ) {});
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
    }).filter('nicereadingtime', function () {
        return function (text) {
            if ( !text ) {
                return "";
            }
            var time = parseFloat( text );
            if ( time < 1 ) {
                return "Less than a minute"
            }
            var roundedTime = Math.round( time );
            if ( roundedTime === 1 ) {
                return "About a minute";
            }
            return "~" + roundedTime + " minutes";
        };
    });
