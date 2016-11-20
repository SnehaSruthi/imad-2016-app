var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'snehasruthi',
    database: 'snehasruthi',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one': {
    title: 'Article One | V Prasad',
    heading: 'Article One',
    date: 'Sep 5, 2016',
    content: `
        <p>
            This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>
        <p>
            This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>
        <p>
            This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>`
    
},
    'article-two': { 
    title: 'Article Two | V Prasad',
    heading: 'Article Two',
    date: 'Sep 10, 2016',
    content: `
        <p>
            This is the content for my second article.
        </p>`
},
    'article-three': {
     title: 'Article Three | V Prasad',
    heading: 'Article Three',
    date: 'Sep 15, 2016',
    content: `
        <p>
            This is the content for my third article.
        </p>`
}
};
function createTemplate (data) {
    var title = data.title;
    var date =  data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
        <title>
          ${title}  
        </title>
      <meta name="viewport" content="width=device-width, initial-scale=1" /> 
            <style>
                .container{
                    max-width: 800px;
                    margin: 0 auto;
                    color: #404040;
                    font-family: sans-serif;
                    padding-top: 60px;
                    padding-left: 20px;
                    padding-right: 20px;
        }  
            </style>
         </head>  
        <body>
      <div class="container">
          <div>
              <a href="/">Home</a>
          </div>
          <hr/>
          <h3>
              ${heading}
          </h3>
          <div>
              ${date}
          </div>
          <div>
              ${content}
          </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res){
    //make a select request
    //return a response with the results
    pool.query('SELECT * FROM test', function (err, result){
       if (err){
           res.status(500).send(err.toString());
       } else{
           res.send(JSON.stringify(result.rows));
       }
    });
});


var counter = 0;
app.get('/counter', function (req, res) {
   counter = counter + 1;
   res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) { // URL: /submit-name?name=xxxxx
    // Get the name from the rquest object
    var name = req.query.name;
    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names)); 
});

app.get('/:articleName', function (req, res){
    // articleName == article-one
    // article[articleName] == {} content object for article one
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
