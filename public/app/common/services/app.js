		var app = angular.module('app', []);

		app.controller('appController', function($scope){

		});
/*
		app.service('MyService', function(){
			var users = {};
			this.addEmail = function(person, email){
				users[person] =  users[person]? users[person] : []; 
				users[person].push({email: email});
			};
			this.deleteEmail = function(person){
				delete users[person];
			};
			this.getUsers = function(){
				return users;
			};
		});;*/
		
		/*app.controller('appController', function($scope, MyService){
			$scope.users = MyService.getUsers();
		});
		app.service('MyService', function(){
			var users = {};
			this.addEmail = function(person, email){
				users[person] =  users[person]? users[person] : []; 
				users[person].push({email: email});
			};
			this.deleteEmail = function(person){
				delete users[person];
			};
			this.getUsers = function(){
				return users;
			};
		});
		app.directive('SelectUser',function(){

		});*/
