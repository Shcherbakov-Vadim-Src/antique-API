const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { v4: uuidv4 } = require('uuid');

const Good = require('./Good');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://Vados:12345@cluster0.jt9sp.mongodb.net/antique?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
})

db.once('open', () => {
    console.log('Connection to db !!!');
});

// category: jewelry, accessories, icons, ancient values, household utensils

// app.get('/api/goods', (req, res) => {                // годно
//     res.send(goods);
// });

app.get('/api/goods', (req, res) => {                 // годно
    Good.find().then((good) => {
        console.log(good);
        res.json(good);
    })
});


app.get('/api/goods/:id', (req, res) => {         // годно
    // const id = req.params.id;
    // console.log('------>', req.params.id);
    Good.find({_id: req.params.id}).then((data) => {
        if (data){
            res.status(200).json(data);
        } else {
            res.status(404).send();
        }
    })
})

// app.post('/api/goods', (req, res) => {                  // годно
//     // console.log(req.body);
//     const good = new Good(req.body);
//     good.save((err) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send();
//         }
//         console.log('Success');
//         res.status(201).send();
//     }); 
// });

app.put('/api/goods/:id', (req, res) => {                 // годно
    Good.updateOne({ _id: req.params.id }, req.body)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        console.log(err);
    })
})

// app.delete('/api/goods/:id', (req, res) => {              // годно
    // Good.deleteOne({ _id: req.params.id })
    // .then(() => {
    //     res.status(204).send();
    // })
    // .catch((err) => {
    //     console.log(err);
    // })
// })


const tokens = [ 
    {
        // login: "admin",
        // password: "12345"
    }
];

app.post('/token', (req, res) => {                                    // создание токена
  const { login, password } = req.body;
  if (login === 'admin' && password === '12345'){
    const newToken = uuidv4();
    // console.log(newToken);
    tokens.push({ login: login, token: newToken });
    res.json({ login: login, token: newToken });
  } else {
    res.status(400).json({ err: 'Can not find user' })
  }
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
    // const { _id, token } = req.body;
    // const isTokenValid = tokens.find((t) => t.token === token);
    // if (isTokenValid) {
    //   Good = Good.filter(good => good._id === _id);                              // Good =
    //   res.send({ success: true });
    // } else {
    //   res.status(401).send({error: 'Not authorized' });
    // }
  });


app.listen(3025, () => {
    console.log('server on 3025 port is connected');
})

