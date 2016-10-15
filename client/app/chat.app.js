(function(){
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
       
            .state('register', {
                url:'/register',
                templateUrl:'app/register/register.html',
                controller:'registerController as register',
                redirectTo: 'register.user'                
            })
            .state('register.user', {
                parent:'register',
                url:'/user',
                templateUrl:'app/register/templates/register-user.html'              
            })
            .state('register.account', {
                parent:'register',
                url:'/account',
                templateUrl:'app/register/templates/register-account.html'              
            })
            .state('register.interests', {
                parent:'register',
                url:'/user',
                templateUrl:'app/register/templates/register-user.html'              
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
    }]);

    chatApp.run(function ($rootScope, $location, $state, Auth, Session) {
        $rootScope.messages = [];
        $rootScope.chatboxes  = {};
     
        $rootScope.$on('$stateChangeStart', function(evt, to, params) {
          if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params)
          }
        });
    });
}());
