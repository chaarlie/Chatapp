angular.module('chatApp').directive("profileInfo", function($cookies){
    return{
        templateUrl:'/app/home/directives/profile-info.html',
        restrict: 'E',
        link: function(scope, element, attrs){
            scope.$on('picUpload', function(event, name){
        alert();
                
        });

            $(element).find("#profile-pic").hover(function(){
                $("#spinner").addClass("circle angled second");
                $("#change-pic").css('visibility','visible');
            }, function(){
                $("#spinner").removeClass("circle angled second");
                $("#change-pic").css('visibility','hidden');
            });;
        }
    }
});
