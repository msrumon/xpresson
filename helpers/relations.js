const Comment = require('../models/comment');
const Like = require('../models/like');
const Post = require('../models/post');
const User = require('../models/user');

Post.belongsTo(User);
User.hasMany(Post);
Post.belongsToMany(User, { through: Like });
User.belongsToMany(Post, { through: Like });
Comment.belongsTo(Post);
Comment.belongsTo(User);
Post.hasMany(Comment);
