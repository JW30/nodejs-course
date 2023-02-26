const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://user:pass1234@cluster0.7l5w0mp.mongodb.net/shop?retryWrites=true&w=majority")
        .then(client => {
            _db = client.db()
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;