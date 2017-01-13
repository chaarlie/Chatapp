(function(){
    angular.module('chatApp.common')
        .factory('InterestService', InterestService);

    function InterestService(){
        var interests = {};

        var addEntry = function(key){
            interests[key] = {name: key}; 
        };

        var deleteEntry = function(key){
            for (i in interests) {
                if(i == key){
                    delete interests[i];
                }
            };
        };
        
        return{
            interests: interests,
            deleteEntry: deleteEntry,
            addEntry: addEntry
        }
    }
}());

 