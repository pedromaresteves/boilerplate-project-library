'use strict';
const databaseActions = require("../databaseActions");

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      return databaseActions.getBooks().then(books => res.send(books));
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) return res.send("missing required field title");
      return databaseActions.addBook(title)
        .then(feedback => {
          return databaseActions.getBookById(feedback.insertedId)
        })
        .then(book => {
          const { comments, commentcount, ...rest } = book;
          res.send(rest);
        });
    })

    .delete(function (req, res) {
      return databaseActions.deleteAllBooks().then(feedback => {
        if (feedback.acknowledged) res.send("complete delete successful")
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      return databaseActions.getBookById(bookid).then(book => {
        if (!book || book.error) return res.send("no book exists");
        return res.send(book);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send("missing required field comment");
      return databaseActions.updateBookById(bookid, comment)
        .then((feedback) => {
          if (feedback.modifiedCount === 0) return { error: true };
          return databaseActions.getBookById(bookid);
        })
        .then(book => {
          if (book.error) return res.send("no book exists")
          return res.send(book)
        });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      return databaseActions.deleteBookId(bookid).then(feedback => {
        if (feedback.deletedCount === 0) return res.send("no book exists")
        return res.send("delete successful")
      });
    });

};
