const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'bookmarks.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/public')));

// Initialize data store
let bookmarks = [];

// Load bookmarks from file on startup
function loadBookmarks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      bookmarks = JSON.parse(data);
      console.log(`Loaded ${bookmarks.length} bookmarks from file`);
    } else {
      console.log('No existing bookmark file found, starting with empty store');
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    bookmarks = [];
  }
}

// Save bookmarks to file
function saveBookmarks() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Validate URL format
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// Fetch page title from URL (bonus feature)
async function fetchPageTitle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    return $('title').text().trim() || null;
  } catch (error) {
    console.log('Could not fetch page title:', error.message);
    return null;
  }
}

// Validation middleware
const bookmarkValidation = [
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .custom(value => {
      if (!isValidUrl(value)) {
        throw new Error('Invalid URL format');
      }
      return true;
    }),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or less'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom(value => {
      if (value && value.length > 5) {
        throw new Error('Maximum 5 tags allowed');
      }
      if (value && value.some(tag => typeof tag !== 'string' || tag !== tag.toLowerCase())) {
        throw new Error('Tags must be lowercase strings');
      }
      return true;
    })
];

// Routes

// GET /bookmarks - Return all bookmarks with optional tag filtering
app.get('/bookmarks', (req, res) => {
  try {
    let filteredBookmarks = bookmarks;

    // Filter by tag if provided
    const tagFilter = req.query.tag;
    if (tagFilter) {
      filteredBookmarks = bookmarks.filter(bookmark => 
        bookmark.tags && bookmark.tags.includes(tagFilter.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredBookmarks,
      count: filteredBookmarks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /bookmarks - Create a new bookmark
app.post('/bookmarks', bookmarkValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    let { url, title, description = '', tags = [] } = req.body;

    // Normalize tags to lowercase
    tags = tags.map(tag => tag.toLowerCase());

    // Try to fetch page title if not provided (bonus feature)
    if (!title || title.trim() === '') {
      const fetchedTitle = await fetchPageTitle(url);
      if (fetchedTitle) {
        title = fetchedTitle;
      }
    }

    const newBookmark = {
      id: generateId(),
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      createdAt: new Date().toISOString()
    };

    bookmarks.unshift(newBookmark); // Add to beginning for newest first
    saveBookmarks();

    res.status(201).json({
      success: true,
      data: newBookmark,
      message: 'Bookmark created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /bookmarks/:id - Update an existing bookmark
app.put('/bookmarks/:id', bookmarkValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const bookmarkId = req.params.id;
    const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmarkId);

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    let { url, title, description = '', tags = [] } = req.body;

    // Normalize tags to lowercase
    tags = tags.map(tag => tag.toLowerCase());

    // Update bookmark
    const updatedBookmark = {
      ...bookmarks[bookmarkIndex],
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      tags: tags
    };

    bookmarks[bookmarkIndex] = updatedBookmark;
    saveBookmarks();

    res.json({
      success: true,
      data: updatedBookmark,
      message: 'Bookmark updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /bookmarks/:id - Delete a bookmark
app.delete('/bookmarks/:id', (req, res) => {
  try {
    const bookmarkId = req.params.id;
    const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmarkId);

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    const deletedBookmark = bookmarks.splice(bookmarkIndex, 1)[0];
    saveBookmarks();

    res.json({
      success: true,
      data: deletedBookmark,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Bookmark Manager API is running' });
});

// Start server
function startServer() {
  loadBookmarks();
  
  app.listen(PORT, () => {
    console.log(`Bookmark Manager API server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at:`);
    console.log(`  GET    http://localhost:${PORT}/bookmarks`);
    console.log(`  POST   http://localhost:${PORT}/bookmarks`);
    console.log(`  PUT    http://localhost:${PORT}/bookmarks/:id`);
    console.log(`  DELETE http://localhost:${PORT}/bookmarks/:id`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, loadBookmarks, saveBookmarks };