angular.module('chatApp').directive('deleteInterest', function(InterestService){
    return{
        restrict: 'A',
        link: function(scope, element, attribute){
             element.click(function(event){
               scope.$apply(function(){
                   InterestService.deleteEntry(attribute.name);
               });
             });
        }
    }
});