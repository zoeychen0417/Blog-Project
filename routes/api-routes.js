const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");

/**
 * When a POST request is made to /api/login, 
 * a user should be authenticated using the username and 
 * password supplied as JSON in the request body.
 */
router.post("/api/login", async function (req, res) {
    const username = req.body.username;
    //Get plain text from user
    const password = req.body.password;
 
    try{
        const hash_salt_username = await userDao.retrieveSaltedHashed(username);
        const user_name = hash_salt_username.username;
           //Get salt from database
        const salted = hash_salt_username.salted;
        const hashed = hash_salt_username.hashed;
           //Put plaintext and salt into hash function
        const hashedValue = bcrypt.hashSync(password,salted); //get hash value

        if(hashedValue==hashed){
            const User = await userDao.retrieveUserWithCredentials(username, hashed);
             // there is a matching user...
              const authToken = uuid();
              User.authToken = authToken;
              await userDao.updateUser(User);
              res.cookie("authToken", authToken);
            // if authentication is successful
              res.status(204).json({authToken: authToken});

        }else {
            // if authentication is failed
            res.status(401);
        }
    }catch(error){
        // if username is not existed
        res.status(401);
    }
});

/**
 * When a GET request is made to /api/logout, 
 * a user should be logged out 
 * (presumably by deleting their authentication token that was created above). 
 * Then, a 204 response should be returned.
 */
router.get("/api/logout", function (req, res) {
    res.clearCookie("authToken");
    // if user logged out
    res.status(204);
});

/**
 * GET request is made to /api/users;
 */
router.get("/api/users", async function(req,res){
    // if the requestor is authenticated
    if(req.query.authToken){
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        // if requestor is authenticated and as an admin
        if(user.isAdmin){
            const allUsersInfo = await userDao.retrieveAllUsersInfo();
            res.json(allUsersInfo);
        }else{
        // if requestor is authenticated but not as an admin    
            res.status(401);
        }
    }else{
    // if the requestor is unauthenticated    
        res.status(401);
    }

});

/**
 *  DELETE request is made to /api/users/:id
 */
router.delete("/api/users/:id", async function(req,res){
    
    if(req.query.authToken){
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        // if requestor is authenticated and as an admin
        if(user.isAdmin){
            const user_id = req.params.id;
            await userDao.deleteUserById(user_id);
            res.status(204);
        }else{
        // if requestor is authenticated but nost as an admin
            res.status(401);
        }
    }else{
    // if the requestor is unauthenticated
    res.status(401);
    }

});



module.exports = router;