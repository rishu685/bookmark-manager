// Bookmark Manager Frontend Application
class BookmarkManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
        this.bookmarks = [];
        this.filteredBookmarks = [];
        this.currentFilter = null;
        this.currentSearch = '';
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTheme();
        this.loadBookmarks();
    }

    initializeElements() {
        // Form elements
        this.addBookmarkBtn = document.getElementById('add-bookmark-btn');
        this.formContainer = document.getElementById('bookmark-form-container');
        this.bookmarkForm = document.getElementById('bookmark-form');
        this.formTitle = document.getElementById('form-title');
        this.cancelFormBtn = document.getElementById('cancel-form-btn');
        
        // Form inputs
        this.urlInput = document.getElementById('bookmark-url');
        this.titleInput = document.getElementById('bookmark-title');
        this.descriptionInput = document.getElementById('bookmark-description');
        this.tagsInput = document.getElementById('bookmark-tags');
        
        // Search and filter
        this.searchInput = document.getElementById('search-input');
        this.activeFilter = document.getElementById('active-filter');
        this.filterTagDisplay = document.getElementById('filter-tag-display');
        this.clearFilterBtn = document.getElementById('clear-filter-btn');
        
        // Display elements
        this.bookmarksList = document.getElementById('bookmarks-list');
        this.bookmarksCount = document.getElementById('bookmarks-count');
        this.loadingMessage = document.getElementById('loading-message');
        this.errorMessage = document.getElementById('error-message');
        this.emptyMessage = document.getElementById('empty-message');
        
        // Modal elements
        this.deleteModal = document.getElementById('delete-modal');
        this.deleteBookmarkPreview = document.getElementById('delete-bookmark-preview');
        this.cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        this.confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        
        // Theme toggle
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        
        // Toast container
        this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
        // Form events
        this.addBookmarkBtn.addEventListener('click', () => this.showAddForm());
        this.cancelFormBtn.addEventListener('click', () => this.hideForm());
        this.bookmarkForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Search and filter events
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.clearFilterBtn.addEventListener('click', () => this.clearFilter());
        
        // Modal events
        this.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        
        // Theme toggle
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        
        // Close modal on backdrop click
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.hideDeleteModal();
            }
        });
        
        // Close form on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.formContainer.style.display !== 'none') {
                    this.hideForm();
                } else if (this.deleteModal.style.display !== 'none') {
                    this.hideDeleteModal();
                }
            }
        });

        // URL input blur event for title auto-fetch
        this.urlInput.addEventListener('blur', () => this.handleUrlBlur());
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('bookmarks-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bookmarks-theme', theme);
        this.themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
        this.themeToggleBtn.title = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
    }

    // API Methods
    async apiRequest(endpoint, options = {}) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async loadBookmarks(tagFilter = null) {
        try {
            this.showLoading();
            
            const endpoint = tagFilter ? `/bookmarks?tag=${encodeURIComponent(tagFilter)}` : '/bookmarks';
            const response = await this.apiRequest(endpoint);
            
            this.bookmarks = response.data || [];
            this.applyCurrentFilters();
            this.renderBookmarks();
            
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            this.showError(`Failed to load bookmarks: ${error.message}`);
        }
    }

    async saveBookmark(bookmarkData) {
        try {
            let response;
            
            if (this.editingId) {
                // Update existing bookmark
                response = await this.apiRequest(`/bookmarks/${this.editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(bookmarkData)
                });
                this.showToast('Bookmark updated successfully!', 'success');
            } else {
                // Create new bookmark
                response = await this.apiRequest('/bookmarks', {
                    method: 'POST',
                    body: JSON.stringify(bookmarkData)
                });
                this.showToast('Bookmark added successfully!', 'success');
            }
            
            this.hideForm();
            this.loadBookmarks(this.currentFilter);
            
        } catch (error) {
            console.error('Failed to save bookmark:', error);
            this.showError(`Failed to save bookmark: ${error.message}`);
            
            // Show validation errors if available
            if (error.message.includes('Validation failed')) {
                try {
                    const response = await fetch(`${this.apiBaseUrl}/bookmarks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bookmarkData)
                    });
                    const errorData = await response.json();
                    if (errorData.details) {
                        this.showValidationErrors(errorData.details);
                    }
                } catch (e) {
                    // Ignore this error
                }
            }
        }
    }

    async deleteBookmark(id) {
        try {
            await this.apiRequest(`/bookmarks/${id}`, {
                method: 'DELETE'
            });
            
            this.showToast('Bookmark deleted successfully!', 'success');
            this.hideDeleteModal();
            this.loadBookmarks(this.currentFilter);
            
        } catch (error) {
            console.error('Failed to delete bookmark:', error);
            this.showError(`Failed to delete bookmark: ${error.message}`);
        }
    }

    // URL title fetching (bonus feature)
    async handleUrlBlur() {
        const url = this.urlInput.value.trim();
        const title = this.titleInput.value.trim();
        
        // Only auto-fetch if URL is valid and title is empty
        if (url && !title && this.isValidUrl(url)) {
            try {
                // Show loading indicator in title field
                this.titleInput.placeholder = 'Fetching title...';
                this.titleInput.disabled = true;
                
                const response = await this.apiRequest('/bookmarks', {
                    method: 'POST',
                    body: JSON.stringify({ url, title: 'temp' })
                });
                
                if (response.data && response.data.title && response.data.title !== 'temp') {
                    this.titleInput.value = response.data.title;
                }
                
            } catch (error) {
                console.log('Could not fetch page title');
            } finally {
                this.titleInput.placeholder = 'Enter bookmark title';
                this.titleInput.disabled = false;
            }
        }
    }

    // Form Management
    showAddForm() {
        this.editingId = null;
        this.formTitle.textContent = 'Add New Bookmark';
        this.clearForm();
        this.formContainer.style.display = 'block';
        this.urlInput.focus();
    }

    showEditForm(bookmark) {
        this.editingId = bookmark.id;
        this.formTitle.textContent = 'Edit Bookmark';
        
        this.urlInput.value = bookmark.url;
        this.titleInput.value = bookmark.title;
        this.descriptionInput.value = bookmark.description || '';
        this.tagsInput.value = bookmark.tags ? bookmark.tags.join(', ') : '';
        
        this.formContainer.style.display = 'block';
        this.titleInput.focus();
    }

    hideForm() {
        this.formContainer.style.display = 'none';
        this.clearForm();
        this.clearValidationErrors();
    }

    clearForm() {
        this.bookmarkForm.reset();
        this.editingId = null;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.clearValidationErrors();
        
        const formData = this.getFormData();
        
        if (this.validateForm(formData)) {
            this.saveBookmark(formData);
        }
    }

    getFormData() {
        const tags = this.tagsInput.value
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);
            
        return {
            url: this.urlInput.value.trim(),
            title: this.titleInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            tags: tags.slice(0, 5) // Limit to 5 tags
        };
    }

    validateForm(data) {
        let isValid = true;
        
        // URL validation
        if (!data.url) {
            this.showFieldError('url-error', 'URL is required');
            isValid = false;
        } else if (!this.isValidUrl(data.url)) {
            this.showFieldError('url-error', 'Please enter a valid URL');
            isValid = false;
        }
        
        // Title validation
        if (!data.title) {
            this.showFieldError('title-error', 'Title is required');
            isValid = false;
        } else if (data.title.length > 200) {
            this.showFieldError('title-error', 'Title must be 200 characters or less');
            isValid = false;
        }
        
        // Description validation
        if (data.description && data.description.length > 500) {
            this.showFieldError('description-error', 'Description must be 500 characters or less');
            isValid = false;
        }
        
        // Tags validation
        if (data.tags.length > 5) {
            this.showFieldError('tags-error', 'Maximum 5 tags allowed');
            isValid = false;
        }
        
        return isValid;
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearValidationErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });
    }

    showValidationErrors(errors) {
        errors.forEach(error => {
            const field = error.param;
            const message = error.msg;
            
            const errorId = `${field}-error`;
            this.showFieldError(errorId, message);
        });
    }

    // Delete Modal Management
    showDeleteModal(bookmark) {
        this.deleteBookmarkId = bookmark.id;
        
        // Show bookmark preview
        this.deleteBookmarkPreview.innerHTML = `
            <div class="bookmark-title">${this.escapeHtml(bookmark.title)}</div>
            <div class="bookmark-url">${this.escapeHtml(bookmark.url)}</div>
        `;
        
        this.deleteModal.style.display = 'flex';
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
        this.deleteBookmarkId = null;
    }

    confirmDelete() {
        if (this.deleteBookmarkId) {
            this.deleteBookmark(this.deleteBookmarkId);
        }
    }

    // Search and Filter Management
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase();
        this.applyCurrentFilters();
        this.renderBookmarks();
    }

    filterByTag(tag) {
        this.currentFilter = tag;
        this.showActiveFilter(tag);
        this.applyCurrentFilters();
        this.renderBookmarks();
    }

    clearFilter() {
        this.currentFilter = null;
        this.activeFilter.style.display = 'none';
        this.applyCurrentFilters();
        this.renderBookmarks();
    }

    showActiveFilter(tag) {
        this.filterTagDisplay.textContent = tag;
        this.activeFilter.style.display = 'flex';
    }

    applyCurrentFilters() {
        let filtered = [...this.bookmarks];
        
        // Apply tag filter
        if (this.currentFilter) {
            filtered = filtered.filter(bookmark => 
                bookmark.tags && bookmark.tags.includes(this.currentFilter)
            );
        }
        
        // Apply search filter
        if (this.currentSearch) {
            filtered = filtered.filter(bookmark => 
                bookmark.title.toLowerCase().includes(this.currentSearch) ||
                bookmark.url.toLowerCase().includes(this.currentSearch) ||
                (bookmark.description && bookmark.description.toLowerCase().includes(this.currentSearch))
            );
        }
        
        this.filteredBookmarks = filtered;
    }

    // Rendering Methods
    renderBookmarks() {
        this.hideMessages();
        
        if (this.filteredBookmarks.length === 0) {
            if (this.currentSearch || this.currentFilter) {
                this.emptyMessage.innerHTML = '<p>No bookmarks match your current search or filter.</p>';
            } else {
                this.emptyMessage.innerHTML = '<p>No bookmarks found. Add your first bookmark to get started!</p>';
            }
            this.emptyMessage.style.display = 'block';
        } else {
            this.renderBookmarksList();
        }
        
        this.updateBookmarksCount();
    }

    renderBookmarksList() {
        this.bookmarksList.innerHTML = this.filteredBookmarks
            .map(bookmark => this.createBookmarkHTML(bookmark))
            .join('');
        
        // Add event listeners to the rendered elements
        this.addBookmarkEventListeners();
    }

    createBookmarkHTML(bookmark) {
        const tagsHTML = bookmark.tags && bookmark.tags.length > 0
            ? bookmark.tags.map(tag => 
                `<span class="tag" onclick="bookmarkManager.filterByTag('${tag}')">${this.escapeHtml(tag)}</span>`
              ).join('')
            : '';
            
        const descriptionHTML = bookmark.description
            ? `<div class="bookmark-description">${this.escapeHtml(bookmark.description)}</div>`
            : '';
            
        const createdDate = new Date(bookmark.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="bookmark-item" data-id="${bookmark.id}">
                <div class="bookmark-header">
                    <div class="bookmark-info">
                        <div class="bookmark-title">${this.escapeHtml(bookmark.title)}</div>
                        <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer" class="bookmark-url">
                            ${this.escapeHtml(bookmark.url)}
                        </a>
                    </div>
                    <div class="bookmark-actions">
                        <button class="btn btn-secondary btn-small edit-btn" data-id="${bookmark.id}">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-small delete-btn" data-id="${bookmark.id}">
                            Delete
                        </button>
                    </div>
                </div>
                ${descriptionHTML}
                ${tagsHTML ? `<div class="bookmark-tags">${tagsHTML}</div>` : ''}
                <div class="bookmark-date">Added on ${createdDate}</div>
            </div>
        `;
    }

    addBookmarkEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookmarkId = e.target.getAttribute('data-id');
                const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
                if (bookmark) {
                    this.showEditForm(bookmark);
                }
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookmarkId = e.target.getAttribute('data-id');
                const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
                if (bookmark) {
                    this.showDeleteModal(bookmark);
                }
            });
        });
    }

    // UI State Management
    showLoading() {
        this.hideMessages();
        this.loadingMessage.style.display = 'block';
    }

    showError(message) {
        this.hideMessages();
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideMessages() {
        this.loadingMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
        this.emptyMessage.style.display = 'none';
    }

    updateBookmarksCount() {
        const count = this.filteredBookmarks.length;
        const total = this.bookmarks.length;
        
        let countText;
        if (this.currentSearch || this.currentFilter) {
            countText = `${count} of ${total} bookmarks`;
        } else {
            countText = `${count} bookmark${count !== 1 ? 's' : ''}`;
        }
        
        this.bookmarksCount.textContent = countText;
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Utility Methods
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookmarkManager = new BookmarkManager();
});

// Service Worker Registration (for PWA capabilities - bonus)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    });
}