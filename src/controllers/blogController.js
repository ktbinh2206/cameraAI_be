const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    // Filter by published status
    if (req.query.published !== undefined) {
      query.published = req.query.published === 'true';
    }
    
    // Filter by author
    if (req.query.author) {
      query.author = new RegExp(req.query.author, 'i');
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }
    
    // Search in title and content
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'popular':
          sortOption = { views: -1 };
          break;
        case 'liked':
          sortOption = { likes: -1 };
          break;
        case 'title':
          sortOption = { title: 1 };
          break;
      }
    }
    
    const blogs = await Blog.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .maxTimeMS(20000); // 20 second timeout
    
    const total = await Blog.countDocuments(query).maxTimeMS(10000); // 10 second timeout
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        error: 'Service temporarily unavailable'
      });
    }
    
    if (error.name === 'MongoTimeoutError') {
      return res.status(408).json({
        success: false,
        message: 'Database operation timed out. Please try again.',
        error: 'Request timeout'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select('-__v');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// @desc    Get blog post by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).select('-__v');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Public
const createBlog = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this title already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Public
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this title already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Public
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully',
      data: blog
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

// @desc    Like/Unlike blog post
// @route   PATCH /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    blog.likes += 1;
    await blog.save();
    
    res.json({
      success: true,
      message: 'Blog post liked',
      data: { likes: blog.likes }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error liking blog post',
      error: error.message
    });
  }
};

// @desc    Get blog statistics
// @route   GET /api/blogs/stats
// @access  Public
const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const featuredBlogs = await Blog.countDocuments({ featured: true });
    
    const topViewedBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views slug');
      
    const topLikedBlogs = await Blog.find()
      .sort({ likes: -1 })
      .limit(5)
      .select('title likes slug');
    
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt slug');
    
    // Get tags statistics
    const tagsStats = await Blog.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        counts: {
          total: totalBlogs,
          published: publishedBlogs,
          featured: featuredBlogs
        },
        topViewed: topViewedBlogs,
        topLiked: topLikedBlogs,
        recent: recentBlogs,
        popularTags: tagsStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog statistics',
      error: error.message
    });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getBlogStats
};
