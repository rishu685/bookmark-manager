# 📚 Bookmark Manager

A full-stack web application for managing bookmarks with a REST API backend and responsive frontend client.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Startup

1. **Clone or extract the project**
2. **Run the startup script:**

   **On macOS/Linux:**
   ```bash
   ./start.sh
   ```

   **On Windows:**
   ```bash
   start.bat
   ```

   **Or manually with npm:**
   ```bash
   npm install
   npm start
   ```

3. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Backend (Port 3001)
- **Framework:** Express.js
- **Storage:** JSON file (`server/bookmarks.json`)
- **Validation:** express-validator
- **CORS:** Enabled for frontend communication

### Frontend (Port 3000)
- **Technology:** Vanilla HTML, CSS, JavaScript
- **Server:** Express static file server
- **Features:** Responsive design, dark mode, real-time search

### Project Structure
```
bookmark-manager/
├── server/
│   ├── app.js              # Backend API server
│   └── bookmarks.json      # Data storage (JSON file)
├── client/
│   ├── server.js           # Frontend static server
│   └── public/
│       ├── index.html      # Main application UI
│       ├── styles.css      # Responsive styles + dark mode
│       └── app.js          # Frontend JavaScript logic
├── package.json            # Dependencies and scripts
├── start.sh               # Unix/Linux startup script
├── start.bat              # Windows startup script
└── README.md              # This file
```

## 📖 API Documentation

### Base URL: `http://localhost:3001`

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/bookmarks` | GET | Get all bookmarks | Query: `?tag=tagname` (optional) |
| `/bookmarks` | POST | Create bookmark | `{url, title, description?, tags?}` |
| `/bookmarks/:id` | PUT | Update bookmark | `{url, title, description?, tags?}` |
| `/bookmarks/:id` | DELETE | Delete bookmark | None |
| `/health` | GET | Health check | None |

### Data Model

```javascript
{
  "id": "string",           // Auto-generated unique identifier
  "url": "string",          // Required, must be valid URL
  "title": "string",        // Required, max 200 characters
  "description": "string",  // Optional, max 500 characters
  "tags": ["string"],       // Optional, max 5 lowercase tags
  "createdAt": "string"     // Auto-generated ISO 8601 datetime
}
```

### Response Format

**Success Response:**
```javascript
{
  "success": true,
  "data": {...},           // Bookmark data or array
  "message": "string"      // Optional success message
}
```

**Error Response:**
```javascript
{
  "success": false,
  "error": "string",       // Error message
  "details": [...]         // Optional validation details
}
```

### HTTP Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created successfully (POST)
- `400` - Bad request / Validation error
- `404` - Bookmark not found
- `500` - Internal server error

## 🎨 Features

### Core Features ✅
- ✅ **CRUD Operations:** Create, read, update, delete bookmarks
- ✅ **Input Validation:** URL format, field length, tag limits
- ✅ **Tag Filtering:** Click tags to filter bookmark list
- ✅ **Real-time Search:** Search by title, URL, or description
- ✅ **Responsive Design:** Works on desktop and mobile devices
- ✅ **Error Handling:** User-friendly error messages
- ✅ **Seed Data:** 7 pre-loaded bookmarks for demo

### Bonus Features ⭐
- ⭐ **Auto Title Fetch:** Automatically fetches page titles from URLs
- ⭐ **Dark Mode:** Toggle between light and dark themes
- ⭐ **Toast Notifications:** Success and error feedback
- ⭐ **Keyboard Shortcuts:** ESC to close modals/forms
- ⭐ **Local Storage:** Remembers theme preference
- ⭐ **Confirmation Dialogs:** Safe bookmark deletion
- ⭐ **Animated UI:** Smooth transitions and hover effects

## 🛠️ Design Choices

### Backend Design

1. **JSON File Storage**
   - Chosen for simplicity and no external dependencies
   - Easy to backup, version control, and inspect
   - Sufficient for development and small-scale usage
   - Alternative: Could easily switch to SQLite or MongoDB

2. **Express.js Framework**
   - Lightweight and widely adopted
   - Excellent middleware ecosystem
   - Simple routing and validation integration

3. **Validation Strategy**
   - Server-side validation with express-validator
   - Client-side validation for better UX
   - Comprehensive error handling and user feedback

4. **API Design**
   - RESTful endpoints following HTTP conventions
   - Consistent JSON response format
   - Proper HTTP status codes
   - Optional query parameters for filtering

### Frontend Design

1. **Vanilla JavaScript**
   - No framework dependencies for simplicity
   - Class-based architecture for organization
   - Modern ES6+ features and async/await
   - Modular event handling

2. **CSS Architecture**
   - CSS custom properties for theming
   - Mobile-first responsive design
   - Flexbox and Grid for layouts
   - Smooth animations and transitions

3. **User Experience**
   - Immediate feedback with loading states
   - Optimistic UI updates where possible
   - Keyboard navigation support
   - Accessible design principles

4. **State Management**
   - Local component state in JavaScript class
   - Separation of filtered vs raw data
   - Efficient re-rendering strategies

### Security Considerations

1. **Input Sanitization**
   - HTML escaping to prevent XSS attacks
   - URL validation to prevent malicious links
   - Tag normalization (lowercase)

2. **CORS Configuration**
   - Enabled for localhost development
   - Should be restricted in production

3. **Rate Limiting**
   - Not implemented in basic version
   - Recommended for production deployment

## 🧪 Testing

### Manual Testing Checklist

**Bookmark CRUD:**
- [ ] Create new bookmark with valid data
- [ ] Create bookmark with invalid URL (should fail)
- [ ] Create bookmark with empty title (should fail)
- [ ] Edit existing bookmark
- [ ] Delete bookmark with confirmation
- [ ] Auto-fetch title from URL (when title empty)

**Search & Filter:**
- [ ] Search by bookmark title
- [ ] Search by URL
- [ ] Search by description content
- [ ] Filter by clicking tag
- [ ] Clear active filter
- [ ] Combine search with tag filter

**UI/UX:**
- [ ] Toggle dark/light mode
- [ ] Responsive design on different screen sizes
- [ ] Form validation error messages
- [ ] Success/error toast notifications
- [ ] Modal keyboard navigation (ESC to close)
- [ ] Loading states during API calls

### API Testing

You can test the API directly using curl or tools like Postman:

```bash
# Get all bookmarks
curl http://localhost:3001/bookmarks

# Create a bookmark
curl -X POST http://localhost:3001/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","title":"Example Site"}'

# Filter by tag
curl http://localhost:3001/bookmarks?tag=development

# Update bookmark
curl -X PUT http://localhost:3001/bookmarks/BOOKMARK_ID \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","title":"Updated Title"}'

# Delete bookmark
curl -X DELETE http://localhost:3001/bookmarks/BOOKMARK_ID
```

## 🚀 Production Deployment

### Environment Variables

```bash
PORT=3001                # Backend server port
CLIENT_PORT=3000         # Frontend server port
NODE_ENV=production      # Environment mode
```

### Production Optimizations

1. **Backend:**
   - Add rate limiting middleware
   - Implement proper logging
   - Use process manager (PM2)
   - Add request compression
   - Implement proper error handling

2. **Frontend:**
   - Minify CSS/JavaScript
   - Add service worker for offline support
   - Implement proper caching headers
   - Add CSP (Content Security Policy)

3. **Infrastructure:**
   - Use reverse proxy (nginx)
   - Add HTTPS/SSL certificates
   - Implement proper CORS policies
   - Add database (PostgreSQL/MongoDB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your branch: `git push origin feature-name`
6. Create a pull request

## 🛟 Troubleshooting

### Common Issues

**"Port already in use" error:**
```bash
# Find processes using the ports
lsof -i :3000
lsof -i :3001

# Kill the processes
kill -9 <PID>
```

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API base URL in `client/public/app.js`

**Bookmarks not persisting:**
- Check file permissions for `server/bookmarks.json`
- Verify the server has write access to the directory

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Support

- Check the browser console for JavaScript errors
- Check the terminal output for server errors
- Ensure all prerequisites are installed
- Try running each server individually for debugging

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own bookmark manager.

---

**Built with ❤️ using Node.js, Express, and Vanilla JavaScript**