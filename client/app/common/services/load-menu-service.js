(function(){
    angular.module('chatApp.common')
        .factory('LoadMenuService',['Session', LoadMenuService]);

    function LoadMenuService(){
        var menu ={
          home:[
            "home",
            "login",
            "register",
            "contact"   
           ],
           dashboard:['dashboard', 'logoff']
        };
        
        return{
            menu: menu
        };
    }
}());
