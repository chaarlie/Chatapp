angular.module('chatApp').directive('pie', function($http, Socket){
    return{
        template: '<canvas   class="chart chart-pie" chart-data="data" chart-labels="labels"> </canvas> ',
        link: function(scope, element, attribute){
            scope.labels = [];
            scope.data = [];

            $http.get("get_interests").then(function(res){
                var interests  = res.data;
            
                for(i in interests){
                    scope.labels.push(interests[i].name);
                    scope.data.push(interests[i].count);
                }

            }, function(error){
                alert("error");
            });

            Socket.on('interestList', function(interests){
                scope.labels = [];
                scope.data = [];
                for(i in interests){
                    scope.labels.push(interests[i].name);
                    scope.data.push(interests[i].count);
                }
            });

        }
    }
});