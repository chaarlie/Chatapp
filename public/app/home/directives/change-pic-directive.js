angular.module('chatApp').directive("changePic", function(){
    return{
        template:'<button id="change-pic" style="visibility:hidden" class="btn btn-default">Cambiar</button>',
        restrict: 'E',
      
        link:function(scope, element, attrs, controller){
            element.click(function(){
                scope.openModal();
            });
        }
    }
});
