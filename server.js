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
const Token = require('./Token');
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

app.get('/api/goods/archive', (req, res) => {                   // годно archive

    let checkMonth = [];
    let checkMonthSub = [];

    const { month } = req.query;

    Good.find().then((goods) => {

        if (month === 'январь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.01.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.02.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'февраль'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.02.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.03.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'март'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.03.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.04.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'апрель'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.04.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.05.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'май'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.05.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.06.01';
            });
            res.json(checkMonthSub);          
        } else if (month === 'июнь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.06.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.07.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'июль'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.07.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.08.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'август'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.08.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.09.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'сентябрь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.09.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.10.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'октябрь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.10.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.11.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'ноябрь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.11.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2021.12.01';
            });
            res.json(checkMonthSub);
        } else if (month === 'декабрь'){
            checkMonth = goods.filter((good) => {
                return good.dateOfSale > '2021.12.01';
            });
            checkMonthSub = checkMonth.filter((good) => {
                return good.dateOfSale < '2022.01.01';
            });
            res.json(checkMonthSub);
        }
        
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

app.put('/api/goods/:id', upload.single('avatar'), (req, res) => {                 // годно

    const newGood = {
        category: req.body.category,
        title: req.body.title,
        price: req.body.price,
        about: req.body.about,
        photo: `http://localhost:3025/uploads/${fileNamePhoto}`,
        dateOfPlacement: req.body.date,
        dateOfSale: ''
    };

    let check = Token.find({ token: req.body.token }).then((data) => {
        if (data.length !== 0) {
            Good.updateOne({ _id: req.params.id }, newGood)
                .then(() => {
                    res.status(204).send();
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            res.status(401).json({ err: 'Can not find user' })
        }
    });
})


const tokens = [

];



app.post('/token', (req, res) => {                                    // создание токена
    const { login, password } = req.body;

    if (login === 'admin' && password === '12345') {

        const newToken = uuidv4();

        const objKey = {
            login: login,
            token: newToken
        }

        const key = new Token(objKey);
        key.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            console.log('Success');
            res.status(201).send();
        });
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

    let check = Token.find({ token: req.body.token }).then((data) => {
        if (data.length !== 0) {
            const good = new Good(newGood);
            good.save((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send();
                }
                console.log('Success');
                res.status(201).send();
            });
        } else {
            res.status(401).json({ err: 'Can not find user' })
        }
    });

})


app.post('/api/goods', (req, res) => {

    const good = new Good(req.body);
    good.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        console.log('Success');
        res.status(201).send();
    });

});

app.delete('/api/goods/:id', (req, res) => {                                        // с delete использованием токена

    const { token } = req.query;

    let check = Token.find({ token: token }).then((data) => {

        if (data.length !== 0) {
            Good.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(204).send();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    });

});

app.delete('/logout', (req, res) => {                               // log out

    const { token } = req.query;

    console.log('---------token------------>', token);

    Token.deleteOne({ token: token })
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(401).json({ err: 'Can not find user' })
        })

});


app.listen(3025, () => {
    console.log('server on 3025 port is connected');
})
