(function(){
     angular.module('chatApp')
        .controller('homeController',['$scope', 'LoadMenuService', homeController ]);

        function homeController($scope, LoadMenuService){
            var home = this;
            home.switchMenu = true;
             home.nav  = LoadMenuService.menu.home;

            $scope.$on('switchMenu', function(){
                home.switchMenu = !home.switchMenu;
                home.nav  = home.switchMenu? LoadMenuService.menu.home : LoadMenuService.menu.dashboard;              
            });
        };
}());
