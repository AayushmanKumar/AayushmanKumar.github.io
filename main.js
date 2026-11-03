// Pure Vanilla JavaScript Controller - Aayushman Kumar Portfolio
const STORAGE_THEME = 'theme';
const STORAGE_PERFORMANCE = 'performance-mode';
const STORAGE_VIEW = 'view-mode';
const STORAGE_TAB = 'active-tab';
const STORAGE_ORDER = 'projects-grid-order-v2';

// -----------------------------------------------------------------------------
// 1. Theme Management (Light / Dark)
// -----------------------------------------------------------------------------
function getInitialTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') {
        return themeParam;
    }
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    // Check system preference first; fallback to dark theme
    if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'dark';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
        document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_THEME, theme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const nextTheme = theme === 'light' ? 'Dark' : 'Light';
        toggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} Theme`);
        toggleBtn.setAttribute('title', `Switch to ${nextTheme} Theme`);
    }
}

// -----------------------------------------------------------------------------
// 2. Performance / Contrast Management (Full / Low Saturation)
// -----------------------------------------------------------------------------
function getInitialPerformance() {
    const saved = localStorage.getItem(STORAGE_PERFORMANCE);
    if (saved === 'full' || saved === 'power-saver') {
        return saved;
    }
    return 'full'; // Default: full contrast
}

function applyPerformance(mode) {
    document.documentElement.setAttribute('data-performance', mode);
    if (document.body) {
        document.body.setAttribute('data-performance', mode);
    }
    localStorage.setItem(STORAGE_PERFORMANCE, mode);

    const perfBtn = document.getElementById('performance-toggle');
    if (perfBtn) {
        const nextMode = mode === 'full' ? 'Low Saturation' : 'Full Saturation';
        perfBtn.setAttribute('aria-label', `Switch to ${nextMode} Mode`);
        perfBtn.setAttribute('title', `Switch to ${nextMode} Mode`);
    }
}

// -----------------------------------------------------------------------------
// 3. View Mode Management (Grid / List)
// -----------------------------------------------------------------------------
function getInitialViewMode() {
    const saved = localStorage.getItem(STORAGE_VIEW);
    if (saved === 'grid' || saved === 'list') {
        return saved;
    }
    return 'grid';
}

function applyViewMode(view) {
    document.documentElement.setAttribute('data-view', view);
    localStorage.setItem(STORAGE_VIEW, view);

    const container = document.getElementById('projects-container');
    if (container) {
        if (view === 'grid') {
            container.classList.add('projects-grid');
            container.classList.remove('projects-list');
        } else {
            container.classList.add('projects-list');
            container.classList.remove('projects-grid');
        }
    }

    const viewBtn = document.getElementById('view-mode-toggle');
    if (viewBtn) {
        const nextView = view === 'grid' ? 'List' : 'Grid';
        viewBtn.setAttribute('aria-label', `Switch to ${nextView} View`);
        viewBtn.setAttribute('title', `Switch to ${nextView} View`);
    }
}

// -----------------------------------------------------------------------------
// 4. Centre Navigation Tabs (Projects vs About - In-Place Seamless Switch)
// -----------------------------------------------------------------------------
function switchTab(activeTab) {
    if (currentOpenProjectId) {
        closeProject(false);
    }
    const tabProjects = document.getElementById('tab-projects');
    const tabAbout = document.getElementById('tab-about');
    const projectsContainer = document.getElementById('projects-container');
    const aboutSection = document.getElementById('about-section');
    const viewBtn = document.getElementById('view-mode-toggle');

    if (activeTab === 'about') {
        if (tabAbout) {
            tabAbout.classList.add('category-btn--active');
            tabAbout.setAttribute('aria-selected', 'true');
        }
        if (tabProjects) {
            tabProjects.classList.remove('category-btn--active');
            tabProjects.setAttribute('aria-selected', 'false');
        }
        if (projectsContainer) projectsContainer.style.display = 'none';
        if (aboutSection) aboutSection.removeAttribute('hidden');
        if (viewBtn) viewBtn.style.display = 'none';
    } else {
        if (tabProjects) {
            tabProjects.classList.add('category-btn--active');
            tabProjects.setAttribute('aria-selected', 'true');
        }
        if (tabAbout) {
            tabAbout.classList.remove('category-btn--active');
            tabAbout.setAttribute('aria-selected', 'false');
        }
        if (aboutSection) aboutSection.setAttribute('hidden', '');
        if (projectsContainer) projectsContainer.style.display = '';
        if (viewBtn) viewBtn.style.display = '';
    }

    // Clean any lingering hash fragment from URL
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    localStorage.setItem(STORAGE_TAB, activeTab);
}

function setupTabs() {
    const tabProjects = document.getElementById('tab-projects');
    const tabAbout = document.getElementById('tab-about');

    if (tabProjects) {
        tabProjects.addEventListener('click', () => switchTab('projects'));
    }
    if (tabAbout) {
        tabAbout.addEventListener('click', () => switchTab('about'));
    }

    const hash = window.location.hash;
    if (hash && hash.startsWith('#project/')) {
        return; // Handled directly by handleInitialRoute
    }
    const initialTab = hash === '#about' ? 'about' : (localStorage.getItem(STORAGE_TAB) || 'projects');
    switchTab(initialTab);
}

// -----------------------------------------------------------------------------
// 5. Interactive Draggable Grid with FLIP Displacement
// -----------------------------------------------------------------------------
function setupDraggableGrid() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Restore saved card order if available
    const savedOrder = localStorage.getItem(STORAGE_ORDER);
    if (savedOrder) {
        try {
            const orderIds = JSON.parse(savedOrder);
            orderIds.forEach(id => {
                const card = container.querySelector(`[data-id="${id}"]`);
                if (card) container.appendChild(card);
            });
        } catch (e) {
            console.error('Error loading saved card order', e);
        }
    }

    function saveOrder() {
        const currentCards = Array.from(container.querySelectorAll('.project-card:not(.drop-placeholder)'));
        const orderIds = currentCards.map(c => c.getAttribute('data-id')).filter(Boolean);
        localStorage.setItem(STORAGE_ORDER, JSON.stringify(orderIds));
    }

    let activeCard = null;
    let activePointerId = null;
    let placeholder = null;
    let startX = 0;
    let startY = 0;
    let initialRect = null;
    let isDragging = false;
    let lastSwapTime = 0;

    // Smooth FLIP displacement for surrounding tiles
    function animateFLIP(mutateDOM) {
        const otherCards = Array.from(container.children).filter(el => el !== activeCard);
        const firstPositions = new Map();
        otherCards.forEach(card => {
            firstPositions.set(card, card.getBoundingClientRect());
        });

        mutateDOM();

        otherCards.forEach(card => {
            const first = firstPositions.get(card);
            const last = card.getBoundingClientRect();
            if (!first) return;
            const dx = first.left - last.left;
            const dy = first.top - last.top;
            if (dx !== 0 || dy !== 0) {
                card.style.transform = `translate(${dx}px, ${dy}px)`;
                card.style.transition = 'none';
                requestAnimationFrame(() => {
                    card.style.transition = 'transform 0.22s cubic-bezier(0.2, 0, 0, 1)';
                    card.style.transform = '';
                });
            }
        });
    }

    container.addEventListener('pointerdown', (e) => {
        if (e.target.closest('a, button, input')) return;
        
        const card = e.target.closest('.project-card');
        if (!card || card.classList.contains('drop-placeholder')) return;

        e.preventDefault();
        activeCard = card;
        activePointerId = e.pointerId;
        try {
            card.setPointerCapture(e.pointerId);
        } catch (err) {}

        startX = e.clientX;
        startY = e.clientY;
        initialRect = card.getBoundingClientRect();
        isDragging = false;
    });

    window.addEventListener('pointermove', (e) => {
        if (!activeCard) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // 6px threshold to distinguish click from drag
        if (!isDragging) {
            if (Math.hypot(deltaX, deltaY) > 6) {
                isDragging = true;

                // Release pointer capture so elementsUnder and hover state work smoothly
                try {
                    if (activePointerId !== null && activeCard.hasPointerCapture(activePointerId)) {
                        activeCard.releasePointerCapture(activePointerId);
                    }
                } catch (err) {}

                // Create placeholder holding the exact slot in grid
                placeholder = document.createElement('div');
                const tileMetric = activeCard.getAttribute('data-tile') || (activeCard.classList.contains('project-card--featured') ? '1x2' : '1x1');
                placeholder.className = 'project-card drop-placeholder' + 
                    (tileMetric === '1x2' || activeCard.classList.contains('project-card--featured') ? ' project-card--featured' : '');
                placeholder.setAttribute('data-tile', tileMetric);
                placeholder.style.height = `${initialRect.height}px`;

                activeCard.after(placeholder);

                // Elevate activeCard to floating layer
                activeCard.classList.add('is-floating');
                activeCard.style.width = `${initialRect.width}px`;
                activeCard.style.height = `${initialRect.height}px`;
                activeCard.style.left = `${initialRect.left}px`;
                activeCard.style.top = `${initialRect.top}px`;
            } else {
                return;
            }
        }

        // Float card with cursor
        const currentLeft = initialRect.left + deltaX;
        const currentTop = initialRect.top + deltaY;
        activeCard.style.left = `${currentLeft}px`;
        activeCard.style.top = `${currentTop}px`;

        // Auto-scroll when dragging near viewport edges
        const scrollMargin = 50;
        const scrollSpeed = 10;
        if (e.clientY < scrollMargin) {
            window.scrollBy({ top: -scrollSpeed, behavior: 'instant' });
        } else if (window.innerHeight - e.clientY < scrollMargin) {
            window.scrollBy({ top: scrollSpeed, behavior: 'instant' });
        }

        // Stability check: if pointer is directly over current placeholder, do not swap
        if (placeholder) {
            const phRect = placeholder.getBoundingClientRect();
            if (e.clientX >= phRect.left && e.clientX <= phRect.right &&
                e.clientY >= phRect.top && e.clientY <= phRect.bottom) {
                return;
            }
        }

        // Throttle swap calculations
        const now = performance.now();
        if (now - lastSwapTime < 50) return;

        // Candidate cards in container
        const candidateCards = Array.from(container.children).filter(el => 
            el.classList.contains('project-card') && 
            el !== activeCard && 
            el !== placeholder
        );
        if (candidateCards.length === 0) return;

        let bestCard = null;

        // 1. Direct hit check under pointer
        const elementsUnder = document.elementsFromPoint(e.clientX, e.clientY);
        for (const el of elementsUnder) {
            const card = el.closest('.project-card');
            if (card && card !== activeCard && card !== placeholder && card.parentElement === container) {
                bestCard = card;
                break;
            }
        }

        // 2. Proximity/overlap check for wide tiles or boundary drags
        if (!bestCard) {
            const dragRect = {
                left: currentLeft,
                top: currentTop,
                right: currentLeft + initialRect.width,
                bottom: currentTop + initialRect.height,
                width: initialRect.width,
                height: initialRect.height
            };
            const dragCenterX = currentLeft + initialRect.width / 2;
            const dragCenterY = currentTop + initialRect.height / 2;
            let minDistance = Infinity;

            for (const card of candidateCards) {
                const r = card.getBoundingClientRect();
                const cardCenterX = r.left + r.width / 2;
                const cardCenterY = r.top + r.height / 2;
                const dist = Math.hypot(dragCenterX - cardCenterX, dragCenterY - cardCenterY);

                const overlapW = Math.max(0, Math.min(dragRect.right, r.right) - Math.max(dragRect.left, r.left));
                const overlapH = Math.max(0, Math.min(dragRect.bottom, r.bottom) - Math.max(dragRect.top, r.top));
                const overlapArea = overlapW * overlapH;

                if (overlapArea > 0) {
                    const ratio = Math.max(
                        overlapArea / (r.width * r.height),
                        overlapArea / (dragRect.width * dragRect.height)
                    );
                    if (ratio > 0.2 && dist < minDistance) {
                        minDistance = dist;
                        bestCard = card;
                    }
                }
            }
        }

        if (bestCard) {
            const isFeatured = container.classList.contains('projects-grid') && 
                               (bestCard.getAttribute('data-tile') === '1x2' || bestCard.classList.contains('project-card--featured')) && 
                               window.innerWidth > 768;

            if (isFeatured) {
                const r = bestCard.getBoundingClientRect();
                const midX = r.left + r.width / 2;
                if (e.clientX < midX) {
                    if (bestCard.previousElementSibling !== placeholder) {
                        lastSwapTime = now;
                        animateFLIP(() => {
                            bestCard.before(placeholder);
                        });
                    }
                } else {
                    if (bestCard.nextElementSibling !== placeholder) {
                        lastSwapTime = now;
                        animateFLIP(() => {
                            bestCard.after(placeholder);
                        });
                    }
                }
            } else {
                const allChildren = Array.from(container.children).filter(el => el !== activeCard);
                const placeholderIndex = allChildren.indexOf(placeholder);
                const targetIndex = allChildren.indexOf(bestCard);

                if (targetIndex !== -1 && placeholderIndex !== -1 && targetIndex !== placeholderIndex) {
                    lastSwapTime = now;
                    animateFLIP(() => {
                        if (targetIndex > placeholderIndex) {
                            bestCard.after(placeholder);
                        } else {
                            bestCard.before(placeholder);
                        }
                    });
                }
            }
        }
    });

    function finishDrag() {
        if (!activeCard) return;

        if (activePointerId !== null) {
            try {
                if (activeCard.hasPointerCapture(activePointerId)) {
                    activeCard.releasePointerCapture(activePointerId);
                }
            } catch (err) {}
            activePointerId = null;
        }

        if (isDragging && placeholder) {
            const targetRect = placeholder.getBoundingClientRect();
            activeCard.style.transition = 'left 0.2s cubic-bezier(0.2, 0, 0, 1), top 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
            activeCard.style.left = `${targetRect.left}px`;
            activeCard.style.top = `${targetRect.top}px`;
            activeCard.style.transform = 'scale(1)';

            const droppedCard = activeCard;
            const droppedPlaceholder = placeholder;
            activeCard = null;
            placeholder = null;
            isDragging = false;

            setTimeout(() => {
                if (droppedPlaceholder && droppedPlaceholder.parentNode) {
                    droppedPlaceholder.replaceWith(droppedCard);
                }
                droppedCard.classList.remove('is-floating');
                droppedCard.style.width = '';
                droppedCard.style.height = '';
                droppedCard.style.left = '';
                droppedCard.style.top = '';
                droppedCard.style.transform = '';
                droppedCard.style.transition = '';
                saveOrder();
            }, 200);
        } else {
            const clickedCard = activeCard;
            activeCard = null;
            placeholder = null;
            isDragging = false;
            if (clickedCard) {
                const projectId = clickedCard.getAttribute('data-id');
                if (projectId) {
                    navigateToProject(projectId);
                }
            }
        }
    }

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
}

// -----------------------------------------------------------------------------
// 6. Project Data & Frontmatter Parser
// -----------------------------------------------------------------------------
function parseYAML(yamlString) {
    const lines = yamlString.split('\n');
    const result = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) continue;
        const key = trimmed.substring(0, colonIndex).trim();
        let rawValue = trimmed.substring(colonIndex + 1).trim();

        if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
            result[key] = rawValue.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        } else if (rawValue === 'true' || rawValue === 'false') {
            result[key] = rawValue === 'true';
        } else if (!isNaN(Number(rawValue)) && rawValue !== '') {
            result[key] = Number(rawValue);
        } else {
            result[key] = rawValue.replace(/^["']|["']$/g, '');
        }
    }
    return result;
}

function parseMarkdownWithFrontmatter(markdownText) {
    const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
    const match = markdownText.match(frontmatterRegex);
    if (!match) {
        return { frontmatter: {}, content: markdownText };
    }
    const yamlString = match[1];
    const content = match[2];
    const frontmatter = parseYAML(yamlString);
    return { frontmatter, content };
}

async function loadProjectContent(projectId) {
    const fallback = (window.PROJECTS_DATA || []).find(p => p.id === projectId);
    
    // Attempt live fetch from content/projects/${projectId}.md
    try {
        const res = await fetch(`content/projects/${projectId}.md`);
        if (res.ok) {
            const text = await res.text();
            const parsed = parseMarkdownWithFrontmatter(text);
            return {
                ...(fallback || {}),
                ...parsed.frontmatter,
                markdown: parsed.content
            };
        }
    } catch (e) {
        // Fallback to embedded markdown if offline or file:// protocol
    }
    return fallback;
}

function renderMarkdownWithMath(markdownText) {
    if (!markdownText) return '';

    const mathTokens = [];
    // 1. Extract Display Math: $$...$$ or \[...\]
    let processed = markdownText.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        const id = `@@@KATEX_DISPLAY_${mathTokens.length}@@@`;
        mathTokens.push({ type: 'display', math: math.trim() });
        return id;
    });

    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
        const id = `@@@KATEX_DISPLAY_${mathTokens.length}@@@`;
        mathTokens.push({ type: 'display', math: math.trim() });
        return id;
    });

    // 2. Extract Inline Math: $...$ or \(...\)
    processed = processed.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (match, math) => {
        const id = `@@@KATEX_INLINE_${mathTokens.length}@@@`;
        mathTokens.push({ type: 'inline', math: math.trim() });
        return id;
    });

    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (match, math) => {
        const id = `@@@KATEX_INLINE_${mathTokens.length}@@@`;
        mathTokens.push({ type: 'inline', math: math.trim() });
        return id;
    });

    // 3. Parse Markdown using marked
    const parseFn = (typeof marked !== 'undefined' && marked.parse) 
        ? marked.parse 
        : ((typeof window !== 'undefined' && window.marked && window.marked.parse) ? window.marked.parse : null);
    let html = parseFn ? parseFn(processed) : processed;

    // 4. Substitute rendered KaTeX math
    const hasKatex = typeof katex !== 'undefined' && katex.renderToString;

    mathTokens.forEach((token, idx) => {
        const displayPlaceholder = `@@@KATEX_DISPLAY_${idx}@@@`;
        const inlinePlaceholder = `@@@KATEX_INLINE_${idx}@@@`;

        let rendered = '';
        if (hasKatex) {
            try {
                rendered = katex.renderToString(token.math, {
                    displayMode: token.type === 'display',
                    throwOnError: false
                });
            } catch (e) {
                rendered = `<span class="katex-error">${token.math}</span>`;
            }
        } else {
            rendered = token.type === 'display' ? `$$${token.math}$$` : `$${token.math}$`;
        }

        if (token.type === 'display') {
            html = html.replace(`<p>${displayPlaceholder}</p>`, `<div class="math-display">${rendered}</div>`);
            html = html.replace(displayPlaceholder, `<div class="math-display">${rendered}</div>`);
        } else {
            html = html.replace(inlinePlaceholder, rendered);
        }
    });

    return html;
}

let currentOpenProjectId = null;

function getProjectData(projectId) {
    return (window.PROJECTS_DATA || []).find(p => p.id === projectId);
}

function renderProjectDetails(project) {
    // Set Hero Image
    const heroImg = document.getElementById('detail-hero-img');
    if (heroImg) {
        heroImg.src = project.image || '';
        heroImg.alt = project.title || '';
    }

    // Set Meta Links
    const linksContainer = document.getElementById('detail-project-links');
    if (linksContainer) {
        linksContainer.innerHTML = '';
        if (project.liveUrl) {
            const a = document.createElement('a');
            a.href = project.liveUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'project-link';
            a.textContent = project.liveUrlLabel || 'View Live Site';
            linksContainer.appendChild(a);
        }
        if (project.sourceUrl) {
            const a = document.createElement('a');
            a.href = project.sourceUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'project-link';
            a.textContent = project.sourceUrlLabel || 'View Source';
            linksContainer.appendChild(a);
        }
    }

    // Set Tags
    const tagsContainer = document.getElementById('detail-project-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        (project.tags || []).forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    // Render Markdown Content via marked
    const markdownBody = document.getElementById('detail-markdown-body');
    if (markdownBody) {
        const rawMd = project.markdown || '';
        markdownBody.innerHTML = renderMarkdownWithMath(rawMd);

        // Ensure all headings have IDs for Table of Contents
        const headings = markdownBody.querySelectorAll('h1, h2, h3');
        const tocList = document.getElementById('detail-toc-list');
        if (tocList) tocList.innerHTML = '';

        headings.forEach((heading, idx) => {
            let slug = heading.textContent.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
            if (!slug) slug = `section-${idx}`;
            heading.id = slug;

            if (tocList) {
                const li = document.createElement('li');
                const level = parseInt(heading.tagName.replace('H', ''), 10);
                li.className = `toc-level-${level}`;

                const a = document.createElement('a');
                a.href = 'javascript:void(0)';
                a.setAttribute('data-slug', slug);
                a.textContent = heading.textContent;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollToHeading(slug);
                });
                li.appendChild(a);
                tocList.appendChild(li);
            }
        });
    }

    document.title = `${project.title} - Aayushman Kumar`;
}

function navigateToProject(projectId, updateHistory = true) {
    if (currentOpenProjectId === projectId && document.getElementById('project-detail-view') && document.getElementById('project-detail-view').style.display !== 'none') {
        return;
    }
    const project = getProjectData(projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    currentOpenProjectId = projectId;
    document.documentElement.setAttribute('data-is-project', 'true');

    // Hide Projects grid & About section
    const projectsContainer = document.getElementById('projects-container');
    const aboutSection = document.getElementById('about-section');
    const projectDetail = document.getElementById('project-detail-view');
    if (projectsContainer) projectsContainer.style.display = 'none';
    if (aboutSection) aboutSection.setAttribute('hidden', '');
    if (projectDetail) projectDetail.style.display = 'block';

    // Header controls: hide view mode toggle, show Back to Projects, hide tabs
    const viewBtn = document.getElementById('view-mode-toggle');
    const catSwitch = document.getElementById('category-switch');
    const backBtn = document.getElementById('back-to-projects');

    if (viewBtn) viewBtn.style.display = 'none';
    if (catSwitch) catSwitch.style.display = 'none';
    if (backBtn) backBtn.style.display = 'inline-flex';

    // Synchronously render details from embedded data immediately
    renderProjectDetails(project);

    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (updateHistory) {
        history.pushState({ projectId: projectId }, '', window.location.pathname + window.location.search);
    } else {
        history.replaceState({ projectId: projectId }, '', window.location.pathname + window.location.search);
    }

    // Try fetching fresh markdown from content/projects/ in background if supported
    fetch(`content/projects/${projectId}.md`)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
            if (!text) return;
            const parsed = parseMarkdownWithFrontmatter(text);
            const updatedProject = {
                ...project,
                ...parsed.frontmatter,
                markdown: parsed.content
            };
            if (currentOpenProjectId === projectId) {
                renderProjectDetails(updatedProject);
            }
        })
        .catch(() => {});
}

function scrollToHeading(headingId) {
    const el = document.getElementById(headingId);
    if (!el) return;
    const metaBar = document.getElementById('detail-project-meta');
    const metaHeight = metaBar ? metaBar.offsetHeight : 0;
    const headerHeight = 52; // 3.25rem
    const gap = 16;
    const totalOffset = headerHeight + metaHeight + gap;

    const elTop = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
        top: elTop - totalOffset,
        behavior: 'smooth'
    });
}

function closeProject(updateHistory = true) {
    currentOpenProjectId = null;
    document.documentElement.removeAttribute('data-is-project');

    const projectDetail = document.getElementById('project-detail-view');
    if (projectDetail) projectDetail.style.display = 'none';

    // Restore tabs and view mode button
    const catSwitch = document.getElementById('category-switch');
    const backBtn = document.getElementById('back-to-projects');

    if (catSwitch) catSwitch.style.display = 'flex';
    if (backBtn) backBtn.style.display = 'none';

    // Restore active tab properly
    const savedTab = localStorage.getItem(STORAGE_TAB) || 'projects';
    switchTab(savedTab);

    document.title = "Aayushman's Portfolio";
    if (updateHistory) {
        history.replaceState({ projectId: null }, '', window.location.pathname + window.location.search);
    }
}

function handleInitialRoute() {
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/^#project\/(.+)$/);
        if (match) {
            navigateToProject(match[1], false);
        } else if (hash === '#about') {
            switchTab('about');
        }
        // Hide and strip any hash from the URL immediately so the address bar is spotless
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
}

// -----------------------------------------------------------------------------
// Horizontal Linear Progress Timeline (Professional Journey)
// -----------------------------------------------------------------------------
const TIMELINE_DATA = [
    {
        year: "Feb'25",
        company: "Apricity TS",
        role: "Data Analytics",
        title: "Data Analytics Intern",
        dateRange: "Feb’25 - May’25",
        positionPercent: 15,
        bullets: [
            "Architected the TradeTrack quantitative analytical platform to extract trade signals and recommend entry/exit decisions across 1M+ trade execution logs.",
            "Engineered high-throughput RESTful API endpoints using FastAPI and integrated standalone analytics routines into modular LangGraph agentic tool pipelines.",
            "Reduced order failures by 30% through cohort-wise alert systems and latency anomaly detection pipelines."
        ],
        tags: ["Python", "FastAPI", "LangGraph", "Streamlit", "Quantitative Analytics"]
    },
    {
        year: "May'25",
        company: "Invictron Systems",
        role: "Product & Systems",
        title: "Product & Systems Intern",
        dateRange: "May’25 - Present",
        positionPercent: 50,
        bullets: [
            "Architected and implemented JIRA-Outlook integration to mitigate email-driven communication silos, improving task trackability by 80% and cutting processing turnaround time by 10x.",
            "Conducted market behavioral analytics and modeled telemetry pipelines for Indigenous Autonomous Drone Navigation Systems, securing INR 3,500,000 in government innovation grants.",
        ],
        tags: ["Systems Architecture", "JIRA Integration", "Workflow Automation", "Telemetry Analytics"]
    },
    {
        year: "May'26",
        company: "Flipkart",
        role: "SWE Intern",
        title: "Software Engineering Intern",
        dateRange: "May’26 - July’26",
        positionPercent: 85,
        bullets: [
            "Architected an LLM-driven browser test automation framework with Google Gemini Flash & Playwright; built a TreeWalker DOM serialization engine to flatten token overhead and achieved 8-12x faster execution than vision-based alternatives.",
            "Engineered an asynchronous production API incident triage agent using Python asyncio to concurrently fetch Prometheus metrics, Kubernetes pod logs, and Jira history, slashing triage time from 20 minutes to under 30 seconds.",
            "Developed the ELB Response Diff View Console in Java (Dropwizard) and built an order-agnostic semantic JSON diff algorithm matching objects by key and arrays by identity to eliminate deployment verification regressions.",
            "Designed dynamic PromQL latency and traffic observability dashboards in Grafana with P99 auto-aggregations for Java mAPI microservices."
        ],
        tags: ["TypeScript", "Playwright", "Gemini Flash", "Python", "asyncio", "LiteLLM", "Kubernetes", "Prometheus", "Java", "Dropwizard"]
    }
];

function setupHorizontalTimeline() {
    const markersContainer = document.getElementById('timeline-markers');
    const progressBar = document.getElementById('timeline-progress-bar');
    const prevBtn = document.getElementById('timeline-prev-btn');
    const nextBtn = document.getElementById('timeline-next-btn');
    const indicator = document.getElementById('timeline-indicator');
    const jobTitle = document.getElementById('timeline-job-title');
    const companyName = document.getElementById('timeline-company-name');
    const dateRange = document.getElementById('timeline-date-range');
    const bulletsEl = document.getElementById('timeline-bullets');
    const techTagsEl = document.getElementById('timeline-tech-tags');
    const contentCard = document.getElementById('timeline-card');

    if (!markersContainer || !progressBar) return;

    let activeIndex = 2; // Default to Flipkart (latest)

    function renderActiveItem(index, animateCard = true) {
        activeIndex = index;
        const item = TIMELINE_DATA[index];
        if (!item) return;

        // Progress bar width
        progressBar.style.width = `${item.positionPercent}%`;

        // Update markers classes
        const markers = markersContainer.querySelectorAll('.timeline-marker');
        markers.forEach((m, idx) => {
            m.classList.remove('active', 'passed');
            if (idx === index) {
                m.classList.add('active');
                m.setAttribute('aria-expanded', 'true');
            } else if (idx < index) {
                m.classList.add('passed');
                m.setAttribute('aria-expanded', 'false');
            } else {
                m.setAttribute('aria-expanded', 'false');
            }
        });

        // Update nav buttons & indicator
        if (indicator) indicator.textContent = `${index + 1} of ${TIMELINE_DATA.length}`;
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === TIMELINE_DATA.length - 1;

        // Card content update
        if (animateCard && contentCard) {
            contentCard.style.opacity = '0.3';
        }

        setTimeout(() => {
            if (jobTitle) jobTitle.textContent = item.title;
            if (companyName) companyName.textContent = item.company;
            if (dateRange) dateRange.textContent = item.dateRange;

            if (bulletsEl) {
                bulletsEl.innerHTML = item.bullets.map(b => `<li>${b}</li>`).join('');
            }
            if (techTagsEl) {
                techTagsEl.innerHTML = item.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
            }

            if (animateCard && contentCard) {
                contentCard.style.opacity = '1';
            }
        }, animateCard ? 100 : 0);
    }

    // Attach marker clicks and keyboard
    const markerButtons = markersContainer.querySelectorAll('.timeline-marker');
    markerButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => renderActiveItem(idx));
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && idx > 0) {
                e.preventDefault();
                markerButtons[idx - 1].focus();
                renderActiveItem(idx - 1);
            } else if (e.key === 'ArrowRight' && idx < markerButtons.length - 1) {
                e.preventDefault();
                markerButtons[idx + 1].focus();
                renderActiveItem(idx + 1);
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (activeIndex > 0) renderActiveItem(activeIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (activeIndex < TIMELINE_DATA.length - 1) renderActiveItem(activeIndex + 1);
        });
    }

    renderActiveItem(activeIndex, false);
}

// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------
function initApp() {
    let currentTheme = getInitialTheme();
    applyTheme(currentTheme);

    let currentPerformance = getInitialPerformance();
    applyPerformance(currentPerformance);

    let currentView = getInitialViewMode();
    applyViewMode(currentView);

    setupTabs();
    setupDraggableGrid();
    setupHorizontalTimeline();

    // Back to Projects button listener
    const backBtn = document.getElementById('back-to-projects');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeProject();
        });
    }

    // Brand logo & name click listener (Goes to Home / Projects)
    function navigateToHome() {
        if (currentOpenProjectId) {
            closeProject(false);
        }
        switchTab('projects');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState({ projectId: null }, '', window.location.pathname + window.location.search);
    }

    const brandLink = document.getElementById('brand-logo-link');
    if (brandLink) {
        brandLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToHome();
        });
    }

    // HTML5 Popstate Navigation (handles Browser Back / Forward without URL hash fragments)
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.projectId) {
            navigateToProject(e.state.projectId, false);
        } else if (currentOpenProjectId) {
            closeProject(false);
        }
    });

    handleInitialRoute();

    // Scroll listener for active TOC item
    window.addEventListener('scroll', () => {
        if (!currentOpenProjectId) return;
        const markdownBody = document.getElementById('detail-markdown-body');
        if (markdownBody) {
            const headings = Array.from(markdownBody.querySelectorAll('h1, h2, h3'));
            const scrollPos = window.scrollY + 140;
            let activeId = null;

            for (const h of headings) {
                if (h.offsetTop <= scrollPos) {
                    activeId = h.id;
                } else {
                    break;
                }
            }

            const tocLinks = document.querySelectorAll('#detail-toc-list a');
            tocLinks.forEach(link => {
                if (link.getAttribute('data-slug') === activeId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }, { passive: true });

    // Theme Toggle Handler
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(currentTheme);
        });
    }

    // Saturation / Contrast Toggle Handler
    const perfBtn = document.getElementById('performance-toggle');
    if (perfBtn) {
        perfBtn.addEventListener('click', () => {
            currentPerformance = currentPerformance === 'full' ? 'power-saver' : 'full';
            applyPerformance(currentPerformance);
        });
    }

    // View Mode Toggle Handler
    const viewBtn = document.getElementById('view-mode-toggle');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            currentView = currentView === 'grid' ? 'list' : 'grid';
            applyViewMode(currentView);
        });
    }

    // OS Theme listener
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_THEME)) {
                currentTheme = e.matches ? 'dark' : 'light';
                applyTheme(currentTheme);
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
