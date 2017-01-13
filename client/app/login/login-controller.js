(function(){
    
    angular.module('chatApp')
        .controller('loginController', ['$timeout', '$state', 'Auth', 'Session', '$http', loginController]);
            
        function loginController( $timeout, $state, Auth, Session, $http) {

            var login = this;
            login.user = {
                username: '',
                password: ''
            };

            login.doSubmit = function(){

                $http({
                    method: "POST",
                    url:"/api/login",
                    data: login.user
                }).then(function(res){
                    if(res.data.id){
                        Session.create(res.data.id, res.data.username);
                        //A few millis are needed to initialize isAuthenticated()
                        $timeout(function(){
                            $state.go('dashboard');
                        }, 500);
                    }
                    else{
            
                        login.invalid = res.data;
                        $timeout(function(){
                            login.invalid = null;
                            login.user = {
                                username: '',
                                password: ''
                            };
                        }, 3000);
                    }
                });
            };
        };
}());
