angular.module('chatApp')
    .directive('chatboxLabel', function(Socket, Session) {
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
        
                    Socket.emit('msgToServer', {message: $.trim(textInput.val()), from: Session.username, to: toSend });
                    
                    textInput.val("");
                }
            });
        }
    }
});