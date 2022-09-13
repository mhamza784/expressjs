
const jwt = require('jsonwebtoken');
const express = require("express");
require('../db/conn');
const router = express.Router();
const bcrypt = require("bcryptjs");


const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send('Hello World home page!')
});

// Async-Await method
router.post("/register", async (req, res) => {

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(422).json({ error: "Plz filled the field properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" })
        }
        const user = new User({ name, email, phone, password });

        await user.save();
        // const useRigester = await user.save();
        res.status(201).json({ message: "user registered successfuly" });
        // if (useRigester) {
        //     return res.status(201).json({ message: "user registered successfuly" });
        // } else {
        //     res.status(500).json({ error: "Faild Registered" });
        // }

    } catch (err) {
        console.log(err);

    }

});

// using promises
// router.post("/register",(req, res) => {

//     const { name, email, phone, password } = req.body;

//     if (!name || !email || !phone || !password) {
//         return res.status(422).json({ error: "Plz filled the field properly" });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email already Exist" })
//             }

//             const user = new User({ name, email, phone, password });

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered successfuly" });
//             }).catch((err) => res.status(500).json({ error: "Faild Registered" }));

//         }).catch(err => { console.log(err); });
// });


// Login Route
router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Plz fill the data' });
        }
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
             
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials" });
            } else {
                res.json({ message: "User Signin Successful" });
                token = await userLogin.generateAuthToken();
            console.log(token);
            }

        } else {
            res.status(400).json({ error: "Invalid Credientials" });
        }
        // console.log(userLogin);


    } catch (err) {
        console.log(err);
    }

});

module.exports = router;