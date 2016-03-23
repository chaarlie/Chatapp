angular.module('chatApp').directive("fileUpload", function(Socket, $compile){
    return {
        template: '<input  type="file"/>',
        restrict: 'E',
        link: function(scope, element, attrs){ 
            element.bind('change', function(e) {
                var file = e.target.files[0];
     
                Socket.socketStreamEmit('file', {file: file, name: file.name, size: file.size} );
                scope.$on('picChunck', function(event, data){
                    scope.picPercent = data;

                    if(data === 100){
                        scope.$emit('picUpload', file.name);    
                        console.log(file);
                    }
                });
            });
        }
    }
});