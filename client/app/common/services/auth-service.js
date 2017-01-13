(function(){
	angular.module('chatApp.common')
	.factory('Auth',['$http', 'Session', 'Socket' , Auth]);

	 function Auth ($http, Session, Socket){

		function doLogin(user){
			//alert("res");
			/*$http.post("/api/login", JSON.stringify(user),  function(res){
				//alert(res);

			});*/

			$http({
				method: "post",
				url:"/api/login",
				data: JSON.stringify(user)
			}).success(function(res){
				if(res){
					Session.create(res.id, res.username);
				 
				}
			});
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
