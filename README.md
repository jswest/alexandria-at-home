# Alexandria at Home
### Personal Library Management System

A modern web application for managing your personal book collection, built with SvelteKit and designed for ease of use and comprehensive book tracking.

## Features

### 📚 **Book Management**
- **ISBN Scanner**: Use your device camera to scan book barcodes for instant addition
- **Manual Entry**: Add books manually with comprehensive metadata
- **Google Books Integration**: Automatic book data retrieval via Google Books API
- **Advanced Search**: Filter by title, author, publisher, and publication date
- **Inline Editing**: Edit book details directly from the book cards
- **Book Details**: Store titles, subtitles, authors, publishers, publication dates, descriptions, and cover images

### 👥 **Author Management**
- **Author Pages**: Dedicated pages for each author with their complete bibliography
- **Author Details**: Track birth dates and biographical information
- **Wikipedia Integration**: Automatic author birth date lookup via Wikipedia API
- **Author Search**: Autocomplete author search and filtering
- **Comprehensive CRUD**: Full create, read, update, delete operations

### 🏷️ **Organization System**
- **Tagging System**: Add custom tags to categorize and organize books
- **Tag Management**: Create, edit, and remove tags with autocomplete
- **Publisher Tracking**: Manage and search by publishers
- **Relationship Management**: Track complex relationships between books, authors, and publishers

### 🔍 **Advanced Features**
- **Pagination**: Browse large collections with 20 items per page
- **Real-time Filtering**: Instant search results with multiple filter combinations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Consistent UI**: Modern, clean interface built with reusable components
- **Error Handling**: Graceful fallbacks for missing data or API failures

## Technology Stack

- **Frontend**: SvelteKit with Svelte 5 syntax
- **Database**: SQLite with Drizzle ORM
- **Styling**: Custom CSS with CSS custom properties
- **Scanner**: Quagga2 barcode scanning library
- **Icons**: Lucide Svelte icon set
- **APIs**: Google Books API, Wikipedia API

## Installation

```bash
git clone https://github.com/your-username/alexandria-at-home.git
cd alexandria-at-home
npm install
cp env.sample .env # Configure your environment variables
npx drizzle-kit migrate
npm run dev -- --open
```

## Configuration

Create a `.env` file with your API keys:
```env
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

## Usage

1. **Start the application**: Run `npm run dev` and navigate to `http://localhost:5173`
2. **Add books**: Use the scanner at `/scan` or manual entry at the home page
3. **Browse collection**: View all books at `/books` or authors at `/authors`
4. **Search and filter**: Use the filter controls to find specific books or authors
5. **Manage details**: Click on any book or author card to edit information

## Database Schema

The application uses a normalized SQLite database with the following main tables:
- `books` - Book information and metadata
- `authors` - Author details and biographical data
- `publishers` - Publisher information
- `tags` - Custom categorization tags
- `authors_books` - Many-to-many relationship between authors and books
- `books_tags` - Many-to-many relationship between books and tags

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Generate database migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

## Contributing

This is a personal project, but feel free to fork and adapt it for your own use. The codebase is designed to be modular and extensible.