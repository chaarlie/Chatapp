angular.module('chatApp')
    .directive('chatboxConverter', function(Socket, Session, MessageHandler , $log, $rootScope) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {

            element.draggable();
            element.find("span").bind("mousedown", function(){ 
                var nick = element.find('h3').text();
                $rootScope.$broadcast('removeChatbox', nick);
                element.remove();     

            }); 

            
           
            element.find('textarea').bind("keydown", function(event){   
                if(event.which === 13){
                    var textInput = $(event.target);
                    var toSend = $.trim(element.find("h3").text());
                 
                    var data = {message: $.trim(textInput.val()), from: toSend, to:  Session.username};

                    $rootScope.$broadcast('appendMsgByMe', data);
                    
                    data.from = Session.username;
                    data.to = toSend;
                    Socket.emit('msgToServer', data);

                    textInput.val("");
                }
            });
        }
    }
});