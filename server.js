const express = require('express')
const app = express()
const db = require('./db/db')
const md5 = require('md5')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('hi')
})

// define routes
// app.use('/users', require('./routes/users'))

app.get('/users', (req, res) => {
  let sql = 'select * from user'
  let params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      throw err
    }
    res.render('users/users', { users: rows })
  })
})

app.post('/', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }
  let sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  let params = [data.name, data.email, data.password]
  await db.run(sql, params, (err, rows) => {
    if (err) {
      console.log(err.message)
    }
    res.json({
      "message": "success",
      "data": data,
      "id": this.lastID
    })
  })
})

app.post('/update', async(req, res) => {

  const data = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null
  }

  await db.run(
    `UPDATE user set
      name = COALESCE(?,name), 
      email = COALESCE(?,email), 
      password = COALESCE(?,password) 
      WHERE id = ?`,
      [data.name, data.email, data.password, data.id],
      (err, rows) => {
        if (err) {
          console.log(err.message)
        }
        res.json({
          message: "success",
          data: data,
        })
      }
  )
})

app.post('/delete', async(req, res) => {
  const id = req.body.id
  console.log(id)
  let sql = 'DELETE FROM user WHERE id = ?'
  await db.run(sql, id, (err, rows) => {
    if (err) {
      console.log(err.message)
    }
    res.json({"message": "deleted", changes: rows})
  })

})

app.get('/specific', async(req, res) => {
  let sql = 'select * from user where id = ?'
  const params = [req.query.id]
  await db.get(sql, params, (err, row) => {
    if (err) {
      console.log(err.message)
    }
    res.json({
      "message": "success",
      "data": row
    })
  })
})

app.get('/users/new', (req, res) => {
  res.render('users/newuser')
})
// set other undefined routes to 404
app.use((req, res) => {
    res.status(404);
})


app.set('view engine', 'ejs')

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => { console.log('Server running on port 2000')})