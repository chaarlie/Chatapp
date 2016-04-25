angular.module('chatApp').controller('dashboardController', function(
        $scope,  $log, Session, 
        Socket, MessageHandler){
        
        var dashboard = this;

        Socket.on('msgFromServer', function (data) {
            dashboard.chatboxes = MessageHandler.addEntry(data, false);
            dashboard.msgFrom = data.from;
        });

        $scope.$on('appendMsgByMe', function(event, data){
            $scope.$apply(function(){
                dashboard.chatboxes = MessageHandler.addEntry(data, true);
            });
        });

        Socket.on('allConnected', function (users) {
            dashboard.connected = users;
        });
        
        dashboard.removeChatbox = function(from){
            dashboard.chatboxes = MessageHandler.deleteEntry(from);
        };

        dashboard.createChatbox = function(from){
            dashboard.chatboxes[from] = [];
        };
});
