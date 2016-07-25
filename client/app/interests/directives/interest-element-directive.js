angular.module('chatApp').directive('interestElement', function(){
    return{
        template:'<li">{{interest.name}}</li>',
        link:function(scope, element, attribute){
             var queryInput = $("#symptom-searchbox p");
             element.click(function(){
                alert();
                 queryInput.text(element.text()).addClass('symptom symptom-search fade-hover');;
                 scope.$emit('selected', attribute.id);
             });
         }
     }
});
