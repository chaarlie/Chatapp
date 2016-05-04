angular.module('chatApp')
    .controller('loginController', function( $timeout, $state, Auth, Socket, Session ){
        var login = this;
        login.user = {
            username: '',
            password: ''
        };

        login.doSubmit = function(){
            //Auth.doLogin(login.user);

            //A few millis are needed to initialize isAuthenticated()
            $timeout(function(){
               // if(Auth.isAuthenticated()){
                    Socket.emit('userLogin', {username: login.user.username, age: ''});
                
                    Session.createUser(login.user.username);
                    $state.go('dashboard');
                //}
            }, 500);
        }
    }
);
