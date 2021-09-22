require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true}).
then( () => {
    console.log('connected seccessfully')
}).catch(() => {
  console.log('something went wrong');
})

const userSchema = new mongoose.Schema ({
  email : String,
  password : String
})


const User = mongoose.model("User", userSchema);


app.route("/")
    .get((req, res) => {
        res.render("home")
    })

app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email:username}, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, (err, result) => {
                        if (result === true) {
                            res.render("secrets")
                        }
                    })
                }
            }
        })
    })
    
app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            const newUser = User({
                email : req.body.username,
                password : hash
            })
            newUser.save();
            res.render("secrets")
        })
        })


app.listen(3000, () => {
    console.log("server is running on port 3000.");
})

