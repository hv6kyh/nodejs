var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = (req, res) => {

    db.query(`SELECT * FROM topic`, (error,topics) => {
      if (error) throw error;

        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        res.send(html);
    });
}

exports.page = (req, res) => {

  var selected_id = req.params.id;
  db.query(`SELECT * FROM topic`, (error,topics) => {
      if(error) throw error;
      db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[selected_id], (error2, topic) => {
        if(error2) throw error2;

        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(title, list,
         `
         <h2>${sanitizeHtml(title)}</h2>
         ${sanitizeHtml(description)}
         <p>by ${sanitizeHtml(topic[0].name)}</p>
         `,
         ` <a href="/create">create</a>
             <a href="/update/${selected_id}">update</a>
             <form action="/delete_process?_method=DELETE" method="post">
               <input type="hidden" name="id" value="${selected_id}">
               <input type="submit" value="delete">
             </form>`
       ); 
       res.send(html);
      })
   });
}

exports.create = (req, res) => {

    db.query(`SELECT * FROM topic`, (error,topics) => {
      if (error) throw error;

        db.query('SELECT * FROM author', (error2, authors) => {
          if (error2) throw error2;

          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(sanitizeHtml(title), list,
            `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a>`
          );
          res.send(html);
        });
      });
}

exports.create_process = (req, res) => {

  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  db.query(`
    INSERT INTO topic (title, description, created, author_id) 
      VALUES(?, ?, NOW(), ?)`,
    [title, description, author], 
    (error, result) => {
      if(error) throw error;
      res.redirect(`/id=${result.insertId}`);
    }
  )
}

exports.update = (req, res) => {

    var selected_id = req.params.id;
    // 글 목록 가져오기
    db.query('SELECT * FROM topic', (error, topics) => {
        if(error) throw error;
        // 지정한 id의 글 내용 가져오기
        db.query(`SELECT * FROM topic WHERE id=?`,[selected_id], (error2, topic) => {
          if(error2) throw error2;
          // 저자 가져오기
          db.query('SELECT * FROM author', (error3, authors) => {
            if (error3) throw error3;

            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(topic[0].title), list,
              `
              <form action="/update_process?_method=PUT" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                <p>
                  <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a>`
            );
            res.send(html);
          });
        });
      });
}

exports.update_process = (req, res) => {

    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var selected_id = req.body.id;

    db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [title, description, author, selected_id], (error, result) => {
      if (error) throw error;
      res.redirect(`/id=${selected_id}`);
    });
}

exports.delete_process = (req, res) => {

    var delete_id = req.body.id;

      db.query('DELETE FROM topic WHERE id = ?', [delete_id], (error, result) => {
        if(error) throw error;
        res.redirect(`/`);
      });
}