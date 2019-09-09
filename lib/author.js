var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = (req, res) => {

    db.query(`SELECT * FROM topic`, (error,topics) => {
        if (error) throw error;

        db.query(`SELECT * FROM author`, (error2,authors) => {
            if (error2) throw error2;

            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit"  value="create">
                </p>
            </form>
            `,
            ``
            );
            res.send(html);
        });
    });
}

exports.create_process = (req, res) => {

    var name = req.body.name;
    var profile = req.body.profile;

    db.query(`
    INSERT INTO author (name, profile) 
      VALUES(?, ?)`,
    [name, profile], 
    (error, result) => {
      if(error){
        throw error;
      }
      res.redirect( `/author`);
    }
  )
}

exports.update = (req, res) => {
    db.query(`SELECT * FROM topic`, (error,topics) => {
        if (error) throw error;

        db.query(`SELECT * FROM author`, (error2,authors) => {
            if (error2) throw error2;

            var author_id = req.params.id;

            db.query(`SELECT * FROM author WHERE id=?`,[author_id], (error3,author) => {
                if (error3) throw error3;

                var title = 'author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/update_process?_method=PUT" method="post">
                    <p>
                        <input type="hidden" name="id" value="${author_id}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `,
                ``
                );
                res.send(html);
            });
        });
    });
}

exports.update_process = (req, res) => {

    var name = req.body.name;
    var profile = req.body.profile;
    var author_id = req.body.id;

    db.query(`
        UPDATE author SET name=?, profile=? WHERE id=?`,
        [name, profile, author_id], 
        (error, result) => {
        if(error){
            throw error;
        }
        res.redirect(`/author`);
        }
    );
}

exports.delete_process = (req, res) => {

    var author_id = req.body.id;

      db.query(
        `DELETE FROM author WHERE id=?`,
        [author_id], 
        (error, result) => {
            if(error){
                throw error;
            }
            res.redirect(`/author`);
        }
    );
}