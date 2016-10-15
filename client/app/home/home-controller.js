(function(){
     angular.module('chatApp')
        .controller('homeController',[ homeController ]);

        function homeController(){
        
            var home = this;

            home.nav = [
                "home",
                "login",
                "register",
                "contact"   
            ];
        };
}());
