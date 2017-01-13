(function(){
	angular.module('chatApp.common', [])
		.service('Session', Session);

	function Session() {
	    this.create = function (id, username) {
	        this.id = id;
	        this.username = username;  
	    };
	    this.destroy = function () {
	        this.id = null; 
	        this.username = null;      
	    };
	};
}());