const ObjectId = require('mongodb').ObjectId;
const { dbConnection } = require("./databaseConnection");

const openBooksCollection = () => {
    return dbConnection().then(db => db.collection("booksDb"));
};

const convertIdToObjectId = (id) => {
    if (typeof id === "string") {
        try {
            id = new ObjectId(id);
        } catch {
            id = id;
        }
    }
    return id;
};

const getBooks = () => {
    return openBooksCollection().then(booksCollection => booksCollection.find({}).toArray());
};

const getBookById = (id) => {
    id = convertIdToObjectId(id);
    return openBooksCollection().then(booksCollection => booksCollection.findOne({ _id: id }));
};

const updateBookById = (id, comment) => {
    id = convertIdToObjectId(id);
    return openBooksCollection().then(booksCollection => booksCollection.updateOne({ _id: id }, { $push: { "comments": comment }, $inc: { "commentcount": 1 } }))
};

const addBook = (bookTitle) => {
    return openBooksCollection().then(booksCollection => booksCollection.insertOne({ title: bookTitle, commentcount: 0, comments: [] }));
};

const deleteAllBooks = () => {
    return openBooksCollection().then(booksCollection => booksCollection.deleteMany({}));
};

const deleteBookId = (id) => {
    id = convertIdToObjectId(id);
    return openBooksCollection().then(booksCollection => booksCollection.deleteOne({ _id: id }));
};

module.exports = { addBook, getBooks, getBookById, deleteAllBooks, updateBookById, deleteBookId }