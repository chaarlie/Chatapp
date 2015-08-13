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
}]).run(function ($rootScope) {
    $rootScope.messages = [];
    $rootScope.chatboxes  = {};
}).factory(
'handleLogin',
function($http, $location ) {
    return {
        doLogin : function(scope ) {
            return $http.post('/login', {username: scope.user.username, age: scope.user.age}).then(
                function(res) {
                    scope.auth = (res.data.username !== null);
                    
                    if(scope.auth)
                        $location.path('/home');
                },
                function(error){
                    alert("an error occured");
                    console.log(error);
                }
                );
        }
    };
}).factory('socket', ['$rootScope', function ($rootScope) {
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

 

chatApp.controller('chatController', function($scope, $rootScope, $location,$cookies, $http, $compile, $interval, $timeout, handleLogin, socket){

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
        $scope.connected = data;
    });

    $interval(function(){
        $compile();
    }, 1500);

    $scope.doSubmit = function(){
        handleLogin.doLogin($scope);
        
        socket.emit('userLogin', {username: $scope.user.username, age: $scope.user.age});

        $cookies['username'] = $scope.user.username;
    }

    $scope.createChatbox = function(username){
         
         $scope.msgFrom = username;
         $rootScope.chatboxes[username] = {name: username};
    }

});

chatApp.directive('chatboxLabel', function($cookies, socket) {
    return {

        restrict: 'A',
        replace:true,
        scope: true,
        controller: function($scope, $rootScope){
        },
        link: function(scope, element, attrs) {
            $(element).draggable();
            
            var removeChatbox = element.find("span");
            removeChatbox.bind("mousedown", function(){
                //
                var nick = element.find('h3').text();
               if('chatbox-' + nick == element.attr("id") ){
                    delete scope.$root.chatboxes[nick];
                    delete scope.$root.messages[nick]
                
                    $('#chatbox-' + nick).remove();     
               }

            }); 
            
               var displayRef =  null;
            var container = null;
            var d = new Date();
             
            element.attr("id", "chatbox-" + scope.msgFrom);
            element.find("h3").text(scope.msgFrom);
            scope.current = scope.msgFrom;

            scope.$on('message', function(event, data){
          

                if(element.attr("id") == "chatbox-" + data.from){
                    
                    element.data('to', data.from);
                     
                    container = scope.$root.messages[data.from];
                    container.push({text: data.message, person: data.from });

                    var sentLength = $("#message-window .chat-bubble").length ;
                    $($("#message-window .chat-bubble")[sentLength-2]).addClass('bubble-left');
                   
                }
 
            });

            element.bind("keydown", function(event){
                if(event.which === 13){
                    var textInput = $('#chatbox-' + scope.msgFrom + ' #message-input');
                    
                    displayRef = $($("#chatbox-" + scope.msgFrom +  " textarea")[0]);


                    if(!scope.$root.messages[scope.msgFrom]) {
                        scope.$root.messages[scope.msgFrom] = [];
                    }

                    container = scope.$root.messages[scope.msgFrom];

                    container.push({text: textInput.val(), person: $cookies['username']});
                    displayRef.append("\n" +  $cookies['username'] + ": " + $.trim(textInput.val()) ); 
                    
                    

                    socket.emit('msgToServer', {message: $.trim(textInput.val()), from: $cookies['username'], to: scope.msgFrom });
                    
                    var sentLength = $("#message-window .chat-bubble").length ;
                    $($("#message-window .chat-bubble")[sentLength-1]).addClass('bubble-right');

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
        scope: false, //default
        link: function(scope, element, attrs){ 
              element.bind('change', function(e) {
                    var file = e.target.files[0];

                socket.socketStreamEmit('file', {file: file, name: file.name, size: file.size} );
                
              });
        }
    }
});