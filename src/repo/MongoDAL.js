const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://wmad:Wmad1234@cluster0.dzcsz7y.mongodb.net';
const ObjectId = require('mongodb').ObjectId;

const getDocuments = async (database, collection, sort = {}) => {
    const client = new MongoClient(uri);
    const documents = [];
    
    try {
        const db = client.db(database);
        const coll = db.collection(collection);

        const documentPromises = await coll.find({}).sort(sort);

        await documentPromises.forEach((document) => {            
            documents.push(document);
        });        

        
    } catch (error) {
        throw {status: 500, message: error?.message || error}
        
    } finally {
        if(!!client)
            client.close();
    }

    return documents;
}

/**
 * Returns one document from the specified database and collection matching the given id. Throws an error if no document found
 * @param {string} database Database Name
 * @param {string} collection Collection Name
 * @param {string} id Unique ID of the document
 * @returns {object} Document Object
 */
const getOneDocumentById = async (database, collection, id) => {
    const client = new MongoClient(uri);

    try {
        const db = client.db(database);
        const coll = db.collection(collection);
        let objectId;

        try {
            objectId = ObjectId(id);
        } catch (error) {
            throw{status: 400, message: "Not a valid document ID"};
        }

        let document = await coll.findOne({
            _id: ObjectId(id)
        });

        if(!document){
            throw {status: 400, message: `No Project with id ${id} was found`};
        }        

        return document;
        
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error}
        
    } finally {
        if(!!client)
            client.close();
    }    
}

/**
 * Returns one document from the specified database and collection matching the given id. Throws an error if no document found
 * @param {string} database Database Name
 * @param {string} collection Collection Name
 * @param {object} filter object containing key:value pairs to filter against
 * @returns {object} Document Object
 */
 const getOneDocumentByFilter = async (database, collection, filter) => {
    const client = new MongoClient(uri);

    try {
        const db = client.db(database);
        const coll = db.collection(collection);
        
        let document = await coll.findOne(filter);
        

        if(!document){
            throw {status: 400, message: `No Project with id ${id} was found`};
        }         
        

        return document;
        
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error}
        
    } finally {
        if(!!client)
            client.close();
    }    
}

const updateOneDocument = async (database, collection, id, changes) => {
    const client = new MongoClient(uri);
    
    try {
        const db = client.db(database);
        const coll = db.collection(collection);
        let objectId;

        try {
            objectId = ObjectId(id);
        } catch (error) {
            throw{status: 400, message: "Not a valid document ID"};
        }

        let filter = {
            _id: ObjectId(id)
        };

        const result = await coll.findOneAndReplace(filter, changes, {returnDocument: 'after'});

        if(!result){
            throw {status: 500, message: `No Project found with the id ${id}`};
        };

        result.value.id = result.value._id;
        
        return result.value;
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    } finally {
        if(!!client){
            client.close();
        }
    }
}



module.exports = {
    getDocuments,
    getOneDocument: getOneDocumentById,
    getOneDocumentByFilter,
    updateOneDocument
}