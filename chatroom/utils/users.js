const Users=[];

function userjoin(id,username,room){
    //const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=
    //${username}`;
const user={id,username,room}
Users.push(user);
return user;
}

//for current user
function getcurrentuser(id){
return Users.find(user=>user.id===id);
}

//This function is intended to remove a user from a global Users array based on the provided user ID (id).
function userleave(id){
    const idx=Users.findIndex(user=>user.id===id);
    if(idx!==-1){
        return Users.splice(idx,1)[0];//return the user only
    }
} 

//This function returns a list of users in a specified room.
function getRoomUser(room){
    //Filter Users by Room: The function uses the filter method to create a new array containing only the users whose room property matches the provided room parameter.
       return Users.filter(user=>user.room ===room);

       //Return the Filtered Array: The filtered array of users is then returned. This array contains all users in the specified room
}

module.exports={
    userjoin,
    getcurrentuser,
    getRoomUser,
    userleave
};