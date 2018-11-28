const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Models
const User = require("../models/users");

exports.get_all_users = (req, res) => {
  User.find({})
    .exec()
    .then(all_users => {
      const response = {
        number_of_users: all_users.length,
        users: all_users.map(user => {
          return {
            _id: user._id,
            name: {
              first_name: user.name.first_name,
              last_name: user.name.last_name
            },
            email: user.email,
            password: user.password,
            request: {
              method: "GET",
              url_for_user: `http://localhost:8080/users/${user._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch();
};

exports.user_signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user_array => {
      if (user_array.length > 0) {
        return res.status(500).json({
          success: false,
          message: "User already exists"
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const newuser = new User({
            _id: new mongoose.Types.ObjectId(),
            name: {
              first_name: req.body.name.first_name,
              last_name: req.body.name.last_name
            },
            email: req.body.email,
            password: hash
          });

          newuser.save((err, user) => {
            if (err) {
              res.status(500).json({
                error: err,
                e2: 46
              });
            }
            res.status(200).json({
              success: true,
              message: "User created",
              newUser: user,
              request: {
                method: "POST",
                url: "https://localhost:8080/signup/",
                description: "Endpoint that creates a user in the database"
              }
            });
          });
        }
      });
    });
};

exports.get_user_by_id = (req, res) => {
  const user_id = req.params.userId;
  User.findById(user_id)
    .exec()
    .then(user => {
      if (user) {
        res.status(200).json({
          user: user,
          request: {
            method: "GET",
            url: `http://localhost:8080/users/${user_id}`,
            description: "Gets a user by their unique user Id"
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `No user found with ${user_id} as an ID`
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        error: err
      });
    });
};
