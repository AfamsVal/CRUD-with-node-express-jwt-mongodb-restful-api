const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middleware");

const router = express.Router();
const User = require("../Models/User");

//ROUTE WITH REGISTER
//ACCESS: Public
//URL: localhost:5000/auth/register
router.post("/register", (req, res) => {
  const { name, age, email, gender, password, password2 } = req.body;

  if (name.toString().trim() === "")
    return res.json({ msg: "name is required" });

  if (age.toString().trim() === "") return res.json({ msg: "age is required" });

  if (email.toString().trim() === "")
    return res.json({ msg: "email is required" });

  if (gender.toString().trim() === "")
    return res.json({ msg: "gender is required" });

  if (password.toString().trim() === "")
    return res.json({ msg: "password is required" });

  if (password2.toString().trim() === "")
    return res.json({ msg: "confirm password is required" });

  if (password.toString().trim() !== password2.toString().trim())
    return res.json({ msg: "Password does not match" });

  const newUser = new User({
    name,
    age,
    email,
    gender,
    password,
  });

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    newUser.password = hash;
    newUser
      .save()
      .then((user) => {
        jwt.sign(
          { id: user._id, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              id: user._id,
              name: user.name,
              age: user.age,
              email: user.email,
              gender: user.gender,
            });
          }
        );
      })
      .catch((err) => res.status(400).json({ error: err }));
  });
});

//ROUTE WITH LOGIN
//ACCESS: Public
//URL: localhost:5000/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email.toString().trim() === "")
    return res.json({ msg: "email is required" });

  if (password.toString().trim() === "")
    return res.json({ msg: "password is required" });

  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password).then((ismatched) => {
        if (!ismatched) res.json({ msg: "Invalid user details" });
        jwt.sign(
          { id: user._id, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (!token) throw err;
            res.json({
              token,
              id: user._id,
              name: user.name,
              email: user.email,
            });
          }
        );
      });
    })
    .catch((err) => res.status(400).json({ msg: "User does not exist" }));
});

//GET USER WITH TOKEN
//ACCESS: Protected
//URL: localhost:5000/auth/user
router.get("/user", authMiddleware, (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .select("-password -__v")
    .then((users) => res.json(users))
    .catch((err) => res.json({ error: "authentication failed" }));
});

module.exports = router;
