const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const userDao = require("../modules/users-dao.js");
const {verifySignIn} = require("../modules/verify-auth.js");


router.get("/sign_in", verifySignIn, async function(req, res) {
    const User = res.locals.user;
    const user_information = await userDao.retrieveUserById(User.user_id);
    res.locals.userInfo=user_information;
    res.render("signinNinfo");
});

router.get("/login", function (req, res) {
        res.locals.createOne = req.query.createOne;
        res.locals.message = req.query.message;
        res.render("login");

});
router.post("/login", async function (req, res) {
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
              res.locals.user = User;
              res.redirect("/");
        }else {
            res.locals.user = null;
            res.redirect("./login?message=*Login Failed because of wrong password!");
        }
    }catch(error){
        res.redirect("./login?createOne=Create one!");
    }
});

router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("./");
});

router.get("/signIn", function(req,res){
    res.locals.errorinfo=req.query.errorinfo;
    res.render("signinNinfo");
});

//route handler to handle /signIn
router.post("/signIn", async function(req,res){
    const ps1=req.body.password;
    const ps2= req.body.repassword;
    if(ps1!=ps2){
        const error_info="*Register Failed - Please confirm password again :)";
        res.locals.errorinfo =error_info;
        res.render("signinNinfo");
    }else{
        let password = req.body.password;
        const saltRounds = 10; 
        const salted_value = bcrypt.genSaltSync(saltRounds); //get random salt
        var hashed_value = bcrypt.hashSync(password,salted_value); //get hash value
     
        const newAccount = {
            fname:req.body.fname,
            lname:req.body.lname,
            username:req.body.username,
            // password:req.body.password,
            dob:req.body.birthday,
            user_desc:req.body.description,
            avatar_icon:makeArray(req.body.avatar),
            hashed:hashed_value,
            salted:salted_value
        };
       
        try{
            await userDao.createUser(newAccount);
            res.redirect("./login?message=*Account created successfully!");
        }catch(error){
            console.error(error);
            res.redirect("./signIn?errorinfo=*Username has already existed!");
        };
    }

});

router.post("/update", async function(req,res){
    const User = res.locals.user;
    const password = req.body.password;
    const saltRounds = 10; 
    const salted_value = bcrypt.genSaltSync(saltRounds); //get random salt
    var hashed_value = bcrypt.hashSync(password,salted_value); //get hash value
    
    const updatedAccount = {
        user_id:User.user_id,
        fname:req.body.fname,
        lname:req.body.lname,
        username:req.body.username,
        // password:password,
        dob:req.body.birthday,
        user_desc:req.body.description,
        avatar_icon:makeArray(req.body.avatar),
        hashed:hashed_value,
        salted:salted_value
    };
        await userDao.updateUserInformation(updatedAccount);
        res.redirect("./");

});

function makeArray(input){
    if(input==undefined){
        return [];
    }
    else if(Array.isArray(input)){
        return input;
    }
    else{
        return [input];
    }
}

router.get("/deleteUser", async function(req,res){
    const User = res.locals.user
    await userDao.deleteUserById(User.user_id);
    res.locals.user=null;
    res.redirect("./");
});

router.get("/uniqueUsername", async function(req,res){
   const username = await userDao.checkUsernameIfUnique(req.query.username);
   if(username){
       const result = {
           isExist: true
       };
       res.json(result);
   }else{
        const result = {
            isExist: false
        };
        res.json(result);
   }
});



module.exports = router;