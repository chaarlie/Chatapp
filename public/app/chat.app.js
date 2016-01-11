var chatApp =  angular.module('chatApp', ['ngCookies', 'chart.js', 'ui.router', 'chatApp.common', 'ui.bootstrap']);
          
chatApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider){
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl:'app/login/login.html',
            controller:'loginController as login' 
        })
        .state('home', {
            url:'/home',
            templateUrl:'app/home/home.html',
            controller:'homeController as home'
        })
        .state('interests', {
            url:'/interests',
            templateUrl:'/app/interests/interests.html',
            controller:'interestsController'
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
      //Sample authentication 

      if(toState.url === "/home"){        
         if(!Auth.isAuthenticated()){
             event.preventDefault();
             $state.go('login');
         }
      }
      if(toState.url === "/login"){
         if(Auth.isAuthenticated())
           event.preventDefault();
      }
  });  
});