const userRepo = require('../repo/userRepo');

const validateUser = async(username, password) => {
    try {
        let result = await userRepo.validateUser(username, password);

        return result;
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    }
}

module.exports = {
    validateUser
}