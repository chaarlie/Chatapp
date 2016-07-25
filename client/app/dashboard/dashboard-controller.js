(function(){
    angular.module('chatApp').controller('dashboardController',
        [
            '$scope',  '$log', 'Session', 
            '$uibModal', 'Socket', 'MessageHandler',
             dashboardController
        ]
    );

        function dashboardController (
            $scope,  $log, Session, 
            $uibModal, Socket, MessageHandler
        ){
        
            var dashboard = this;
            dashboard.user = {};
            dashboard.user.pic = 'blank-user.jpg';

            //if there are messages on the service they should
            // be displayed when you come back from another route
            var currentMessages = MessageHandler.getAll();
            if(Object.keys(currentMessages).length > 0){
                dashboard.chatboxes = currentMessages;
               
            }

            Socket.on('msgFromServer', function (data) {
                dashboard.chatboxes = MessageHandler.addEntry(data, false);
                dashboard.msgFrom = data.from;
            });
             Socket.on('allConnected', function (users) {
                dashboard.connected = users;
            });

            //when changing routes, delete event listeners
            $scope.$on('$destroy', function() {
                Socket.clean();
            });
            $scope.$on('appendMsgByMe', function(event, data){
                $scope.$apply(function(){
                    dashboard.chatboxes = MessageHandler.addEntry(data, true);
                });
            });
            $scope.$on('picUpload', function(event, name){
                $scope.$apply(function(){
                    dashboard.user.pic =  name;
                });     
            });

            dashboard.removeChatbox = function(from){
                dashboard.chatboxes = MessageHandler.deleteEntry(from);
            };

            dashboard.createChatbox = function(from){
                if(!dashboard.chatboxes[from]) 
                    dashboard.chatboxes[from] = [];
            };
            dashboard.openModal = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/dashboard/directives/change-pic.html',
                    controller: function($uibModalInstance, $scope){
                        var dashboard = this;

                        dashboard.proceedPicUpload = function(){
                            $uibModalInstance.close();
                        };
                        dashboard.cancelPicUpload = function(){
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'md',
                    controllerAs: 'dashboard',
                    keyboard: true 
                });
            };
        };
}());

