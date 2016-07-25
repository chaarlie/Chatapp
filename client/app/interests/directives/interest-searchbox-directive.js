chatApp
    .directive('interestSearchbox', function($http, $timeout, Socket){
        return{
            templateUrl: '/app/interests/directives/interest-searchbox.html',
            link:function(scope, element, attribute){
                var searchBox = element.find('p');

                searchBox.click(function(){
                    $(this).removeClass().text("").attr('contenteditable', 'true');
                    $("#symptom-searchbox span").removeClass();
                });

                searchBox.bind('keydown ', function(event){ 
                    var interest = element.find('div').text().trim();
                    $timeout(function(){
                        Socket.emit('interestSearch', interest);
                    }, 500);
                });

                Socket.on('interestResult', function(found){
                    scope.interests  = found;
                    scope.showResults = true; 
                });


                scope.$on('selected', function(event, id){
                    scope.$apply(function(){                 
                        scope.showResults = false;
                        searchBox.attr('contenteditable', 'false');
                        Socket.emit('interestAdd', id);
                    });


                    for(i in scope.interests){
                        //console.log(scope.interests[i].name + " | " + id )
                        if(id == scope.interests[i].name ){
                            scope.$apply(function(){
                                scope.interestsSelected[id] = scope.interests[i] ;
                                console.log(scope.interestsSelected);
                            });
                            break;
                    }
                        }

                });

                scope.$on('unselected', function(event, id){
                    scope.$apply(function(){
                        delete scope.interestsSelected[id];
                        Socket.emit('interestDel', id);
                    });
                });
            } 
        }
});