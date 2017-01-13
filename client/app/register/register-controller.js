(function(){
    
    angular.module('chatApp')
        .controller('registerController', ['Socket', 'InterestService', '$http', '$timeout', registerController]);
            
        function registerController(Socket, InterestService, $http, $timeout) {

            var register = this;

            register.newUser = {};
            register.newUser.interests = InterestService.interests;

            register.doUsernameCheck = function(){
                $http({
                    url:"api/register/check-username",
                    method:"GET",
                    params: {username: register.newUser.username}
                }).then(function(res){

                    register.isTaken = res.data;
                    $timeout(function(){
                         register.isTaken = null;
                    }, 3000);
        
                }, function(error){
                    console.log(error);
                });
            }

            register.doSubmit = function(){

                var data = register.newUser; 
                data.interests = Object.keys(register.newUser.interests);
                $http({
                    url:"api/register/",
                    method:"POST",
                    data:  data,
                    headers: {'Content-Type': 'application/json'}
                }).then(function(res){

                    register.newUserResponse = res.data;

                    $timeout(function(){
                        register.newUserResponse = null;
                        register.newUser = {};
                        InterestService.interests = {};
                    }, 3000);
    
                }, function(error){
                    console.log(error);
                });
            };
        };
}());
