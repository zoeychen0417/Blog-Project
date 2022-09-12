const userDao = require("../modules/users-dao.js");

async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./");
    }
}
function verifySignIn(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./signIn");
    }
}


module.exports = {
    addUserToLocals,
    verifyAuthenticated,
    verifySignIn
}