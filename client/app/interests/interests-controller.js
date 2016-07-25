chatApp.controller('interestsController', function($scope, Session, Socket){
    $scope.user = {
        name: Session.username
    };
    $scope.symptomsSelected = {};

    $scope.interestAdd = function(){
        Socket.emit('interestAddNew', $scope.newInterest);
    };
});