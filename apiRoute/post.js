const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware");

const Post = require("../Models/Post");

//ROUTE FOR GETTING POSTS
//ACCESS: Public
//URL: localhost:5000/post
router.get("/", (req, res) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((err) => res.status(400).json({ error: err }));
});

//ROUTE FOR POST
//ACCESS: Private
//URL: localhost:5000/post
router.post("/", authMiddleware, (req, res) => {
  const { title, post } = req.body;

  if (title.toString().trim() === "")
    return res.json({ msg: "Title is required" });

  if (post.toString().trim() === "")
    return res.json({ msg: "Post is required" });

  const date = new Date().getTime();

  const newFeed = new Post({ title, post, date });
  newFeed
    .save()
    .then((news) => res.status(200).json(news))
    .catch((err) => res.status(400).json({ error: err }));
});

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((err) => res.status(400).json({ error: err }));
});

// router.patch("/", (req, res) => {
//   const { id, title, post } = req.body;
//   const date = new Date().getTime();
//   title = title.trim();
//   post = post.trim();
//   if (id === "") return res.json({ msg: "UserId is required" });

//   if (title === "") return res.json({ msg: "Title is required" });

//   if (post === "") return res.json({ msg: "Post is required" });

//   Post.findOne({ _id: id })
//     .then((oldPost) => {
//       if (!post) return res.json({ msg: "Error updating post" });
//       oldPost.title = title;
//       oldPost.post = post;
//       oldPost
//         .save()
//         .then((newPost) => res.json(newPost))
//         .catch((err) => res.json({ msg: "Error updating post" }));
//     })
//     .catch((err) => res.json({ msg: "No post found" }));
// });

//ROUTE FOR POST EDIT
//ACCESS: Private
//URL: localhost:5000/post
router.patch("/", authMiddleware, (req, res) => {
  let { id, title, post } = req.body;
  title = title.trim();
  post = post.trim();
  if (id === "") return res.json({ msg: "UserId is required" });

  if (title === "") return res.json({ msg: "Title is required" });

  if (post === "") return res.json({ msg: "Post is required" });

  Post.update({ _id: id }, { $set: { title, post } })
    .then((update) => {
      Post.findById(id)
        .select("-__v")
        .then((user) => res.json(user));
    })
    .catch((err) => res.json({ error: err }));
});

//ROUTE FOR POST DELETE
//ACCESS: Private
//URL: localhost:5000/post
router.delete("/", authMiddleware, (req, res) => {
  const id = req.body.id;
  Post.remove({ _id: id })
    .then((result) => res.json({ msg: "Post removed successfully" }))
    .catch((err) => res.json({ error: err }));
});

module.exports = router;
