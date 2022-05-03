const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("", (request, response, next) => {
  Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogsRouter.post("", middleware.userExtractor, (request, response, next) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const blog = new Blog({ ...body, user: user._id });

  blog
    .save()
    .then((result) => {
      request.user.blogs = request.user.blogs.concat(result._id);
      request.user.save().then(() => {
        response.status(201).json(result);
      });
    })
    .catch((error) => next(error));
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  (request, response, next) => {
    const blogExist = request.user.blogs.filter(
      (value) => value.toString() === request.params.id
    );
    if (!blogExist.length) {
      return response
        .status(401)
        .json({ error: "this blog does not exist for this user" });
    } else {
      Blog.findByIdAndRemove(request.params.id)
        .then(() => {
          request.user.blogs = request.user.blogs.filter(
            (value) => value.toString() !== request.params.id
          );
          request.user.save().then(() => {
            response.status(201).json({
              response: "OK",
            });
          });
        })
        .catch((error) => next(error));
    }
  }
);

module.exports = blogsRouter;
