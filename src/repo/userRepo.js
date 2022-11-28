const mongoDAL = require('./MongoDAL');
const bcrypt = require('bcrypt');

/**
 * Takes a username and password, and returns true if it matches a record in the user database. Otherwise, returns false
 * @param {string} username Requested Username 
 * @param {string} password Requested Password 
 * @returns {boolean} True if username/password combination is valid
 */
const validateUser = async (username, password) => {
    
    try {
        let searchCriteria = {username: username};
        let userDocument = await mongoDAL.getOneDocumentByFilter('website', 'users', searchCriteria);
        
        if(!userDocument){
            return false;
        }
        
        return password === userDocument.password;

    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    }  
}

module.exports = {validateUser};