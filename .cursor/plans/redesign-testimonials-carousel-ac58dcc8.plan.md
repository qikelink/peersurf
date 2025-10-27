<!-- ac58dcc8-b1d9-4e0a-a22c-be6f7aaf4e59 794a7090-f27c-4926-a092-2bb6178c69fe -->
# Redesign Testimonials Carousel

## Overview

Transform the testimonials section (lines 174-247 in `src/components/pages/home-page.tsx`) to display 3 cards simultaneously in a horizontal layout with Twitter-style design.

## Changes Required

### 1. Update Testimonials Data Structure

Add social media platform and engagement metrics to each testimonial object:

- Add `platform` field (twitter, facebook, instagram)
- Add `likes` and `comments` counts (use "1k", "500" format)

### 2. Redesign Carousel Layout

Replace single-card carousel with multi-card display:

- Show 3 cards simultaneously on desktop
- Show 2 cards on tablet
- Show 1 card on mobile
- Implement smooth sliding animation that moves one card at a time
- Update navigation to scroll by one card instead of full width

### 3. Redesign Testimonial Cards

Transform card styling to match the image:

- White background cards with shadow (instead of teal-900)
- Social media platform icon in top-right corner (colored badges)
- User avatar on left with name below
- Testimonial text with @mentions highlighted in blue/purple
- Bottom row: heart icon + likes count, comment icon + comments count, timestamp

### 4. Update Navigation Controls

Position chevron buttons to work with multi-card layout while maintaining existing arrow functionality.

## Files to Modify

- `src/components/pages/home-page.tsx` (lines 12-43 for data, lines 174-247 for section)

## Implementation Notes

- Keep heading "What the Community Says" unchanged
- Maintain existing testimonial messages and author info
- Use placeholder engagement metrics (1k likes, 500 comments)
- Auto-assign social platforms to testimonials for variety

### To-dos

- [ ] Add platform, likes, and comments fields to testimonials array
- [ ] Transform card design to white Twitter-style cards with social icons, engagement metrics, and highlighted @mentions
- [ ] Change carousel to display 3 cards simultaneously with responsive breakpoints
- [ ] Update carousel navigation to scroll one card at a time