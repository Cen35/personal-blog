# PERSONAL BLOG PRD

## Core user features

- Register with username, email and password.
- Log in with username or email; receive a JWT valid for seven days.
- View and edit personal information, avatar and bio.
- Visitors may browse and search, but may not publish or edit.

## Article features

- Publish articles with title, Markdown content, category, tags and cover image.
- Edit an existing article owned by the logged-in user.
- Delete an article owned by the logged-in user.
- View article details rendered from Markdown; each view increases the view count.
- Browse article lists with pagination, category filtering and keyword search across title and content.

## Required pages

- Home article list
- Article detail
- Write and edit article (protected)
- Profile (protected)
- Login
- Register

## Acceptance criteria

- Passwords are hashed with bcrypt.
- Protected endpoints verify JWT and ownership.
- API errors are returned in a consistent JSON shape.
- Configuration and secrets come from environment variables.
- The frontend stores the token locally, adds it to API requests and protects private routes.
- The editor provides Markdown editing and live preview.

