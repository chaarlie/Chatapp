
angular.module('chatApp.common').service('User', UserService);

var UserService =  function(){
    var User  = function(username, picUrl, email){
        this.username = username;
        this.picUrl = picUrl;
        this.email = email;

    };
    var user = new User();
    
    this.setUser = function(u){
        for(prop in  u)
            if(user.hasOwnProperty(prop))
                user[prop] = u[prop]; 
    };
    this.getUser = function(){
        return user;
    };
}
