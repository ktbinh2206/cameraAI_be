const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getBlogStats
} = require('../controllers/blogController');
const { validateCreateBlog, validateUpdateBlog } = require('../middleware/validation');

// @route   GET /api/blogs/stats
// @desc    Get blog statistics
// @access  Public
router.get('/stats', getBlogStats);

// @route   GET /api/blogs/slug/:slug
// @desc    Get blog by slug
// @access  Public
router.get('/slug/:slug', getBlogBySlug);

// @route   GET /api/blogs
// @desc    Get all blogs with filtering, sorting, and pagination
// @access  Public
router.get('/', getBlogs);

// @route   GET /api/blogs/:id
// @desc    Get single blog
// @access  Public
router.get('/:id', getBlog);

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Public
router.post('/', validateCreateBlog, createBlog);

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Public
router.put('/:id', validateUpdateBlog, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Public
router.delete('/:id', deleteBlog);

// @route   PATCH /api/blogs/:id/like
// @desc    Like blog post
// @access  Public
router.patch('/:id/like', likeBlog);

module.exports = router;
