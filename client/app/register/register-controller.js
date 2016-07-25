(function(){
    
    angular.module('chatApp')
        .controller('registerController', ['Socket', registerController]);
            
        function registerController(Socket) {

            var register = this;

            register.newUser = {
                username: '',
                name: '',
                lastName: '',
                email: '',
                password: ''
            };

            register.sucess = false;

            register.doSubmit = function(){
                console.log(register.newUser);
                
                Socket.emit('createUser', register.newUser);
                    register.newUser = {
                    username: '',
                    name: '',
                    lastName: '',
                    email: '',
                    password: ''
                };
            };
            Socket.on('newUserCreated', function(name){
                register.success = true;
                register.newUserCreated = name;
            });
        };
}());
