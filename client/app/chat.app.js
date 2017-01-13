(function(){
    var chatApp =  angular.module('chatApp', ['ui.router', 'chatApp.common', 'ui.bootstrap', 'chart.js', 'ngScrollbar']);
         
          
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
                url:'/interest',
                templateUrl:'app/register/templates/register-interests.html',
                controller:'registerController'             
            })
            .state('logoff', {
                url:'/logoff',
                templateUrl:'app/logoff/logoff.html'
            });
    }]);

    chatApp.run(function ($rootScope, $location, $state, $http, $timeout, Session, Auth, LoadMenuService) {
        $rootScope.messages = [];
        $rootScope.chatboxes  = {};

        $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            //alert(Auth.isAuthenticated());

            if(Session.id && to.name == 'dashboard'){
              $rootScope.$broadcast('switchMenu');
            }

            if(Session.id && to.name == 'logoff'){
              Session.destroy();
              
              $timeout(function(){
                $rootScope.$broadcast('switchMenu');
                $state.go('login'); 
              }, 1500);
            }

            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params)
            }
        });
    });
}());
