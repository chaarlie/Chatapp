
angular.module('chatApp.common').service('MessageHandler', function($log){
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
});
