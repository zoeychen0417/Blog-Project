const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrieveArticleByArticleId(articleId) {
    const dbInfo = await dbPromise;
    const articleDetails = await dbInfo.get(SQL`
        SELECT article_id, title, post_date, article_content, fname, lname, u.username
        FROM articles as a, users as u
        WHERE a.user_id = u.user_id AND article_id=${articleId};
    `);
    return articleDetails;
}

async function retrieveCommentsByArticleId(articleId) {
    const dbInfo = await dbPromise;
    const allComments = await dbInfo.all(SQL`
        SELECT *
        FROM comments as c, users as u
        WHERE article_id = ${articleId} AND c.user_id = u.user_id
        ORDER by comment_date;
    `);
    return allComments;
}

async function retrieveArticleByUserId(userId) {
    const dbInfo = await dbPromise;
    const allArticles = await dbInfo.all(SQL`
        SELECT *
        FROM articles
        WHERE user_id = ${userId};
    `);
    return allArticles;
}

async function addNewComments(comment_Content, article_id, user_id) {
    const dbInfo = await dbPromise;
    await dbInfo.run(SQL`
        INSERT INTO comments (comment_content, comment_date, num_of_like, num_of_dislike, isChild, user_id, article_id)
        VALUES (${comment_Content}, datetime(), 0, 0, false, ${user_id}, ${article_id});
    `);
}

async function deleteComment(comment_id) {
    const dbInfo = await dbPromise;
    await dbInfo.get("PRAGMA foreign_keys = ON");
    await dbInfo.run(SQL`
        DELETE FROM comments
        WHERE comment_id = ${comment_id};
    `);
}

async function replyComment(comment_Content, parent_comment_id, user_id, article_id) {
    const dbInfo = await dbPromise;
    await dbInfo.run(SQL`
        INSERT INTO comments (comment_content, comment_date, num_of_like, num_of_dislike, parent_comment_id, isChild, user_id, article_id)
        VALUES (${comment_Content}, datetime(), 0, 0, ${parent_comment_id}, true, ${user_id}, ${article_id});
    `);
}

//check opion
async function checkOp(user_id, comment_id){
    const dbInfo = await dbPromise;
    const result = await dbInfo.get(SQL`
        SELECT *
        FROM opinion
        WHERE user_id = ${user_id} AND comment_id = ${comment_id};
    `);
    return result;
}

//for upVote and downVote
async function addNewOp(user_id, comment_id, defaultState) {
    const dbInfo = await dbPromise;
    if (defaultState) {
        await dbInfo.run(SQL`
            INSERT INTO opinion VALUES
            (${user_id}, ${comment_id}, true, false);
        `);
    } else {
        await dbInfo.run(SQL`
            INSERT INTO opinion VALUES
            (${user_id}, ${comment_id}, false, true);
        `);
    }
}

async function checkPrevOp(user_id, comment_id) {
    const dbInfo = await dbPromise;
    const result = await dbInfo.get(SQL`
        SELECT *
        FROM opinion
        WHERE user_id = ${user_id} AND comment_id = ${comment_id};
    `);
    return result;
}

//for upVote
async function changeOp_upState(user_id, comment_id, upState) {
    const dbInfo = await dbPromise;
    if (upState == true) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = true, down = false
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
        `);
    }
    else if (upState == false) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = false, down = true
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
        `);
    }
    else if (upState == null) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = null, down = null
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
    `);
    }
}

async function changeNumOfLike(comment_id, upState) {
    const dbInfo = await dbPromise;
    if (upState == true) {
        await dbInfo.run(SQL`
            UPDATE comments
            SET num_of_like = num_of_like + 1
            WHERE comment_id = ${comment_id};
        `);
    }
    else if (upState == false || upState == null) {
        await dbInfo.run(SQL`
            UPDATE comments
            SET num_of_like = num_of_like -1
            WHERE comment_id = ${comment_id};
        `);
    }
}

async function getNumOfLike(comment_id) {
    const dbInfo = await dbPromise;
    const result = await dbInfo.get(SQL`
        SELECT num_of_like
        FROM comments
        WHERE comment_id = ${comment_id};
    `);
    return result;
}

//for downVote
async function changeOp_downState(user_id, comment_id, downState) {
    const dbInfo = await dbPromise;
    if (downState == true) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = false, down = true
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
        `);
    }
    else if (downState == false) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = true, down = false
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
        `);
    }
    else if (downState == null) {
        await dbInfo.run(SQL`
            UPDATE opinion
            SET up = null, down = null
            WHERE user_id = ${user_id} AND comment_id = ${comment_id};
    `);
    }
}

async function changeNumOfDislike(comment_id, downState) {
    const dbInfo = await dbPromise;
    if (downState == true) {
        await dbInfo.run(SQL`
            UPDATE comments
            SET num_of_dislike = num_of_dislike + 1
            WHERE comment_id = ${comment_id};
        `);
    }

    else if (downState == false || downState == null) {
        await dbInfo.run(SQL`
            UPDATE comments
            SET num_of_dislike = num_of_dislike -1
            WHERE comment_id = ${comment_id};
        `);
    }
}

async function getNumOfDislike(comment_id) {
    const dbInfo = await dbPromise;
    const result = await dbInfo.get(SQL`
        SELECT num_of_dislike
        FROM comments
        WHERE comment_id = ${comment_id};
    `);
    return result;
}

module.exports = {
    retrieveArticleByArticleId,
    retrieveCommentsByArticleId,
    retrieveArticleByUserId,
    addNewComments,
    deleteComment,
    replyComment,
    checkOp,
    //function for upVote and downVote
    addNewOp,
    //up
    checkPrevOp,
    changeOp_upState,
    changeNumOfLike,
    getNumOfLike,
    //down
    changeOp_downState,
    changeNumOfDislike,
    getNumOfDislike
}