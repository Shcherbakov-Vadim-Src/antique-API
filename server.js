const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

let fileNamePhoto = '';

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {

        // console.log(file);
        fileNamePhoto = file.originalname;
        cb(null, file.originalname)
    }
})

let upload = multer({ storage: storage })

const Good = require('./Good');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/public'));


mongoose.connect('mongodb+srv://Vados:12345@cluster0.jt9sp.mongodb.net/antique?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
})

db.once('open', () => {
    console.log('Connection to db !!!');
});

// category: jewelry, accessories, icons, ancient values, household utensils



app.get('/api/goods', (req, res) => {                 // годно
    Good.find().then((good) => {
        console.log(good);
        res.json(good);
    })
});


app.get('/api/goods/:id', (req, res) => {         // годно
    // const id = req.params.id;
    // console.log('------>', req.params.id);
    Good.find({ _id: req.params.id }).then((data) => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send();
        }
    })
})


// app.put('/api/goods/:id', (req, res) => {                 // годно
//     console.log(req.body);
//     Good.updateOne({ _id: req.params.id }, req.body)
//         .then(() => {
//             res.status(204).send();
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })

app.put('/api/goods/:id', upload.single('avatar'), (req, res) => {                 // годно
    
    console.log('------->req.body', req.body);

    const newGood = {
        category: req.body.category,
        title: req.body.title,
        price: req.body.price,
        about: req.body.about,
        photo: `http://localhost:3025/uploads/${fileNamePhoto}`,
        dateOfPlacement: req.body.date,
        dateOfSale: ''
    };

    console.log('------->newGood', newGood);

    Good.updateOne({ _id: req.params.id }, newGood)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            console.log(err);
        })
})


const tokens = [
    {
        // login: "admin",
        // password: "12345"
    }
];

app.post('/token', (req, res) => {                                    // создание токена
    const { login, password } = req.body;
    if (login === 'admin' && password === '12345') {
        const newToken = uuidv4();
        // console.log(newToken);
        tokens.push({ login: login, token: newToken });
        res.json({ login: login, token: newToken });
    } else {
        res.status(400).json({ err: 'Can not find user' })
    }
})

app.post('/addgoods', upload.single('avatar'), (req, res) => {

    const newGood = {
        category: req.body.category,
        title: req.body.title,
        price: req.body.price,
        about: req.body.about,
        photo: `http://localhost:3025/uploads/${fileNamePhoto}`,
        dateOfPlacement: req.body.date,
        dateOfSale: ''
    };

    const good = new Good(newGood);
    good.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        console.log('Success');
        res.status(201).send();
    });

})


app.post('/api/goods', (req, res) => {                                   // годно c использованием токена
    const { token } = req.body;

    // console.log(token);
    const isLoginValid = tokens.find((t) => t.token === token);
    console.log(token);
    if (isLoginValid) {
        const good = new Good(req.body);
        good.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            console.log('Success');
            res.status(201).send();
        });
    } else {
        res.status(401).json({ error: 'The user does not exist' });
    }
});

app.delete('/api/goods/:id', (req, res) => {                                        // с delete использованием токена

    const { login, token } = req.body;
    const isLoginValid = tokens.find((t) => t.token === token);
    if (isLoginValid) {

        Good.deleteOne({ _id: req.params.id })
            .then(() => {
                res.status(204).send();
            })
            .catch((err) => {
                console.log(err);
            })
    }
});


app.listen(3025, () => {
    console.log('server on 3025 port is connected');
})
