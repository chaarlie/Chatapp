angular.module('chatApp').directive('pie', function($http, Socket, InterestService){
    return{
        template: '<canvas  chart-click="captureInterest" class="chart chart-pie" chart-data="data" chart-labels="labels"> </canvas> ',
        link: function(scope, element, attribute){
            scope.labels = [];
            scope.data = [];

            $http.get("api/interests").then(function(res){
                var interests  = res.data;
            
                for(i in interests){
                    scope.labels.push(interests[i].name);
                    scope.data.push(interests[i].count);
                }

            }, function(error){
                alert("error");
            });

           scope.captureInterest = function(event){
               InterestService.addEntry(event[0].label);
               console.log(InterestService.interests);
           }
        }
    }
});