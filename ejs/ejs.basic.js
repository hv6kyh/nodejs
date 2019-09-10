const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const app = http.createServer((req, res) => {

    fs.readFile('ejsPage.ejs', 'utf8', (error, data) => {
        if (error) throw error;
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(ejs.render(data, {
            title: 'Square',
            description: 'this is ejs templete'
        }));
        // res.end(data);
        // console.log(data);
        
    });

});

app.listen(3000);