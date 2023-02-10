const express = require("express")
const exphbs = require("express-handlebars")
const mysql = require("mysql")

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

app.use(express.static("public"))

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"
})
// connection created, but not executed

app.get("/", (req, res) => {
    res.render("home")
})

app.post("/books/insertbook", (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const pages = req.body.pages

    const query = `INSERT INTO books (title, author, pages) VALUES ("${title}","${author}","${pages}")`

    conn.query(query, function(err) {
        if(err){
            console.log(err)
            return
        }
    })

    res.redirect("/")
})

app.get("/books", (req, res) => {
    const query = `SELECT * FROM books`

    conn.query(query, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const books = data

        res.render("books", { books })
    })
})

app.get("/books/:id", (req, res) => {
    const id = req.params.id
    
    const query = `SELECT * FROM books WHERE id = ${id}`

    conn.query(query, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render("book", { book })
    })
})

conn.connect(function(err) {
    if(err) {
        console.log(err)
    }
    console.log("Connected to MySQL")

    app.listen(3000)
})