const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://wmad:Wmad1234@cluster0.dzcsz7y.mongodb.net';
const ObjectId = require('mongodb').ObjectId;

const getDocuments = async (database, collection, sort = {}) => {
    const client = new MongoClient(uri);
    const documents = [];
    console.log("Attempting to contact Mongo with uri" + uri);

    /*
    Order/Sort
    value of 1 means "Ascending"
    value of -1 means descending or reverse order
    const sortOrder = {
      lastName: 1, // ascending order
      firstName: 1, // sort by first name AFTER last name
    };
    */

    try {
        const db = client.db(database);
        const coll = db.collection(collection);

        const documentPromises = await coll.find({}).sort(sort);

        await documentPromises.forEach((document) => {
            console.log(document);
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
const getOneDocument = async (database, collection, id) => {
    const client = new MongoClient(uri);
    
    console.log("Attempting to contact Mongo with uri" + uri);

    /*
    Order/Sort
    value of 1 means "Ascending"
    value of -1 means descending or reverse order
    const sortOrder = {
      lastName: 1, // ascending order
      firstName: 1, // sort by first name AFTER last name
    };
    */

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



module.exports = {
    getDocuments,
    getOneDocument
}