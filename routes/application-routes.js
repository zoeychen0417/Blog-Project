const express = require("express");
const router = express.Router();

// Setup fs
const fs = require("fs");

// Setup jimp
const jimp = require("jimp");

// Setup multer (files will temporarily be saved in the "temp" folder).
const path = require("path");
const multer = require("multer");
const upload = multer({
    dest: path.join(__dirname, "temp")
});
// set up mime
var mime = require('mime');

//setupDao
const articleDao = require("../modules/articles-dao.js");
const userDao = require("../modules/users-dao.js");
const {verifyAuthenticated} = require("../modules/verify-auth.js");

//display articles title and user article/adv
router.get("/",async function(req, res) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.allInfo = await articleDao.getAUinfo();
    if(user){
        res.locals.userArticle = await articleDao.getUserAllArticles(user.user_id);
    }
    let fileNames = fs.readdirSync("public/images/advs");
    res.locals.adv=fileNames;
    res.render("home");
});


//sort functionality
router.get("/sortBy", async function(req,res){
    const sortBy = req.query.sortBy;
    let article = null;
    if(sortBy == "name"){
        article = await articleDao.sortByName();
        res.json(article); 
        
    }else if (sortBy == "title"){
        article = await articleDao.sortByTitle();
        res.json(article); 
        
    }else if (sortBy == "date"){
        article = await articleDao.sortByDate();
        res.json(article); 
        
    }
});

/** adv */
router.get("/adv", async function(req, res){
    const fileNames = fs.readdirSync("public/images/advs");
    res.json(fileNames);
});
router.get("/cover", async function(req, res){
    const fileNames = fs.readdirSync("public/images/cover");
    res.json(fileNames);
});

router.get("/postNew", async function(req,res){

    res.render("postArticle");
});

router.post("/postNew", async function(req, res){

    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const postTitle = req.body.titlePost;
    const postContent = req.body.contentNew;
    const postImage = req.body.imageCover;
    const postArticle = {
        title: postTitle,
        post_date: new Date().toLocaleString(),
        user_id: user.user_id,
        article_content: postContent,
        article_image: postImage
    };
    await articleDao.postNewArticle(postArticle);
    res.redirect("./");
});

router.get("/userArticle", async function(req, res){
    res.locals.articleDetail = await articleDao.getArticleDetail(req.query.article_id);
    res.render("articleDetail");
});

router.get("/updateNew", async function(req,res){
    
    res.locals.updateArticleDetail = await articleDao.getArticleDetail(req.query.article_id);
    res.render("postArticle");
   

});

router.post("/updateNew", async function(req, res){
    
    const updateId= req.body.articleID;
    const updateTitle = req.body.titleUpdate;
    const updateContent = req.body.contentUpdate;
    const updateImage = req.body.imageCoverUpdate;

    const updateArticle = {
        article_id:updateId,
        title: updateTitle,
        post_date: new Date().toLocaleString(),
        article_content: updateContent,
        article_image: updateImage
    };
    await articleDao.updateArticle(updateArticle);
    res.redirect("./");

});

router.get("/deleteArticle",async function(req, res){
    const articleId = req.query.article_id;
    await articleDao.deleteArticles(articleId);
    res.redirect("./");
});

//image upload
router.post('/upload', function (req, res) {  
    var folderName = path.join(__dirname, '../public/images/tiny/');
    if (!fs.existsSync(folderName)) {
      fs.mkdir(folderName, function (err) {
        if (err) {
          console.log(err);
        }
        else {
  
        }
      });
    }
    else {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }
      
      imgFile = req.files.file;
      imgFile.mv(path.join(__dirname, '../', 'public/images/tiny/', `${imgFile.name}`), function (err) {
        var temp = path.join(__dirname, '../', 'public/images/tiny/', `${imgFile.name}`);
        mime.lookup(path.join(__dirname, '../', 'public/images/tiny/', `${imgFile.name}`));    
        if (err) {
          return res.status(500).send(err);
        }
         res.json({ 'location': `./images/tiny/${imgFile.name}` });
      });
    };
});

module.exports = router;