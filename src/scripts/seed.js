require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const sampleBlogs = [
  {
    title: "Getting Started with Camera AI Technology",
    content: "Camera AI technology is revolutionizing how we process and understand visual data. From security systems to autonomous vehicles, this technology combines advanced machine learning algorithms with real-time image processing to create intelligent systems that can see and understand the world around them. In this comprehensive guide, we'll explore the fundamentals of camera AI, its applications, and how to get started with implementing these powerful technologies in your projects.",
    author: "Tech Team",
    tags: ["ai", "computer-vision", "introduction", "technology"],
    published: true,
    featured: true
  },
  {
    title: "Understanding Object Detection Algorithms",
    content: "Object detection is a fundamental task in computer vision that involves identifying and locating objects within images or video streams. Modern object detection algorithms like YOLO (You Only Look Once) and R-CNN (Region-based CNN) have achieved remarkable accuracy and speed. These algorithms work by analyzing image features and using neural networks to classify and locate objects with bounding boxes. In this article, we'll dive deep into how these algorithms work, their strengths and weaknesses, and practical implementation considerations.",
    author: "AI Research Team",
    tags: ["object-detection", "yolo", "machine-learning", "algorithms"],
    published: true,
    featured: false
  },
  {
    title: "Real-time Video Processing Techniques",
    content: "Processing video in real-time presents unique challenges that require optimized algorithms and efficient hardware utilization. This comprehensive guide covers key techniques for real-time video processing including frame buffering, parallel processing, and GPU acceleration. We'll also discuss trade-offs between processing speed and accuracy, and when to use different optimization strategies. Learn how to build systems that can handle high-resolution video streams while maintaining low latency and high throughput.",
    author: "Engineering Team",
    tags: ["video-processing", "real-time", "optimization", "performance"],
    published: true,
    featured: false
  },
  {
    title: "Machine Learning Models for Image Classification",
    content: "Image classification is one of the most common applications of machine learning in computer vision. This article explores various neural network architectures including CNNs, ResNet, and Vision Transformers. We'll cover data preprocessing, model training, and deployment strategies. Whether you're working on medical imaging, autonomous vehicles, or general image recognition, understanding these fundamental concepts is crucial for building effective AI systems.",
    author: "Data Science Team",
    tags: ["machine-learning", "image-classification", "neural-networks", "cnn"],
    published: false,
    featured: false
  },
  {
    title: "Edge AI: Bringing Intelligence to the Edge",
    content: "Edge AI represents a paradigm shift in how we deploy artificial intelligence, bringing computation closer to data sources. This approach reduces latency, improves privacy, and enables real-time decision making in resource-constrained environments. Learn about edge computing hardware, model optimization techniques like quantization and pruning, and best practices for deploying AI models on edge devices.",
    author: "IoT Team",
    tags: ["edge-ai", "iot", "optimization", "deployment"],
    published: true,
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📡 Connected to MongoDB');

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing blog posts');

    // Insert sample blogs
    const createdBlogs = await Blog.insertMany(sampleBlogs);
    console.log(`✅ Created ${createdBlogs.length} sample blog posts`);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
