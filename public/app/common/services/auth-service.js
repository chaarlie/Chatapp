angular.module('chatApp.common')
	.factory('Auth',['$http', 'Session' , function($http, Session){
		return{
			doLogin: function (u) {
				var user = {
					username: u.username,
					password: u.password
				};

				$http({
					url: "login/",
					method: "POST",
					data: user,
					headers: {'Content-Type': 'application/json'}
				}).then(function(res){
					Session.create(res.data.sessionId);
				}, function(error){
					alert("error creating session");
				});

			},isAuthenticated: function () {
				return !!Session.id;
			}
		};
	}]);