import mongoose from "mongoose";

const Post = new mongoose.Schema({
  comments: {
    type: Number,
    required: true,
  },
  posterProfileImg: {
    type: String,
  },
  posterName: {
    type: String,
    required: true,
  },
  posterProfileId: {
    type: String,
    required: true,
  },
  reactions: {
    type: Object,
    required: true,
  },
  postType: {
    type: String,
    required: [true, "Please Fill Post Type"],
  },
  postHeader: {
    type: String,
    required: [true, "Please Fill Post Header"],
  },
  postParagraph: {
    type: String,
    required: [true, "Please Fill Post Paragraph"],
  },
  tags: {
    type: Array,
    required: [true, "Please Provide Tags"],
  },
  postImg: {
    type: String,
  },
  imgFileName: {
    type: String,
  },
  created: { type: Date, default: Date.now },
});

Post.pre("save", function (next) {
  if (!this.created) this.created = new Date();
  next();
});

const PostDB = mongoose.model("post", Post);

export default PostDB;
