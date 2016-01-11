angular.module('chatApp').directive('interestSelected', function(){
    return{
        template:'<p class="symptom symptom-selected">{{symptom.name}}</p><span  class="icon-cancel"></span>',
        link: function(scope, element, attribute){
            var quitInterest = element.find('span');
            quitInterest.click(function(){
                scope.$emit('unselected', attribute.id);
            });
        }
    }
});
