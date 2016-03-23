angular.module('chatApp').controller('dashboardController', function(
        $scope, $rootScope,
        $http, $timeout, $modal,  
        $compile, $interval, $log,
        Session, Socket, MessageHandler){
        
        var dashboard = this;

        dashboard.connected = [{name:"Charlie"}, {name:  "Jhon"}, {name:"Clarissa"} ];

        Socket.on('msgFromServer', function (data) {
         // alert();
              
            //$timeout(function(){
                // $scope.$broadcast('message', data);
                  $log.log("here");
                dashboard.chatboxes = JSON.parse( {
    "from": "Bot",
    "to": "",
    "message": "welcomeInstructions"
 });
                $log.log(dashboard.chatboxes);
            //}, 500);
        });
/*$timeout(function(){
            
        $log.log("despues de cargar");
        $log.log(dashboard.chatboxes);
        $scope.$watch('dashboard.chatboxes', function(value){
            $log.log('wtf');
            $log.log(value);
        });
}, 2500);
        */
        Socket.on('allConnected', function (data) {
            $log.log(data);  
            dashboard.connected = data;
        });


        dashboard.sendMessage = function() {
            $log.log(dashboard.userMessage);
             Socket.emit('msgToServer', {message: dashboard.userMessage, from: dashboard.user , to: dashboard.receipient });           
        }

        
});

angular.module('chatApp').service('MessageHandler', function(){
    var chatboxes = [];

    this.addEntry = function(data, byMe){
            chatboxes[data.from] = !chatboxes[data.from]?  [] : chatboxes[data.from];
            chatboxes[data.from].push({text: data.message, byMe: byMe});

            return chatboxes;
    }
});
