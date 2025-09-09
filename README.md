# Research Lab Website - Data Configuration Guide

This document explains how to configure the three main data files that power the dynamic content generation for the research lab website.

## 📁 Data Structure Overview

The website uses three main JSON configuration files located in the `data/` folder:

- **`research.json`** - Research projects and publications
- **`people.json`** - Lab members and team information  
- **`news.json`** - News articles and featured events

## 🔬 Research Projects (`data/research.json`)

### Structure
```json
{
  "title": "Research Projects by Topics",
  "categories": [
    {
      "id": "machine_learning",
      "name": "Machine Learning", 
      "projects": [...]
    }
  ]
}
```

### Category Configuration
**Required Fields:**
- `id` - **Must match existing HTML structure** (do not change: `machine_learning`, `ctrl_games`, `finance`, `health`, `blockchain`)
- `name` - Display name for the category

### Project Configuration
**Required Fields:**
```json
{
  "display": {
    "title": "Your Project Title",           // ✅ Required
    "image": "images/path/to/image.jpg",     // ✅ Required - thumbnail image
    "date": "June 2, 2020",                 // ✅ Required
    "authors": "Authors: John Doe, Jane Smith" // ✅ Required - include "Authors:" prefix
  },
  "details": {
    "authors": "John Doe, Jane Smith",       // ✅ Required - clean author names
    "abstract": "Your abstract text...",     // ✅ Required
    "paper_url": "https://arxiv.org/...",    // ✅ Required if paper exists
    "image": "images/path/to/full-image.jpg" // ✅ Required - full-size image
  }
}
```

**Optional Fields:**
```json
{
  "details": {
    "paper_text": "Custom link text",       // 🔄 Optional - defaults to URL if not provided
    "paper_label": "Full-text",            // 🔄 Optional - defaults to "Full-text"
    "visible": false                       // 🔄 Optional - hide project if needed
  }
}
```

**🚀 Auto-Generated Fields** (do not include):
- ~~`id`~~ - Generated from title
- ~~`display.link`~~ - Generated automatically

## 👥 People (`data/people.json`)

### Structure
```json
{
  "leadingFaculty": [...],
  "currentPhDStudents": [...],
  "currentPostdocs": [...],
  "pastPhDStudents": [...],
  "pastPostdocs": [...],
  "pastVisitors": [...]
}
```

### Person Configuration
**Required Fields:**
```json
{
  "name": "Prof. John Doe",               // ✅ Required
  "image": "images/uploads/avatar.jpg"    // ✅ Required
}
```

**Optional Fields:**
```json
{
  "link": "https://example.com",          // 🔄 Optional - personal website
  "linkTarget": "_new"                   // 🔄 Optional - for pastVisitors only
}
```

**🚀 Auto-Generated Fields** (do not include):
- ~~`wpImageId`~~ - Generated from image path

## 📰 News (`data/news.json`)

### Structure
```json
{
  "articles": [
    {
      "title": "News Title",
      "date": "August 2025", 
      "content": "News content...",
      "author": "Author Name"
    }
  ]
}
```

### Article Configuration
**Required Fields:**
```json
{
  "title": "Your News Title",             // ✅ Required
  "date": "August 2025",                  // ✅ Required
  "content": "Full article content..."    // ✅ Required - supports HTML
}
```

**Optional Fields:**
```json
{
  "author": "Author Name",                // 🔄 Optional - shows "By Author |" if present
  "visible": false                       // 🔄 Optional - hide article if needed
}
```

**🚀 Auto-Generated Fields** (do not include):
- ~~`id`~~ - Generated from title (URL-friendly)
- ~~`link`~~ - Generated automatically

## 🚀 Usage Instructions

### Adding New Content

1. **Research Project:**
   ```json
   // Add to appropriate category in research.json
   {
     "display": {
       "title": "My New Research",
       "image": "images/uploads/2024/my-research-300x200.jpg",
       "date": "March 15, 2024",
       "authors": "Authors: Your Name, Co-author Name"
     },
     "details": {
       "authors": "Your Name, Co-author Name",
       "abstract": "This research explores...",
       "paper_url": "https://arxiv.org/abs/2024.xxxxx",
       "image": "images/uploads/2024/my-research.jpg"
     }
   }
   ```

2. **Team Member:**
   ```json
   // Add to appropriate section in people.json
   {
     "name": "Dr. New Member",
     "image": "images/uploads/2024/new-member.jpg",
     "link": "https://newmember.website.com"
   }
   ```

3. **News Article:**
   ```json
   // Add to articles array in news.json
   {
     "title": "Exciting Lab News",
     "date": "March 2024",
     "author": "Lab Director",
     "content": "We are excited to announce that..."
   }
   ```

### Image Guidelines

- **Research thumbnails:** 300px width recommended (e.g., `image-300x200.jpg`)
- **Research full images:** Original resolution for detail pages
- **People photos:** Square format recommended for consistent layout
- **All images:** Place in `images/uploads/` folder with descriptive names

### Best Practices

1. **Consistent Naming:** Use descriptive, lowercase filenames with hyphens
2. **Image Optimization:** Compress images for web performance
3. **Content Quality:** Write clear, engaging abstracts and descriptions
4. **Regular Updates:** Keep team information and news current
5. **Validation:** Test changes locally before deployment

## 🎯 Key Benefits of This System

- **🚀 Automatic ID Generation:** No more manual ID management
- **🔗 Dynamic Links:** URLs generated automatically from titles
- **📱 Responsive Layout:** Content adapts to all screen sizes  
- **🎨 Consistent Styling:** Maintains design system automatically
- **⚡ Performance Optimized:** Efficient loading and rendering
- **🛠️ Easy Maintenance:** Simple JSON editing, no HTML changes needed

## 🔧 Technical Notes

- The system uses JavaScript classes for dynamic content generation
- Category IDs in `research.json` are tied to specific HTML elements and should not be changed
- All user-facing IDs are automatically generated using URL-friendly slugification
- The website maintains full backward compatibility with existing URLs

## 📞 Support

For questions or issues with data configuration, please refer to the JavaScript files in the `js/` folder:
- `research-manager.js` - Research projects logic
- `people-generator.js` - People section logic  
- `news-manager.js` - News articles logic

