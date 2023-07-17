import Comment from '../models/comment.js';
import Like from '../models/like.js';
import Post from '../models/post.js';
import User from '../models/user.js';

Post.belongsTo(User);
User.hasMany(Post);
Post.belongsToMany(User, { through: Like });
User.belongsToMany(Post, { through: Like });
Comment.belongsTo(Post);
Comment.belongsTo(User);
Post.hasMany(Comment);
