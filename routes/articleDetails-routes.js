const express = require("express");
const router = express.Router();
//articleDao
const articleDao = require("../modules/articleDetails-dao.js");
// -----------------------------------------this part edited by Yikuan-----------------------------------------

//when click each article, render all details of that article
router.get("/articleDetails", async function (req, res) {
    const articleDetails = await articleDao.retrieveArticleByArticleId(req.query.article_id);
    const commentsAry = await articleDao.retrieveCommentsByArticleId(req.query.article_id);
    //rebuild all the comments in a tree structure
    for (eachCommentJson of commentsAry) {
        const subComments = [];
        eachCommentJson.subComments = subComments;
    }
 
    for (let i = 0; i < commentsAry.length; i++) {
        for (let j = 0; j < commentsAry.length; j++) {
            if (commentsAry[i].comment_id == commentsAry[j].parent_comment_id) {
                commentsAry[i].subComments.push(commentsAry[j]);
            }
        }
    }

    let expectedCommentAry = [];
    for (eachComment of commentsAry) {
        if (eachComment.isChild == 0) {
            expectedCommentAry.push(eachComment);
        }
    }

    res.locals.commentsAry = expectedCommentAry;
    res.locals.articleDetails = articleDetails;

    res.render("articleDetails");
});

//when the user posts new comments, route handler to deal with this
router.post("/postNewComment", async function (req, res) {
    await articleDao.addNewComments(req.body.newComment, req.body.article_id, req.body.user_id);
    //after the user posts new comments, redirect to the previous article position
    res.redirect(`./articleDetails?article_id=${req.body.article_id}`);
});

//when the user click the delete comment btn, route handler deals with this
router.get("/deleteComment", async function (req, res) {
    await articleDao.deleteComment(req.query.comment_id);
    res.redirect(`./articleDetails?article_id=${req.query.article_id}`);
});

//when the user reply a comment, route handler deals with this
router.post("/replyComment", async function (req, res) {
    //add the new reply comment to the db
    await articleDao.replyComment(req.body.replyComment, req.body.parent_comment_id, req.body.user_id, req.body.article_id);
    res.redirect(`./articleDetails?article_id=${req.body.article_id}`);
});

//when the user upVotes or downVotes a comment, route handler deals with this
router.get("/upComment", async function(req, res){
    const user_id = res.locals.user.user_id;
    const comment_id = req.query.comment_id;
    const prevOp = await articleDao.checkPrevOp(user_id, comment_id);

    let upState = false;//default up state
    if(prevOp){
        if(prevOp.up){//check existing up state
            if(prevOp.up == 0){//prev state: user clicks down
                upState = true;
            }else if(prevOp.up == 1){//prev state: user clicks up
                upState = null;
            }
        }else{//if no op existing
            upState = true;
        }
    }else{
        upState = true;
        await articleDao.addNewOp(user_id, comment_id, true);
    }
    
    
    await articleDao.changeOp_upState(user_id, comment_id, upState);//change the op
    await articleDao.changeNumOfLike(comment_id, upState);//change the num of like and dislike
    const numOfLike = await articleDao.getNumOfLike(comment_id);//get the num of like after updating db
    res.json(numOfLike);
});

router.get("/downComment", async function(req, res){
    const user_id = res.locals.user.user_id;
    const comment_id = req.query.comment_id;
    const prevOp = await articleDao.checkPrevOp(user_id, comment_id);
    
    let downState = false;//default down state
    if(prevOp){
        prevUp = prevOp.up;
        if(prevOp.down){//check existing down state
            if(prevOp.down == 0){//prev state: user clicks up
                downState = true;
            }else if(prevOp.down == 1){//prev state: user clicks down
                downState = null;
            }
        }else{//if no op existing
            downState = true;
        }
    }else{
        downState = true;
        await articleDao.addNewOp(user_id, comment_id, false);
    }

    await articleDao.changeOp_downState(user_id, comment_id, downState);//change the op
    await articleDao.changeNumOfDislike(comment_id, downState);//change the num of dislike and dislike
    const numOfDislike = await articleDao.getNumOfDislike(comment_id);//get the num of dislike after updating db
    res.json(numOfDislike);
});

//check the user's opinion on the given comment
router.get("/checkOpinion", async function(req, res){
    const comment_id = req.query.comment_id;
    const user_id = res.locals.user.user_id;

    const checkResult = await articleDao.checkOp(user_id, comment_id);
    if(checkResult){
        res.json(checkResult);
    }
    else{
        res.json(null);
    }
});

//check if the logined user is the current aritcle's author
router.get("/checkAuthor", async function(req, res){
    const userArticles = await articleDao.retrieveArticleByUserId(res.locals.user.user_id);
    let checkResult = {isAuthor : false};
    if(userArticles){
        for(eachArticle of userArticles){
            if(eachArticle.article_id == req.query.currentArticleId){
                checkResult.isAuthor = true;
            }
        }
    }
    res.json(checkResult);
});
module.exports = router;