angular.module('chatApp')
    .controller('loginController', function( $timeout, $cookies, $location, $scope, $rootScope ){
        var login = this;

        console.log("sffg");
        function doSubmit(){

            //AuthService.doLogin($scope.user);

            //Se necesita un tiempo para inicializar isAuthenticated()
            $timeout(function(){
                if(AuthService.isAuthenticated()){
                    socket.emit('userLogin', {username: $scope.user.username, age: $scope.user.age});
                
                    Session.createUser($scope.user.username);

                    $location.path('/home');
                }
            }, 500);
        }
    }
);

/*angular.module('chatApp')
    .controller('state1Controller', function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
    });*/