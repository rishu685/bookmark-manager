# 📚 Bookmark Manager

A full-stack web application for managing bookmarks with a REST API backend and responsive frontend client.

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/rishu685/bookmark-manager.git
   cd bookmark-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```
   Or use platform-specific scripts:
   - **macOS/Linux:** `./start.sh`
   - **Windows:** `start.bat`

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🚀 Netlify Deployment

This application is configured for easy deployment on Netlify with serverless functions.

### Deploy to Netlify

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your forked repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Manual Deployment

Alternatively, you can deploy manually:

```bash
# Build for production
npm run build

# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=dist --functions=netlify/functions
```

### Environment Configuration

The app automatically detects the environment:
- **Local development:** Uses `http://localhost:3001` for API
- **Production (Netlify):** Uses `/api` endpoints (Netlify Functions)

## 🛠️ Tech Stack Used

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Validation:** express-validator
- **HTTP Client:** axios (for auto-title fetching)
- **HTML Parser:** cheerio (for title extraction)
- **CORS:** cors middleware
- **Body Parser:** body-parser

### Frontend
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Typography:** Inter font (Google Fonts)
- **Architecture:** Vanilla JavaScript with class-based components
- **Styling:** CSS Custom Properties, Flexbox, Grid
- **Features:** Responsive design, dark mode, animations

### Development & Deployment
- **Package Manager:** npm
- **Process Management:** concurrently (for running both servers)
- **Development:** nodemon (for auto-restart)
- **Version Control:** Git
- **Platform:** Cross-platform (macOS, Linux, Windows)
- **Deployment:** Netlify with serverless functions
- **Build Process:** Automated with npm scripts

### Storage
- **Local Development:** JSON file storage (`server/bookmarks.json`)
- **Production (Netlify):** Serverless function with `/tmp` storage
- **Data Persistence:** File system based
- **Seed Data:** 7 pre-loaded bookmarks

### Netlify Functions Architecture
- **API Endpoints:** Converted to Netlify serverless functions
- **Function Location:** `netlify/functions/bookmarks.js`
- **Runtime:** Node.js 18.x
- **Storage:** Temporary file system (`/tmp` directory)
- **Auto-scaling:** Serverless architecture handles traffic automatically

## 🤖 AI Tools Used

### Primary AI Assistant
- **GitHub Copilot** - Used for:
  - Complete application architecture and development
  - Backend REST API implementation
  - Frontend UI/UX design and JavaScript logic
  - CSS styling and responsive design
  - Code optimization and best practices
  - Documentation generation
  - Testing and debugging assistance

### Development Approach
- **AI-Assisted Coding:** 100% of the codebase developed with AI assistance
- **Prompt Engineering:** Iterative refinement of requirements
- **Code Generation:** Full-stack application from single brief
- **UI Enhancement:** AI-driven design improvements for authentic feel
- **Testing Automation:** AI-assisted functionality verification

## ⏱️ Time Spent

### Development Timeline
- **Total Development Time:** ~2-3 hours
- **Planning & Architecture:** 30 minutes
- **Backend API Development:** 45 minutes
- **Frontend UI Implementation:** 60 minutes
- **UI/UX Enhancements:** 30 minutes
- **Testing & Debugging:** 15 minutes
- **Documentation:** 20 minutes
- **Git Setup & Deployment:** 10 minutes

### Development Phases
1. **Initial Setup** (20 mins) - Project structure, package.json, dependencies
2. **Backend Development** (45 mins) - REST API, validation, error handling
3. **Frontend Core** (40 mins) - HTML structure, basic JavaScript functionality
4. **UI Design** (30 mins) - CSS styling, responsive design, theme system
5. **UI Enhancement** (30 mins) - Making design feel less AI-generated
6. **Integration Testing** (15 mins) - API testing, cross-server communication
7. **Documentation** (20 mins) - README, API docs, setup instructions

## 🧠 Assumptions Made

### Technical Assumptions
- **Node.js Environment:** Assumed users have Node.js installed or can install it
- **Modern Browser:** Frontend targets modern browsers supporting ES6+, CSS Grid, Flexbox
- **Local Development:** Application designed for local development/testing
- **Port Availability:** Assumed ports 3000 and 3001 are available
- **File Permissions:** Assumed write permissions for JSON file storage

### Feature Assumptions
- **Simple Storage:** JSON file storage sufficient for demo/development purposes
- **No Authentication:** No user accounts or authentication required
- **Single User:** Application designed for single-user usage
- **Basic Validation:** Client + server-side validation sufficient for requirements
- **Auto-Title Fetching:** Best effort approach, failures handled gracefully

### UI/UX Assumptions
- **Responsive Design:** Users may access from desktop and mobile devices
- **Dark Mode Preference:** Users want theme switching capability
- **Modern Design:** Users prefer contemporary UI over basic styling
- **Accessibility:** Basic accessibility through semantic HTML and keyboard navigation
- **Performance:** Prioritized user experience over complex optimization

### Development Assumptions
- **Cross-Platform:** Application should work on macOS, Linux, and Windows
- **NPM Ecosystem:** Standard npm package management acceptable
- **Git Workflow:** Standard Git workflow with main branch
- **Development vs Production:** Focused on development setup, production considerations noted
- **Error Handling:** User-friendly error messages more important than detailed debugging

### Scope Assumptions
- **MVP Focus:** Delivered core functionality first, bonus features as enhancements
- **No External Services:** Avoided external databases or cloud services for simplicity
- **Self-Contained:** Application should run independently without external dependencies
- **Documentation Priority:** Comprehensive README more valuable than inline comments
- **Testing Strategy:** Manual testing and API verification over automated test suites

## 📖 Features Delivered

### Core Requirements ✅
- ✅ REST API with all required endpoints (GET, POST, PUT, DELETE)
- ✅ Proper HTTP status codes and JSON responses
- ✅ Data validation and error handling
- ✅ Frontend with bookmark CRUD operations
- ✅ Search and tag filtering functionality
- ✅ Responsive design
- ✅ Seed data (7 bookmarks)
- ✅ Single startup command

### Bonus Features ⭐
- ⭐ Auto-title fetching from URLs
- ⭐ Dark mode toggle with persistence
- ⭐ Modern UI with animations and transitions
- ⭐ Toast notifications
- ⭐ Keyboard shortcuts (ESC to close modals)
- ⭐ Cross-platform startup scripts
- ⭐ Comprehensive API documentation

## 🚀 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/bookmarks` | GET | Get all bookmarks (supports `?tag=value` filter) |
| `/bookmarks` | POST | Create new bookmark |
| `/bookmarks/:id` | PUT | Update existing bookmark |
| `/bookmarks/:id` | DELETE | Delete bookmark |
| `/health` | GET | Health check |

## 📁 Project Structure
```
bookmark-manager/
├── server/
│   ├── app.js              # Backend API server
│   └── bookmarks.json      # Data storage
├── client/
│   ├── server.js           # Frontend static server
│   └── public/
│       ├── index.html      # Main application UI
│       ├── styles.css      # Responsive styles + dark mode
│       └── app.js          # Frontend JavaScript logic
├── package.json            # Dependencies and scripts
├── start.sh               # Unix/Linux startup script
├── start.bat              # Windows startup script
└── README.md              # This documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your branch: `git push origin feature-name`
6. Create a pull request

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own bookmark manager.

---

**Built with ❤️ using Node.js, Express, Vanilla JavaScript, and GitHub Copilot AI**
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