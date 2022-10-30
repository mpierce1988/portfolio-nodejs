const loginService = require('../services/loginService');

const validateUser = async (username, password) => {
    try {
        let result = await loginService.validateUser(username, password);
        return result;
    } catch (error) {
        return false;
    }
}

module.exports = {validateUser};