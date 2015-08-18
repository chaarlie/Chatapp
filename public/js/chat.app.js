var chatApp = angular.module("chatApp", ["ngCookies", "ngRoute"]);
chatApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/home', {
        templateUrl: "js/views/home.html"
    })
    .when('/login', {
        templateUrl: "js/views/login.html",
        controller:'chatController'
    })
    .when('/', {
        templateUrl: "js/views/login.html",
        controller:'chatController'

    })
}]).run(function ($rootScope, $cookies, $location, Session) {
    $rootScope.messages = [];
    $rootScope.chatboxes  = {};
    $rootScope.username  = $cookies['username'];

   $rootScope.$on('$routeChangeStart', function (event, attrs) {

        if(!attrs)
            event.preventDefault();
        else
            if ( attrs.originalPath !== '/home'){
                if(Session.id)
                    $location.path('/home');
                else
                    $location.path('/login');
            }
    });
    
}).service('Session', function(){
    this.create = function (sessionId) {
        this.id = sessionId;
        
    };
    this.destroy = function () {
        this.id = null;
        
    };
}).factory('AuthService',['$http', 'Session' , function($http, Session){
    
    return{
        doLogin: function (u) {
            var user = {
                username: u.username,
                password: u.password
            };

            $http({
                url: "login/",
                method: "POST",
                data: user,
                headers: {'Content-Type': 'application/json'}
            }).then(function(res){
                Session.create(res.data.sessionId);
            }, function(error){
                alert("error");
            });
            
        },isAuthenticated: function () {
            return !!Session.id;
        }
    };
}]).factory('socket', ['$rootScope', '$location', function ($rootScope, $location) {
    var socket = io.connect();

    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
 
            socket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },

        socketStreamEmit: function (eventName, data) {
            var stream = ss.createStream();

            ss(socket).emit(eventName, stream, {name:data.name, size: data.size});
              
              var blobStream = ss.createBlobReadStream(data.file);
              var size = 0;

              blobStream.on('data', function(chunk) {
               size += chunk.length;
               console.log(Math.floor(size / data.size * 100) + '%');
              // -> e.g. '42%' 
              });

              blobStream.pipe(stream);
                stream = null;

        }
    };
}]);

 

chatApp.controller('chatController', function(
    $scope, $rootScope, $location, 
    $cookies, $http, 
    $compile, $interval, $timeout, 
    AuthService, socket, Session){

    socket.on('msgFromServer', function (data) {     
        var ob = {name: data.from};

        if(!$rootScope.chatboxes[data.from]) {
            $rootScope.messages[data.from] = [];
            $rootScope.chatboxes[data.from] = ob;
        }

        $scope.msgFrom = data.from;

        $timeout(function(){
            $scope.$broadcast('message', data);
        }, 500);
        
     
    });

    socket.on('allConnected', function (data) {   
        delete data[$cookies['username']];
        $scope.connected = data;
    });

    $interval(function(){
        $compile();
    }, 1500);

    $scope.doSubmit = function(){
        AuthService.doLogin($scope.user);

         //Se necesita un tiempo para inicializar isAuthenticated()
         $timeout(function(){
            if(AuthService.isAuthenticated()){
                
                socket.emit('userLogin', {username: $scope.user.username, age: $scope.user.age});
                
                $cookies['username'] = $scope.user.username;

                $location.path('/home');
            }
        }, 500);
    }

    $scope.createChatbox = function(username){
         
         $scope.msgFrom = username;
         $rootScope.chatboxes[username] = {name: username};
    }
    //$scope.createChatbox('test');

});

chatApp.directive('chatboxLabel', function($cookies, socket) {
    return {

        restrict: 'A',
        replace:true,
        scope: true,
        controller: function($scope, $rootScope){

        },
        link: function(scope, element, attrs) {
            element.draggable();

            element.find("span").bind("mousedown", function(){
                
                var nick = element.find('h3').text();
                if('chatbox-' + nick == element.attr("id") ){
                    delete scope.$root.chatboxes[nick];
                    delete scope.$root.messages[nick]
                
                    element.remove();     
               }

            }); 
            
            var container = null;
 
            element.attr("id", "chatbox-" + scope.msgFrom);
            element.find("h3").text(scope.msgFrom);
            scope.current = scope.msgFrom;

            scope.$on('message', function(event, data){
          
                if(element.attr("id") == "chatbox-" + data.from){
                     
                    container = scope.$root.messages[data.from];
                    container.push({text: data.message, byMe: false });
                }
 
            });

            element.find('textarea').bind("keydown", function(event){
                if(event.which === 13){
                    var textInput = $(event.target);
                    var toSend = element.find("h3").text();
                    scope.current = toSend;
                   

                    if(!scope.$root.messages[toSend]) {
                        scope.$root.messages[toSend] = [];
                    }

                    container = scope.$root.messages[toSend];
                    container.push({text: textInput.val(), byMe: true});
        
                    socket.emit('msgToServer', {message: $.trim(textInput.val()), from: $cookies['username'], to: toSend });
                    
                    textInput.val("");
                }
            });
        }
    }
});

chatApp.directive("fileUpload", function(socket){
    return {
        template: '<input  type="file"  />',
        restrict: 'E',
 
        link: function(scope, element, attrs){ 
              element.bind('change', function(e) {
                var file = e.target.files[0];
                socket.socketStreamEmit('file', {file: file, name: file.name, size: file.size} );
              });
        }
    }
});
