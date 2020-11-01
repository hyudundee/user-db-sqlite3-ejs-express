const { connect } = require('../routes/users')

const sqlite3 = require('sqlite3').verbose()
const util = require('util')

const myDB = () => {

    const DB = {}
    const getDB = () => new sqlite3.Database('./newsFeed2.db');

    myDB.getUsers = (page) => {
        const db = getDB()
        let page_size = 10
        let sql = `select userID, name, email, createDate from User
                   order by userID
                   limit ${page_size} OFFSET ${page_size * (page - 1)}
                   `
        let ret;
        db.all(sql, [], (err, rows) => {  
            if (err) {
                throw err
            }
            console.log(res)
            ret = rows
        })
        db.close()
        return ret
    }

    myDB.createUser = (user) => {
        const db = getDB()
        const { name, email, createDate } = user;

        let sql = `insert into User(name, email, createDate)
                   values(?, ?, ?)`
        db.run(sql, [name, email, createDate], (err) => {
            if (err) {
                return console.error(err.message)
            }
        })

        let res = `A user has been added with userID ${this.lastID}`
        console.log(res)
        db.close();
        return res
    }

    myDB.updateUser = (user) => {
        const db = getDB()
        const { userID, name, email, createDate } = user;
        let data = [name, email, createDate, userID]
        let sql = `update User
                   set
                   name = ?,
                   email = ?,
                   createDate = ?
                   where userID = ?`
        db.run(sql, data, (err) => {
            if (err) {
                return console.error(err.message)
            }
        })
        let res = `Row(s) updated: ${this.changes}`
        console.log(res)
        db.close()
        return res
    }

    myDB.deleteUser = (userID) => {
        const db = getDB();
        let sql = `delete from User where userID = ?`
        db.run(sql, userID, (err) => {
            console.log(`Row(s) deleted ${this.changes}`)
        })
        db.close();
        return 'User deleted!'
    }
    return DB
}

module.exports = myDB()


// test script
// myDB()
// let r = myDB.getUsers(10)
// console.log(typeof(r))
// myDB.createUser({name: 'Peter', email: 'Peter@gmail.com', crateDate: '2022-12-31'})
// myDB.updateUser({userID: 1002, name: 'Bob', email: 'Peter@gmail.com', crateDate: '2022-12-31'})
// module.exports = myDB;
// myDB.deleteUser(1002)

// test scripts
// let sql = `SELECT * FROM User WHERE userID < ? LIMIT 20;`
// let userID = 4;

// db.all(sql, [userID], (err, rows) => {
//     if (err) {
//         console.log(err.message);
//     }
//     rows.forEach((row) => {
//         console.log(row);
//     });
// });
