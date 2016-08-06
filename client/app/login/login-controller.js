(function(){
    
    angular.module('chatApp')
        .controller('loginController', ['$timeout','$scope', '$state', 'Auth', 'Socket', 'Session', loginController]);
            
        function loginController( $timeout, $scope, $state, Auth, Socket, Session) {

            var login = this;
            login.user = {
                username: '',
                password: ''
            };

            login.isInvalid = false;

            Socket.on("sockid", function(data){
                login.isInvalid = !data;  
                login.user = {
                    username: '',
                    password: ''
                };
            });

            login.doSubmit = function(){

                Auth.doLogin(login.user);

                //A few millis are needed to initialize isAuthenticated()
                $timeout(function(){
                   if(Auth.isAuthenticated()){
                        $state.go('dashboard');
                    }
                }, 500);
            };
        };
}());
