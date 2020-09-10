const { validationResult, matchedData } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.index = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { page } = matchedData(req);
  const limit = 3;
  try {
    const posts = await Post.findAndCountAll({
      limit,
      offset: (page - 1 || 0) * limit,
      order: [['createdAt', 'DESC']],
      include: 'User',
    });
    const hasStarted = !page || page <= 1;
    const lastPageNumber = Math.ceil(posts.count / limit);
    const hasEnded = posts.count <= limit || page >= lastPageNumber;
    if (page && page > lastPageNumber) {
      req.flash('notification', { danger: 'Page number is invalid!' });
      return res.redirect('/posts');
    }
    return res.render('post/list', {
      isThisPosts: true,
      posts,
      page,
      hasStarted,
      hasEnded,
      notification: req.flash('notification')[0] || {},
    });
  } catch (error) {
    return next(error);
  }
};

exports.create = (req, res, next) => {
  return res.render('post/save', {
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
  });
};

exports.store = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    req.flash('inputs', req.body);
    return res.redirect('/posts/new');
  }
  const { title, content } = matchedData(req);
  try {
    await req.auth.createPost({ title, content });
    req.flash('notification', { success: 'Created successfully!' });
    return res.redirect('/profile');
  } catch (error) {
    return next(error);
  }
};

exports.show = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { id, page } = matchedData(req);
  const limit = 3;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    post.Likes = await post.countUsers();
    post.Comments = {
      count: await post.countComments(),
      rows: await post.getComments({
        limit,
        offset: (page - 1 || 0) * limit,
        order: [['createdAt', 'DESC']],
        include: 'User',
      }),
    };
    const hasStarted = !page || page <= 1;
    const lastPageNumber = Math.ceil(post.Comments.count / limit);
    const hasEnded = post.Comments.count <= limit || page >= lastPageNumber;
    if (page && page > lastPageNumber) {
      req.flash('notification', { danger: 'Page number is invalid!' });
      return res.redirect(`/posts/${post.id}`);
    }
    let isAuthLiked = false;
    if (req.session.user) {
      const user = await User.findByPk(req.session.user);
      if (await post.hasUsers([user.id])) {
        isAuthLiked = true;
      }
    }
    return res.render('post/single', {
      isThisPosts: true,
      post,
      isAuthLiked,
      page,
      hasStarted,
      hasEnded,
      errors: req.flash('errors')[0] || {},
      notification: req.flash('notification')[0] || {},
    });
  } catch (error) {
    return next(error);
  }
};

exports.edit = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { id } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    const author = await post.getUser();
    if (author.id !== req.auth.id) {
      req.flash('notification', { danger: 'You cannot update this post!' });
      return res.redirect(`/posts/${post.id}`);
    }
    return res.render('post/save', {
      post,
      errors: req.flash('errors')[0] || {},
      inputs: req.flash('inputs')[0] || {},
    });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    if ('id' in e) {
      req.flash('notification', { danger: e.id.msg });
      return res.redirect('/posts');
    }
    req.flash('errors', e);
    req.flash('inputs', req.body);
    return res.redirect(`/posts/${req.params.id}/update`);
  }
  const { id, title, content } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.redirect('/posts');
    }
    const author = await post.getUser();
    if (author.id !== req.auth.id) {
      req.flash('notification', { danger: 'You cannot update this post!' });
      return res.redirect(`/posts/${post.id}`);
    }
    post.title = title;
    post.content = content;
    await post.save();
    req.flash('notification', { success: 'Updated successfully!' });
    return res.redirect(`/posts/${post.id}`);
  } catch (error) {
    return next(error);
  }
};

exports.erase = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { id } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    const author = await post.getUser();
    if (author.id !== req.auth.id) {
      req.flash('notification', { danger: 'You cannot delete this post!' });
      return res.redirect(`/posts/${post.id}`);
    }
    return res.render('post/delete', { post });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { id } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    const author = await post.getUser();
    if (author.id !== req.auth.id) {
      req.flash('notification', { danger: 'You cannot delete this post!' });
      return res.redirect(`/posts/${post.id}`);
    }
    await post.destroy();
    req.flash('notification', { success: 'Deleted successfully!' });
    return res.redirect('/profile');
  } catch (error) {
    return next(error);
  }
};

exports.likes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [e] = errors.array();
    req.flash('notification', { danger: e.msg });
    return res.redirect('/posts');
  }
  const { id } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    if (await post.hasUsers([req.auth.id])) {
      await post.removeUsers([req.auth.id]);
      req.flash('notification', { success: 'You unliked this post!' });
    } else {
      await post.addUsers([req.auth.id]);
      req.flash('notification', { success: 'You liked this post!' });
    }
    return res.redirect(`/posts/${post.id}`);
  } catch (error) {
    return next(error);
  }
};

exports.comments = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    return res.redirect(`/posts/${req.params.id}`);
  }
  const { id, comment } = matchedData(req);
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      req.flash('notification', { danger: 'Post not found!' });
      return res.redirect('/posts');
    }
    const comm = await post.createComment({ text: comment });
    await comm.setUser(req.auth);
    req.flash('notification', { success: 'You commented on this post!' });
    return res.redirect(`/posts/${post.id}`);
  } catch (error) {
    return next(error);
  }
};
