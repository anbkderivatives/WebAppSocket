class Users{
    constructor(){
        this.users = [] //empty array
    }
    addUsers(id,name,room){
        var user = {id,name,room} // or {id:id,name:name,room:room}
        this.users.push(user);
        return user;//return successfull user added
    }    
    getUser(id){
        //return user tha was get
        return this.users.filter((u)=>{
            return u.id === id; 
        })[0];//<-- [0] first element of filtered array
        //or  return this.users.filter((u)=> u.id === id; )[0];
    }
    removeUser (id){
        
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((u)=>{
                return u.id !== id ;
                // could be written with the same effect
                // if(u.id !== id) return u;
            });

        }
        return user;//return user tha was removed
        //if user does not exist the value returned is undefined
    }
    getUsersList (fromthisroom){ //get Users list from e specific room
        //return an array with people list's name e.x ["Joe","Tom","Petros"]

        //get user list with from the corresponding room
        var users = this.users.filter((u)=>{
            return u.room === fromthisroom;
        });
        //store the name strings
        var namesArrays = users.map((u)=>{
            return u.name;
        });

        return namesArrays;
    }
    getRoomList () {
        var roomsMap = this.users.map((user) => user.room);
        var uniqueRooms = roomsMap.filter( onlyUnique );
        return uniqueRooms;
        //  or
        // var uniqueRooms = new Set(roomsMap);
        // return [...uniqueRooms];
        
  }
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

module.exports = {Users};
//or similiar ->
//module.exports.Users = Users;

// Calling the requier
// cnost {Users} = require('./users'); or cnost Users = require('./users').Users;
// var user = new Users();