const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("", (request, response, next) => {
  User.find({})
    .populate("blogs", { url: 1, title: 1, author: 1, id: 1 })
    .then((users) => {
      response.json(users);
    })
    .catch((error) => next(error));
});

usersRouter.post("", (request, response, next) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (body.password && body.password.length <= 3) {
    return response.status(400).json({
      error: "password should be greater then 3 letters",
    });
  }

  const { username, name, password } = body;

  User.findOne({ username }).then((existingUser) => {
    if (existingUser) {
      return response.status(400).json({
        error: "username must be unique",
      });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then((passwordHash) => {
      const user = new User({
        username,
        name,
        password: passwordHash,
      });

      user
        .save()
        .then((savedUser) => {
          response.status(201).json(savedUser);
        })
        .catch((error) => next(error));
    });
  });
});

module.exports = usersRouter;
