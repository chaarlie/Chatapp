angular.module('chatApp').directive("navLink", function(){
    return{
        template:'<a href="#/{{address}}">{{address}}</a>',
        restrict: 'A',
        link: function(scope, element, attrs){
        	
            element.bind('click',function(e){
            	$(".nav li").removeClass("active");
      			element.addClass("active");
            });
        }
    }
});
