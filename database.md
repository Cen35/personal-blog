# PERSONAL BLOG database design

## users

| Field | Type | Notes |
| --- | --- | --- |
| id | BIGINT | Primary key, auto increment |
| username | VARCHAR(20) | Unique, 3-20 characters |
| email | VARCHAR(190) | Unique |
| password | VARCHAR(255) | bcrypt hash |
| avatar | VARCHAR(500) | Optional image URL |
| bio | VARCHAR(500) | Optional profile text |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

## categories

| Field | Type | Notes |
| --- | --- | --- |
| id | BIGINT | Primary key, auto increment |
| name | VARCHAR(60) | Unique |
| description | VARCHAR(255) | Optional description |

## posts

| Field | Type | Notes |
| --- | --- | --- |
| id | BIGINT | Primary key, auto increment |
| title | VARCHAR(160) | Required |
| content | LONGTEXT | Markdown source |
| excerpt | VARCHAR(300) | List-page summary |
| cover | VARCHAR(500) | Cover URL |
| category | VARCHAR(60) | Category name |
| tags | JSON | Array of tag strings |
| author_id | BIGINT | Foreign key to users |
| views | INT UNSIGNED | Defaults to zero |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

Indexes cover author, category, creation date and title/content full-text search.

