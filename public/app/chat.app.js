var chatApp =  angular.module('chatApp', ['ngCookies',  'ui.bootstrap', 'chart.js', 'ui.router', 'chatApp.common']);
          
chatApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl:'app/login/login.html',
            controller:'loginController'
        })
        .state('home', {
            url:'/home',
            templateUrl:'app/home/home.html',
            controller:'homeController'
        })
}]);

