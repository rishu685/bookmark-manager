const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Netlify Functions for Bookmark Manager API
const DATA_FILE = '/tmp/bookmarks.json';

// Initialize with seed data if file doesn't exist
const seedData = [
  {
    "id": "seed1",
    "url": "https://github.com",
    "title": "GitHub: Where the world builds software",
    "description": "GitHub is where over 100 million developers shape the future of software, together.",
    "tags": ["development", "git", "coding"],
    "createdAt": "2026-02-14T10:00:00.000Z"
  },
  {
    "id": "seed2", 
    "url": "https://stackoverflow.com",
    "title": "Stack Overflow - Where Developers Learn, Share, & Build Careers",
    "description": "Stack Overflow is the largest, most trusted online community for developers to learn and share their programming knowledge.",
    "tags": ["development", "community", "programming"],
    "createdAt": "2026-02-14T11:00:00.000Z"
  },
  {
    "id": "seed3",
    "url": "https://developer.mozilla.org",
    "title": "MDN Web Docs",
    "description": "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    "tags": ["documentation", "web", "reference"],
    "createdAt": "2026-02-14T12:00:00.000Z"
  },
  {
    "id": "seed4",
    "url": "https://nodejs.org",
    "title": "Node.js",
    "description": "Node.js® is an open-source, cross-platform JavaScript runtime environment.",
    "tags": ["javascript", "runtime", "backend"],
    "createdAt": "2026-02-14T13:00:00.000Z"
  },
  {
    "id": "seed5",
    "url": "https://www.npmjs.com",
    "title": "npm | Build amazing things",
    "description": "We're npm, Inc., the company behind Node package manager, the world's largest software registry.",
    "tags": ["javascript", "packages", "tools"],
    "createdAt": "2026-02-14T14:00:00.000Z"
  },
  {
    "id": "seed6",
    "url": "https://expressjs.com",
    "title": "Express - Node.js web application framework",
    "description": "Fast, unopinionated, minimalist web framework for Node.js",
    "tags": ["javascript", "framework", "backend"],
    "createdAt": "2026-02-14T15:00:00.000Z"
  },
  {
    "id": "seed7",
    "url": "https://code.visualstudio.com",
    "title": "Visual Studio Code",
    "description": "Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop.",
    "tags": ["editor", "development", "tools"],
    "createdAt": "2026-02-14T16:00:00.000Z"
  }
];

// Helper functions
function loadBookmarks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } else {
      // Initialize with seed data
      saveBookmarks(seedData);
      return seedData;
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return seedData;
  }
}

function saveBookmarks(bookmarks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

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

function validateBookmark(data) {
  const errors = [];
  
  if (!data.url) {
    errors.push({ param: 'url', msg: 'URL is required' });
  } else if (!isValidUrl(data.url)) {
    errors.push({ param: 'url', msg: 'Invalid URL format' });
  }
  
  if (!data.title) {
    errors.push({ param: 'title', msg: 'Title is required' });
  } else if (data.title.length > 200) {
    errors.push({ param: 'title', msg: 'Title must be 200 characters or less' });
  }
  
  if (data.description && data.description.length > 500) {
    errors.push({ param: 'description', msg: 'Description must be 500 characters or less' });
  }
  
  if (data.tags && data.tags.length > 5) {
    errors.push({ param: 'tags', msg: 'Maximum 5 tags allowed' });
  }
  
  if (data.tags && data.tags.some(tag => typeof tag !== 'string' || tag !== tag.toLowerCase())) {
    errors.push({ param: 'tags', msg: 'Tags must be lowercase strings' });
  }
  
  return errors;
}

// Main Netlify Function handler
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, queryStringParameters, body } = event;
    const bookmarks = loadBookmarks();
    
    // Parse path to extract ID for individual bookmark operations
    const pathParts = path.split('/');
    const isIndividualBookmark = pathParts.length > 3;
    const bookmarkId = isIndividualBookmark ? pathParts[pathParts.length - 1] : null;

    switch (httpMethod) {
      case 'GET':
        if (path.includes('/health')) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Bookmark Manager API is running on Netlify'
            })
          };
        }
        
        let filteredBookmarks = bookmarks;
        
        // Filter by tag if provided
        if (queryStringParameters && queryStringParameters.tag) {
          const tagFilter = queryStringParameters.tag.toLowerCase();
          filteredBookmarks = bookmarks.filter(bookmark => 
            bookmark.tags && bookmark.tags.includes(tagFilter)
          );
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: filteredBookmarks,
            count: filteredBookmarks.length
          })
        };

      case 'POST':
        const createData = JSON.parse(body);
        const createErrors = validateBookmark(createData);
        
        if (createErrors.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Validation failed',
              details: createErrors
            })
          };
        }
        
        let { url, title, description = '', tags = [] } = createData;
        
        // Normalize tags to lowercase
        tags = tags.map(tag => tag.toLowerCase());
        
        // Try to fetch page title if not provided
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
        
        bookmarks.unshift(newBookmark);
        saveBookmarks(bookmarks);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: newBookmark,
            message: 'Bookmark created successfully'
          })
        };

      case 'PUT':
        if (!bookmarkId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Bookmark ID is required'
            })
          };
        }
        
        const updateData = JSON.parse(body);
        const updateErrors = validateBookmark(updateData);
        
        if (updateErrors.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Validation failed',
              details: updateErrors
            })
          };
        }
        
        const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmarkId);
        
        if (bookmarkIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Bookmark not found'
            })
          };
        }
        
        let updateUrl = updateData.url;
        let updateTitle = updateData.title;
        let updateDescription = updateData.description || '';
        let updateTags = updateData.tags || [];
        
        // Normalize tags to lowercase
        updateTags = updateTags.map(tag => tag.toLowerCase());
        
        const updatedBookmark = {
          ...bookmarks[bookmarkIndex],
          url: updateUrl.trim(),
          title: updateTitle.trim(),
          description: updateDescription.trim(),
          tags: updateTags
        };
        
        bookmarks[bookmarkIndex] = updatedBookmark;
        saveBookmarks(bookmarks);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: updatedBookmark,
            message: 'Bookmark updated successfully'
          })
        };

      case 'DELETE':
        if (!bookmarkId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Bookmark ID is required'
            })
          };
        }
        
        const deleteIndex = bookmarks.findIndex(b => b.id === bookmarkId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Bookmark not found'
            })
          };
        }
        
        const deletedBookmark = bookmarks.splice(deleteIndex, 1)[0];
        saveBookmarks(bookmarks);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: deletedBookmark,
            message: 'Bookmark deleted successfully'
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Method not allowed'
          })
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};