var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '!5922fzqaZ159',
  database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * FROM topic WHERE id = 1', function (error, topic) {
  if (error) {
	console.log(error);
}
  // console.log(topic);

  console.log(topic[0].title);
  
  
  // topic.forEach(function(elements){
  // console.log(elements.title);
  // console.log(elements.description);  
  // });

});

connection.end();
