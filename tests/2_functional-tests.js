/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testBookId = undefined;
let testBookTitle = "The Great Gatsby";
let testBookComment = "This is a comment";

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server).post('/api/books').send({ title: testBookTitle }).end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response is an object");
          assert.property(res.body, "title", "Book should contain title");
          assert.property(res.body, "_id", "Book should contain _id");
          assert.equal(res.body.title, testBookTitle, "The title saved mathes the title sent");
          testBookId = res.body._id; //USED FOR OTHER TESTS
          done();
        });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server).post('/api/books').end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/notvalidid')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get(`/api/books/${testBookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body.title, testBookTitle, 'Book retrieved has the title of the book we posted in post test');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server).post(`/api/books/${testBookId}`).send({ comment: testBookComment }).end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response is an object");
          assert.property(res.body, "title", "Book should contain title");
          assert.property(res.body, "_id", "Book should contain _id");
          assert.property(res.body, "comments", "Book should contain comments");
          assert.deepEqual(res.body.comments, [testBookComment], "The comment was saved");
          assert.equal(res.body.commentcount, 1, "Commentcount was increased by 1");
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server).post(`/api/books/${testBookId}`).end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment");
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post(`/api/books/notvalidid`).send({ comment: testBookComment })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete(`/api/books/${testBookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete(`/api/books/notvalidid`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
