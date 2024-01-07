const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.mongoURI);
const dbConnection = () => {
    return client.connect().then(connection => connection.db("library"));
}

module.exports = { dbConnection }