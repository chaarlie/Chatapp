angular.module('chatApp').controller('dashboardController', function(
        $scope, $rootScope,
        $http, $timeout, $modal,  
        $compile, $interval, $log,
        Session, Socket, MessageHandler){
        
        var dashboard = this;

        Socket.on('msgFromServer', function (data) {
            dashboard.chatboxes = MessageHandler.addEntry(data, false);
            dashboard.msgFrom = data.from;

            $log.log("new msg");
                $log.log(dashboard.chatboxes);
        });

        $scope.$on('appendMsgByMe', function(event, data){
            $scope.$apply(function(){
                dashboard.chatboxes = MessageHandler.addEntry(data, true);
            });
        });

        $scope.$on('removeChatbox', function(event, nick){
             $scope.$apply(function(){
                dashboard.chatboxes = MessageHandler.deleteEntry(nick);
            });
        });

        Socket.on('allConnected', function (data) { 
            dashboard.connected = data;
        });
});

angular.module('chatApp').service('MessageHandler', function($log){
    var chatboxes = {};
    
    this.addEntry = function(data, byMe){
        chatboxes[data.from] = !chatboxes[data.from]?  [] : chatboxes[data.from];
        chatboxes[data.from].push({text: data.message, byMe: byMe});
        return chatboxes;
    };

    this.deleteEntry = function(nick){

        $log.log(delete  chatboxes[nick]); // true
        $log.log(nick); // it's ok
        $log.log(chatboxes); // same elements

       return chatboxes;
    }
});
