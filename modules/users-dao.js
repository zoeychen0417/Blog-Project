const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into users (fname,lname,username,dob,user_desc,avatar_icon,hashed,salted) values(${user.fname}, ${user.lname}, ${user.username},${user.dob},${user.user_desc},${user.avatar_icon[0]},${user.hashed},${user.salted})`);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.user_id = result.lastID;
}

async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

async function retrieveUserWithCredentials(username, hashed) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username} and hashed = ${hashed}`);

    return user;
}
async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set authToken = ${user.authToken}
        where user_id = ${user.user_id}`);
}
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where user_id = ${id}`);

    return user;
}
async function updateUserInformation(user){
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set fname=${user.fname},lname=${user.lname},username = ${user.username},dob=${user.dob},user_desc=${user.user_desc},avatar_icon=${user.avatar_icon[0]},hashed=${user.hashed},salted=${user.salted}
        where user_id = ${user.user_id}`);
}
async function checkUsernameIfUnique(username){
    const db = await dbPromise;

    const user = await db.get(SQL` select * from users where username = ${username}`);
    return user;
}
async function retrieveSaltedHashed(username){
    const db = await dbPromise;
    const user = await db.get(SQL` select username,salted,hashed from users where username = ${username}`);
    return user;
}

async function deleteUserById(id){
    const db = await dbPromise;
    await db.get("PRAGMA foreign_keys = ON");
    await db.run(SQL`
       delete from users where user_id == ${id}`);
}
//api request
async function retrieveAllUsersInfo(){
    const db = await dbPromise;
    const result = await db.all(SQL`
    select u.*, count(a.article_id) as num_of_articles
    from users as u, articles as a
    where u.user_id = a.user_id
    group by u.user_id`);
    return result;
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserWithAuthToken,
    retrieveUserWithCredentials,
    updateUser,
    retrieveUserById,
    deleteUserById,
    updateUserInformation,
    checkUsernameIfUnique,
    retrieveSaltedHashed,
    retrieveAllUsersInfo
    
};