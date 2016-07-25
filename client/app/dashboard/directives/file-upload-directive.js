angular.module('chatApp').directive("fileUpload", function(Socket, $rootScope){
    return {
        template: '<input  type="file"/>',
        restrict: 'E',
        link: function(scope, element, attrs){ 
            element.bind('change', function(e) {
                var file = e.target.files[0];
                
                Socket.socketStreamEmit('file', {file: file, name: file.name, size: file.size} );
                scope.$on('picChunck', function(event, data){
                    scope.picPercent = data;
                    //alert(data);

                    if(data === 100){
                        $rootScope.$broadcast('picUpload', file.name);    
                        console.log(file);
                         
                    }
                });
            });
        }
    }
});