angular.module('chatApp').controller('homeController', function(
        $scope, $rootScope,
        $http, $timeout, $modal,  
        $compile, $interval, 
        $cookies, socket, Session){
        $scope.user = {
            name: Session.username,
            pic:''
        };
        alert();

        socket.on('msgFromServer', function (data) {     
            var ob = {name: data.from};

            if(!$rootScope.chatboxes[data.from]) {
                $rootScope.messages[data.from] = !$rootScope.messages[data.from]? [] : $rootScope.messages[data.from];
                //$rootScope.chatboxes[data.from] = ob;
                $rootScope.chatboxes[data.from] = ob;
            }

            $scope.msgFrom = data.from;

            $timeout(function(){
                $scope.$broadcast('message', data);
            }, 500);
        });

        $timeout(function(){
            socket.emit('displayReadyClient');
        }, 1000);

        socket.on('allConnected', function (data) {   
            delete data[Session.username];

            //para inicializacion. si la ventana ya esta abierta y 
            //se envia el mensaje, da un error. 
            for (var d in data)
                $rootScope.messages[d] = !$rootScope.messages[d]? [] : $rootScope.messages[d] ;

            $rootScope.connected = data;
        });

        $interval(function(){
            $compile()($scope);
        }, 1500);

        
        $scope.createChatbox = function(username){
             $scope.msgFrom = username;
             $rootScope.chatboxes[username] = {name: username};
        };

        $scope.user.pic = 'blank-user.jpg';
        $scope.$on('picUpload', function(event, name){
        
            $rootScope.$apply(function(){
                $scope.user.pic =  name;
            });     
        });

        $scope.openModal = function () {

            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: '../../templates/change-pic.html',
              controller: 'homeController',
              size: 'md'
            });
        };
});