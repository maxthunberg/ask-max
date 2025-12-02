# Profile Image

## Setup Instructions

To use your own profile image:

1. **Add your image file** to this directory (`/public/images/`)
2. **Name it**: `max-thunberg.jpg` (or `.png`, `.webp`)
3. **Recommended specs**:
   - Dimensions: 526px × 701px (or higher resolution with same aspect ratio)
   - Format: JPG, PNG, or WebP
   - Size: Under 500KB for optimal performance

## Current Setup

The app looks for `/public/images/max-thunberg.jpg`

If the file doesn't exist, you'll see a placeholder image from Unsplash.

## Why This Works Everywhere

✅ **Figma Make** - Images in `/public` are automatically included
✅ **Local Development** - Next.js serves `/public` at the root URL
✅ **Production** - Vercel/other hosts serve `/public` as static assets

No external hosting needed!
