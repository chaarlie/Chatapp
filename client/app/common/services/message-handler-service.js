(function(){
    angular.module('chatApp.common')
        .service('MessageHandler', ['$log', MessageHandler]);
    
    function MessageHandler($log){
        var chatboxes = {};
        
        this.addEntry = function(data, byMe){
            chatboxes[data.from] = !chatboxes[data.from]?  [] : chatboxes[data.from];
            chatboxes[data.from].push({text: data.message, byMe: byMe});
            return chatboxes;
        };

        this.deleteEntry = function(from){
            delete  chatboxes[from];
            return chatboxes;
        }
        this.getAll = function(){
            return chatboxes;
        };
    };
}());
