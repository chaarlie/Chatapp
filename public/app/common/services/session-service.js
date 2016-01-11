angular.module('chatApp.common', [])
	.service('Session', function(){
	    this.create = function (sessionId) {
	        this.id = sessionId;  
	    };
	    this.destroy = function () {
	        this.id = null;    
	    };
	    this.createUser = function(username){
	        this.username = username;
	    };
});