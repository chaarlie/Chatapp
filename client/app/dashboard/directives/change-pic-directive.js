angular.module('chatApp').directive("changePic", function(){
    return{
        template:'',
        restrict: 'E',
        
        link:function(scope, element, attrs, controller){
            element.click(function(){
                scope.openModal();
            });
        }
    }
});
