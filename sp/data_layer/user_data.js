async function findUser(userName) {
    return {
        userName,
        email: `${userName}@foo.bar`
    }
}

module.exports.findUser = findUser;
