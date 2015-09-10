var chatApp =  angular.module("chatApp", ["ngCookies", "ngRoute", "ui.bootstrap", "chart.js"]);
//var chatApp = angular.module("chatApp", ["ngCookies", "ngRoute", "ui.bootstrap" ]);
chatApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/home', 
    {
        templateUrl: "../../views/home.html",
        controller:'homeController'
    })
    .when('/login', {
        templateUrl: "../../views/login.html",
        controller:'loginController'
    })
    .when('/interests', {
        templateUrl: "../../views/interests.html",
        controller:'interestsController'
    })
    .otherwise({redirectTo:'/login'});
}]).run(function ($rootScope, $cookies, $location, Session) {
    $rootScope.messages = [];
    $rootScope.chatboxes  = {};
 

   $rootScope.$on('$routeChangeStart', function (event, attrs) {
        var validPaths = ['/home', '/login','/interests'];

        if(!attrs)
            event.preventDefault();
        else{

            if (validPaths.indexOf(attrs.originalPath) > -1 && Session.id){
                if(attrs.originalPath === '/home'){

                    console.log($rootScope.messages);
                    console.log($rootScope.chatboxes);
                }

                $location.path(attrs.originalPath);
            }
    /*        if (attrs.originalPath === validPaths[1] && Session.id) 
                event.preventDefault();
*/
        }
    });
    
}).service('Session', function(){
    this.create = function (sessionId) {
        this.id = sessionId;  
    };
    this.destroy = function () {
        this.id = null;    
    };
    this.createUser = function(username){
        this.username = username;
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
            picChunck = 0;
            blobStream.on('data', function(chunk) {
                size += chunk.length;
                
                // -> e.g. '42%' 
                picChunck = Math.floor(size / data.size * 100);
                $rootScope.$broadcast('picChunck', picChunck);     
            });

            blobStream.pipe(stream);
            stream = null;
        }
    };
}]);

chatApp.directive('chatboxLabel', function($cookies, socket, Session) {
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        controller: function($scope, $rootScope){

        },
        link: function(scope, element, attrs) {
            element.draggable();

            element.find("span").bind("mousedown", function(){ 
                var nick = element.find('h3').text();
                 
                    delete scope.$root.chatboxes[nick];
                    scope.$root.messages.splice(nick, 1);

                    element.remove();     

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

                    console.log(scope.$root.messages);

                    container = scope.$root.messages[toSend];
                    container.push({text: textInput.val(), byMe: true});
        
                    socket.emit('msgToServer', {message: $.trim(textInput.val()), from: Session.username, to: toSend });
                    
                    textInput.val("");
                }
            });
        }
    }
});

chatApp.directive("fileUpload", function(socket, $compile){
    return {
        template: '<input  type="file"/>',
        restrict: 'E',
        link: function(scope, element, attrs){ 
            element.bind('change', function(e) {
                var file = e.target.files[0];
     
                socket.socketStreamEmit('file', {file: file, name: file.name, size: file.size} );
                scope.$on('picChunck', function(event, data){
                    scope.picPercent = data;

                    if(data === 100){
                        scope.$broadcast('picUpload', file.name);    
                        console.log(file);
                    }
                });
            });
        }
    }
});

chatApp.directive("profileInfo", function($cookies){
    return{
        templateUrl:'../../templates/profile-info.html',
        restrict: 'E',
        link: function(scope, element, attrs){

            $(element).find("#profile-pic").hover(function(){
                $("#spinner").addClass("circle angled second");
                $("#change-pic").css('visibility','visible');
            }, function(){
                $("#spinner").removeClass("circle angled second");
                $("#change-pic").css('visibility','hidden');
            });;
        }
    }
});

chatApp.directive("changePic", function(){
    return{
        template:'<button id="change-pic" style="visibility:hidden" class="btn btn-default">Cambiar</button>',
        restrict: 'E',
      
        link:function(scope, element, attrs, controller){
            element.click(function(){
                scope.openModal();
            });
        }
    }
});

chatApp.controller('homeController', function(
    $scope, $rootScope,
    $http, $timeout, $modal,  
    $compile, $interval, 
    $cookies, socket, Session){
    $scope.user = {
        name: Session.username,
        pic:''
    };

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

chatApp.controller('interestsController', function($scope, Session, socket){
    $scope.user = {
        name: Session.username
    };
    $scope.symptomsSelected = {};

    $scope.interestAdd = function(){
        socket.emit('interestAddNew', $scope.newInterest);
    };
});


chatApp.controller('loginController', function(
    $timeout, $cookies, 
    $location, $scope,
    $rootScope, 
    AuthService, socket,
    Session

){
    $scope.doSubmit = function(){
        AuthService.doLogin($scope.user);

         //Se necesita un tiempo para inicializar isAuthenticated()
         $timeout(function(){
            if(AuthService.isAuthenticated()){
                
                socket.emit('userLogin', {username: $scope.user.username, age: $scope.user.age});
            
                Session.createUser($scope.user.username);

                $location.path('/home');
            }
        }, 500);
    };
});


chatApp.directive('symptomSearchbox', function($http, $timeout, socket){
             return{
                 templateUrl: '../../templates/symptom-searchbox.html',
                 link:function(scope, element, attribute){
                     var searchBox = element.find('p');
                      
                    searchBox.click(function(){
                        $(this).removeClass().text("").attr('contenteditable', 'true');
                        $("#symptom-searchbox span").removeClass();
                     });
                     
                    searchBox.bind('keydown ', function(event){ 
                        var interest = element.find('div').text().trim();
                        $timeout(function(){
                            socket.emit('interestSearch', interest);
                        }, 500);
                    });
                      
                   socket.on('interestResult', function(found){
                        scope.symptoms  = found;
                        scope.showResults = true; 
                   });
                    
                     
                     scope.$on('selected', function(event, id){
                        scope.$apply(function(){                 
                            scope.showResults = false;
                            searchBox.attr('contenteditable', 'false');
                             socket.emit('interestAdd', id);
                         });
                       
                        
                        for(i in scope.symptoms){
                            //console.log(scope.symptoms[i].name + " | " + id )
                            if(id == scope.symptoms[i].name ){
                                scope.$apply(function(){
                                    scope.symptomsSelected[id] = scope.symptoms[i] ;
                                    console.log(scope.symptomsSelected);
                             });
                                break;
                            }
                        }
                        
                     });
                     
                    scope.$on('unselected', function(event, id){
                        scope.$apply(function(){
                            delete scope.symptomsSelected[id];
                            socket.emit('interestDel', id);
                        });
                    });
                 } 
             }
         }).directive('symptomElement', function(){
             return{
                 template:'<li">{{symptom.name}}  </li>',
                 link:function(scope, element, attribute){
                     var queryInput = $("#symptom-searchbox p");
                     element.click(function(){
                         queryInput.text(element.text()).addClass('symptom symptom-search fade-hover');;
                         scope.$emit('selected', attribute.id);
                     });
                 }
             }
         }).directive('symptomSelected', function(){
             return{
                 template:'<p class="symptom symptom-selected">{{symptom.name}}</p><span  class="icon-cancel"></span>',
                 link: function(scope, element, attribute){
                     var quitSymptom = element.find('span');
                     quitSymptom.click(function(){
                        scope.$emit('unselected', attribute.id);
                     });
                 }
             }
         });

chatApp.directive('pie', function($http, socket){
    return{
        //template: '<div id="canvas-holder"> <canvas id="chart-area" width="300" height="300"/> </div>',
        template: '<canvas   class="chart chart-pie" chart-data="data" chart-labels="labels"> </canvas> ',
        link: function(scope, element, attribute){
            scope.labels = [];
            scope.data = [];

            $http.get("get_interests").then(function(res){
                var interests  = res.data;
            
                for(i in interests){
                    scope.labels.push(interests[i].name);
                    scope.data.push(interests[i].count);
                }

            }, function(error){
                alert("error");
            });

            socket.on('interestList', function(interests){
                scope.labels = [];
                scope.data = [];
                for(i in interests){
                    scope.labels.push(interests[i].name);
                    scope.data.push(interests[i].count);
                }
            });

        }
    }
});