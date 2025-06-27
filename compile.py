import os
import re
import frontmatter  # pip install python-frontmatter
import markdown     # pip install markdown
from datetime import datetime
from pathlib import Path

def slugify(text):
    """Converts text to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w]+', '-', text).strip('-')
    return text

# Directory where markdown files are stored
content_dir = Path('content')
posts = []

# Read and parse every markdown file in the content directory.
for md_file in content_dir.glob('*.md'):
    with md_file.open(encoding='utf-8') as f:
        metadata, content = frontmatter.load(f).content.split('---', 1)
        title, date, tags = metadata.split('\n', 2)
        title = title.strip()
        date = date.strip()
        tags = tags.strip().split(',') if tags.strip() else []

        # Convert markdown content to HTML.
        html_content = markdown.markdown(
            content, extensions=['fenced_code', 'codehilite']
        )
        post_slug = slugify(title)
        posts.append({
            'title': title,
            'date': date,
            'tags': tags,
            'content': html_content,
            'slug': post_slug,
        })

# Convert date to ISO format and sort posts by date (newest first).
def parse_date(d):
    try:
        return datetime.strptime(d, '%Y-%m-%d').isoformat()
    except Exception:
        return datetime.min.isoformat()

for post in posts:
    post['date'] = parse_date(post['date'])

posts.sort(key=lambda p: p['date'], reverse=True)

for post in posts:
    post['date'] = datetime.fromisoformat(post['date']).strftime('%b %d, %Y')

# Generate a dictionary for category counts.
categories = {}
for post in posts:
    for tag in post['tags']:
        tag_key = tag.lower()
        categories[tag_key] = categories.get(tag_key, 0) + 1

# Generate a list of recent posts (here, the 5 most recent)
recent_posts = [{'title': p['title'], 'slug': p['slug']} for p in posts[:5]]

# Generate HTML for each blog post.
posts_html = ""
for post in posts:
    # Each post is wrapped in an <article> with a unique id.
    post_html = f"""
    <article id="{post['slug']}">
        <div class="header">
            <a href="#" class="back-button">←</a>
            <span class="date">{post['date'].upper()}</span>
            <span class="tags">
    """
    for tag in post['tags']:
        post_html += f'<a href="#">{tag.upper()}</a> '
    post_html += f"""
            </span>
        </div>
        <h1>{post['title']}</h1>
        {post['content']}
    </article>
    """
    posts_html += post_html

# Generate HTML for categories.
categories_html = ""
for tag, count in categories.items():
    categories_html += f'<li><a href="#">{tag}</a> <span class="count">[{count}]</span></li>\n'

# Generate HTML for recent posts.
recent_posts_html = ""
for rp in recent_posts:
    recent_posts_html += f'<li><a href="#{rp["slug"]}">{rp["title"]}</a></li>\n'

# Complete HTML template with CSS and JavaScript (using the provided template).
template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Personal Blog</title>
    <style>
        /* Reset and base styles */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: "Times New Roman", Times, serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f7;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}
        
        /* Layout */
        .container {{
            display: flex;
            min-height: 100vh;
        }}
        
        /* Main content */
        .content {{
            flex: 1;
            padding: 40px 60px;
            max-width: 700px;
        }}
        
        /* Sidebar */
        .sidebar {{
            width: 280px;
            padding: 40px 20px;
            border-left: 1px solid #eee;
        }}
        
        @media (max-width: 900px) {{
            .container {{
                flex-direction: column;
            }}
            .sidebar {{
                width: 100%;
                border-left: none;
                border-top: 1px solid #eee;
            }}
            .content {{
                padding: 30px 20px;
            }}
        }}
        
        /* Typography */
        h1 {{
            font-size: 32px;
            font-weight: normal;
            margin-bottom: 30px;
            color: #222;
        }}
        
        h2 {{
            font-size: 24px;
            font-weight: normal;
            margin: 40px 0 20px;
            color: #222;
        }}
        
        p {{
            margin-bottom: 20px;
        }}
        
        a {{
            color: #0066cc;
            text-decoration: none;
        }}
        
        a:hover {{
            text-decoration: underline;
        }}
        
        /* Header */
        .header {{
            margin-bottom: 40px;
        }}
        
        .date {{
            color: #999;
            font-size: 14px;
            margin-bottom: 10px;
        }}
        
        .tags {{
            display: inline-block;
            margin-left: 20px;
        }}
        
        .tags a {{
            color: #999;
            margin-right: 10px;
        }}
        
        /* Back button */
        .back-button {{
            display: inline-block;
            margin-right: 20px;
            color: #999;
            font-size: 20px;
        }}
        
        /* Code blocks */
        pre {{
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 3px;
            overflow-x: auto;
            margin-bottom: 20px;
            font-family: monospace;
            font-size: 14px;
        }}
        
        code {{
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 14px;
        }}
        
        /* Sidebar styles */
        .profile {{
            margin-bottom: 30px;
        }}
        
        .profile-image {{
            width: max-content;
            max-width: 180px;
            height: auto;
            border-radius: 50%;
            margin-bottom: 15px;
        }}
        
        .profile h3 {{
            font-size: 18px;
            font-weight: normal;
            margin-bottom: 10px;
        }}
        
        .profile p {{
            font-size: 14px;
            color: #666;
        }}
        
        .toc h3, .categories h3 {{
            font-size: 16px;
            font-weight: bold;
            color: #666;
        }}
        
        .toc ul, .categories ul {{
            color: #666;
            list-style-type: none;
        }}
        
        .toc li, .categories li {{
            color: #666;
        }}
        
        .toc a {{
            font-size: 14px;
            color: #666;
            
        }}
        
        .categories a {{
            color: #666;
            font-size: 14px;
        }}
        
        .categories .count {{
            color: #999;
            font-size: 12px;
            margin-left: 5px;
        }}
        
        /* Blockquote */
        blockquote {{
            border-left: 3px solid #ddd;
            padding-left: 20px;
            margin-left: 0;
            margin-bottom: 20px;
            color: #666;
        }}
        
        /* Emphasis */
        em {{
            font-style: italic;
        }}
        
        strong {{
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            {posts_html}
        </div>
        
        <div class="sidebar">
            <div class="profile">
                <img src="assets/pibble.jpg" alt="Profile Picture" class="profile-image">
                <h3>Aniruth Ananthanarayanan</h3>
                <p>Software engineer and music enthusiast. I write about materials science, physics, and Playboi Carti.</p>
                <p>Follow me on <a href="https://github.com/AniruthAnanth">GitHub</a> or email me at <a href="mailto:aniruth.airlines@gmail.com">aniruth.airlines@gmail.com</a>.</p>
                <a href="index.html">Return to homepage.</a>
            </div>
            
            <div class="toc">
                <h3>TABLE OF CONTENTS</h3>
                <ul>
                    <!-- Table of contents will be generated dynamically via JavaScript -->
                </ul>
            </div>
            
            <div class="categories">
                <h3>CATEGORIES</h3>
                <ul>
                    {categories_html}
                </ul>
            </div>
            
            <div class="toc">
                <h3>RECENT POSTS</h3>
                <ul>
                    {recent_posts_html}
                </ul>
            </div>
        </div>
    </div>

    <script>
        // Generate table of contents and smooth scrolling
        document.addEventListener('DOMContentLoaded', function() {{
            // Add IDs to headings if they don't have them and build TOC.
            const headings = document.querySelectorAll('h1, h2');
            const tocList = document.querySelector('.toc ul');
            headings.forEach(heading => {{
                if (!heading.id) {{
                    heading.id = heading.textContent.toLowerCase().replace(/[^\\w]+/g, '-');
                }}
                let li = document.createElement('li');
                let a = document.createElement('a');
                a.href = '#' + heading.id;
                a.textContent = heading.textContent;
                li.appendChild(a);
                tocList.appendChild(li);
            }});
            
            // Smooth scrolling for TOC links.
            document.querySelectorAll('.toc a').forEach(anchor => {{
                anchor.addEventListener('click', function(e) {{
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {{
                        window.scrollTo({{
                            top: targetElement.offsetTop - 20,
                            behavior: 'smooth'
                        }});
                        history.pushState(null, null, targetId);
                    }}
                }});
            }});
            
            // Back button functionality.
            document.querySelectorAll('.back-button').forEach(btn => {{
                btn.addEventListener('click', function(e) {{
                    e.preventDefault();
                    window.scrollTo({{
                        top: 0,
                        behavior: 'smooth'
                    }});
                }});
            }});
        }});
    </script>
</body>
</html>"""

# Write the generated HTML to index.html.
with open('blog.html', 'w', encoding='utf-8') as f:
    f.write(template)

print("blog.html has been generated successfully.")
