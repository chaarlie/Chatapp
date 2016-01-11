angular.module('chatApp').controller('homeController', function(
        $scope, $rootScope,
        $http, $timeout, $modal,  
        $compile, $interval,
        Session, Socket){
        
        $scope.user = {
            name: Session.username,
            pic:''
        };

        Socket.on('msgFromServer', function (data) {     
            var ob = {name: data.from};

            if(!$rootScope.chatboxes[data.from]) {
                $rootScope.messages[data.from] = !$rootScope.messages[data.from]? [] : $rootScope.messages[data.from];
                $rootScope.chatboxes[data.from] = ob;
            }

            $scope.msgFrom = data.from;

            $timeout(function(){
                $scope.$broadcast('message', data);
            }, 500);
        });

        $timeout(function(){
            Socket.emit('displayReadyClient');
        }, 1000);

        Socket.on('allConnected', function (data) {   
            delete data[Session.username];

            //for initialization: if the window is open and the message is sent, an error is thrown.
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

             $scope.modalInstance  = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/app/home/directives/change-pic.html',
                controller: 'homeController',
                size: 'md'
            });
        };

         $scope.closeModal = function () {
            $modal.close();
        }
});