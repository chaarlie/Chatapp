var chatApp =  angular.module('chatApp', ['ui.router', 'chatApp.common', 'ui.bootstrap']);
          
chatApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider){
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl:'app/login/login.html',
            controller:'loginController as login' 
        })
        .state('home', {
            url:'/home',
            templateUrl:'app/home/home.html',
        })
        .state('dashboard', {
            url:'/dashboard',
            templateUrl:'app/dashboard/dashboard.html',
            controller:'dashboardController as dashboard' 
        })
        .state('logoff', {
            url:'/logoff',
            templateUrl:'app/logoff/logoff.html',
            onEnter: function($state, $timeout, $window){
                $timeout(function(){
                    $state.go('login'); 
                }, 1500);
                $timeout(function(){
                   $window.location.reload();  
                }, 2000)
                
            } 
        });
}]).run(function ($rootScope, $location, $state, Auth, Session) {
    $rootScope.messages = [];
    $rootScope.chatboxes  = {};
 
   $rootScope.$on('$stateChangeStart', function (event, toState) {

  });  
});