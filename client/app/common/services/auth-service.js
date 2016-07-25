(function(){
	angular.module('chatApp.common')
	.factory('Auth',['$http', 'Session', 'Socket' , Auth]);

	 function Auth ($http, Session, Socket){

		Socket.on("sockid", function(data){
			Session.create(data);
			console.log("this is sockid " + data );
		});

		function doLogin(user){
			Socket.emit('userLogin', {username: user.username, password: user.password});
		};

		function isAuthenticated(){
			return !!Session.id;
		};
		
		return{
			isAuthenticated: isAuthenticated,
			doLogin: doLogin
		};
	};
}());
