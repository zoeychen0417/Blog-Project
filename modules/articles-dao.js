const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//without sign in, get all article title
async function getAUinfo(){
    const db = await dbPromise;
    const result = await db.all(SQL`select u.*, a.* from articles as a, users as u where u.user_id=a.user_id`);
    return result;
};

//display article title sort by name
async function sortByName(){
    const db = await dbPromise;
    const result = await db.all(SQL`select a.*, u.* from articles as a, users as u where a.user_id = u.user_id order by u.username COLLATE NOCASE`);
    return result;
}

//display article title sort by title
async function sortByTitle(){
    const db = await dbPromise;
    const result = await db.all(SQL`select a.*, u.* from articles as a, users as u where u.user_id=a.user_id order by a.title`);
    return result;
}

//display article title sort by date
async function sortByDate(){
    const db = await dbPromise;
    const result = await db.all(SQL`select a.*, u.* from articles as a, users as u where u.user_id=a.user_id order by a.post_date desc`);
    return result;
}

//when sign in, get my article title
async function getUserAllArticles(user_id){
    const db = await dbPromise;
    const result = await db.all(SQL`select a.*, u.* from articles as a, users as u where a.user_id = u.user_id AND u.user_id = ${user_id}`);
    return result;
}

//get specific article detail
async function getArticleDetail(article_id){
    const db = await dbPromise;
    const result = await db.get(SQL`select * from articles where article_id=${article_id}`);
    return result;
}

//post new article
async function postNewArticle(article){
    const db = await dbPromise;
    const result = await db.run(SQL`insert into articles (title, post_date, user_id, article_content, article_image) values (${article.title}, ${article.post_date}, ${article.user_id}, ${article.article_content},${article.article_image})`);
    return result;
}


//update edit article
async function updateArticle(article){
    const db = await dbPromise;
    const result = await db.run(SQL`update articles set title=${article.title},post_date=${article.post_date},article_content=${article.article_content}, article_image=${article.article_image} where article_id = ${article.article_id}`);
    return result;
}

async function deleteArticles(article_id){
    const db = await dbPromise;
    await db.get("PRAGMA foreign_keys = ON");
    await db.run(SQL`delete from articles where article_id = ${article_id}`);
}

module.exports = {
    getAUinfo,
    sortByDate,sortByName,sortByTitle, 
    getUserAllArticles,
    getArticleDetail,
    postNewArticle,
    updateArticle,
    deleteArticles
};