const express = require('express')
const app = express()
const port = 3000
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(methodOverride('_method'));

// express에서 라우팅이란
// 사용자의 요청에 따라
// 적절한 페이지를 제공해주는 것(경로 지정)

// about topic
app.get('/', (req, res) => topic.home(req, res))
app.get('/id=:id', (req, res) => topic.page(req, res))
app.get('/create', (req, res) => topic.create(req, res))
app.get('/update/:id', (req, res) => topic.update(req, res))

app.post('/create_process', (req, res) => topic.create_process(req, res))
app.put('/update_process', (req, res) => topic.update_process(req, res))
app.delete('/delete_process', (req, res) => topic.delete_process(req, res))

// about author
app.get('/author', (req, res) => author.home(req, res))
app.get('/author/update/:id', (req, res) => author.update(req, res))

app.post('/author/create_process', (req, res) => author.create_process(req, res))
app.put('/author/update_process', (req, res) => author.update_process(req, res))
app.delete('/author/delete_process', (req, res) => author.delete_process(req, res))

app.all('*', (req, res) => res.status(404).send('<h1>Page Not Found</h1>'))

// app listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`))