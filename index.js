const express = require('express');
require('dotenv').config('/.env');
const app = express();
const PORT = 3000;

const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


// register middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

//config view
app.set('view engine', 'ejs'); //Khai báo web sẽ dùng engine ejs để render
app.set('views', './views'); // Nội dung render nằm trong thư mục views

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const tableName = 'Subject';

const docClient = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
    const params = {
        TableName: tableName
    };

    docClient.scan(params, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            console.log(data.Items);
            res.render('index', { data: data.Items });
        }
    });
});

const multer = require('multer');
const upload = multer();

//write data
app.post('/add', upload.fields([]), (req, res) => {
    const { id, name, department, course_type, semester } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            id: Number.parseInt(id),
            name: name,
            department: department,
            course_type: course_type,
            semester: semester
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
});