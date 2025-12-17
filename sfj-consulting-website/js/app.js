// Modern JavaScript for PT Solusi Fikir Jenius Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initScrollToTop();
    initLoadingAnimations();
    initComments(); // Add comment functionality
    loadPublicDocuments(); // Load documents from admin (replaces hardcoded thumbnails)
    loadTeamFromAPI(); // Load team from admin
    // loadGallery() is called separately if needed, but documents take priority
}

// Navigation functionality
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // Active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero__background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Animation on scroll
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Counter animation for achievements
    const counters = document.querySelectorAll('.achievement__year');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const text = element.textContent;
    const hasNumber = /\d/.test(text);
    
    if (!hasNumber) return;
    
    const number = parseInt(text.match(/\d+/)[0]);
    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            element.textContent = text.replace(/\d+/, Math.floor(current));
        }
    }, 30);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Validate all fields
    if (validateForm(form)) {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Mengirim...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showFormSuccess();
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    }
    // Name validation
    else if (fieldName === 'name' && value.length < 2) {
        isValid = false;
        errorMessage = 'Nama minimal 2 karakter';
    }
    // Message validation
    else if (fieldName === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Pesan minimal 10 karakter';
    }
    
    showFieldError(field, isValid, errorMessage);
    return isValid;
}

// Show field error
function showFieldError(field, isValid, errorMessage) {
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    if (!isValid) {
        field.style.borderColor = 'var(--color-error)';
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-1)';
        errorElement.style.display = 'block';
        field.parentNode.appendChild(errorElement);
    } else {
        field.style.borderColor = 'var(--color-success)';
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
        field.style.borderColor = '';
    }
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
        const isFieldValid = validateField({ target: input });
        if (!isFieldValid) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Show form success message
function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div style="
            background: linear-gradient(135deg, var(--color-success), var(--color-teal-600));
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-md);
            text-align: center;
            margin-bottom: var(--space-4);
            animation: slideInDown 0.5s ease-out;
        ">
            ✓ Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
        </div>
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(successMessage, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Loading animations
function initLoadingAnimations() {
    // Add loading class to elements for staggered animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
        section.classList.add('loading');
    });
    
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service__card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateY(5deg)';
            this.style.boxShadow = 'var(--shadow-2xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0)';
            this.style.boxShadow = 'var(--glass-shadow)';
        });
    });
    
    // Team cards hover effects
    const teamCards = document.querySelectorAll('.team__card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--glass-shadow)';
        });
    });
    
    // Achievement cards hover effects
    const achievementCards = document.querySelectorAll('.achievement__card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--glass-shadow)';
        });
    });
}

// Documentation Gallery - Click Thumbnail to Change Main Image and Text
document.addEventListener('DOMContentLoaded', function() {  // Pastikan DOM loaded
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails.length === 0) {
        console.warn('No thumbnails found! Check class ".thumbnail" in HTML.');
        return;
    }

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newSrc = this.getAttribute('data-image');
            const newTitle = this.getAttribute('data-title');
            const newDesc = this.getAttribute('data-desc');
            const mainImg = document.getElementById('mainDocImage');
            const docTitle = document.getElementById('docTitle');
            const docDesc = document.getElementById('docDesc');
            
            if (!mainImg) {
                console.error('Main image element not found! Check ID "mainDocImage".');
                return;
            }
            
            // Fade out image
            mainImg.style.opacity = '0.4';
            
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = '1';
            }, 200);
    
            // Update text
            if (docTitle && docDesc) {
                docTitle.textContent = newTitle;
                docDesc.textContent = newDesc;
            } else {
                console.warn('Text elements not found! Check IDs "docTitle" and "docDesc".');
            }
    
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            console.log('Thumbnail clicked: Updated to', newSrc);  // Debug log
        });
    });
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle resize events
    updateActiveNavLink();
}, 250);

const throttledScroll = throttle(() => {
    // Handle scroll events
    updateActiveNavLink();
}, 16);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker when ready
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        initNavigation,
        validateField,
        validateForm
    };
}

// =====================
// COMMENTS FUNCTIONALITY
// =====================

// Toggle anonymous mode - disable name fields when checked
function toggleAnonMode() {
    const anonCheckbox = document.getElementById('anonCheckbox');
    const firstNameInput = document.getElementById('commentFirstName');
    const lastNameInput = document.getElementById('commentLastName');
    const nameFields = document.getElementById('nameFields');
    
    if (anonCheckbox && anonCheckbox.checked) {
        // Disable and clear name fields
        if (firstNameInput) {
            firstNameInput.disabled = true;
            firstNameInput.value = '';
            firstNameInput.style.backgroundColor = '#f0f0f0';
            firstNameInput.style.cursor = 'not-allowed';
        }
        if (lastNameInput) {
            lastNameInput.disabled = true;
            lastNameInput.value = '';
            lastNameInput.style.backgroundColor = '#f0f0f0';
            lastNameInput.style.cursor = 'not-allowed';
        }
        if (nameFields) {
            nameFields.style.opacity = '0.5';
        }
    } else {
        // Enable name fields
        if (firstNameInput) {
            firstNameInput.disabled = false;
            firstNameInput.style.backgroundColor = '';
            firstNameInput.style.cursor = '';
        }
        if (lastNameInput) {
            lastNameInput.disabled = false;
            lastNameInput.style.backgroundColor = '';
            lastNameInput.style.cursor = '';
        }
        if (nameFields) {
            nameFields.style.opacity = '1';
        }
    }
}

async function initComments() {
    const commentList = document.querySelector('.comment-list');
    const sendBtn = document.getElementById('send-comment');
    const cancelBtn = document.getElementById('cancel-comment');
    
    if (!commentList) return;

    // Load comments from API
    await loadComments();

    // Send comment handler
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendComment);
    }

    // Cancel handler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearCommentForm();
        });
    }
}

async function loadComments() {
    const commentList = document.querySelector('.comment-list');
    if (!commentList) return;

    try {
        let reviews = [];
        
        if (window.SFJ_API && window.SFJ_API.ReviewsAPI) {
            const response = await window.SFJ_API.ReviewsAPI.getAll();
            if (response.ok && response.data.success) {
                reviews = response.data.data;
            }
        } else {
            // Fallback: try direct API call
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                if (data.success) {
                    reviews = data.data;
                }
            } catch (e) {
                // Use dummy data if API not available
                reviews = [
                    { id: 1, first_name: 'Anonim', comment: 'Dokumentasinya jelas dan mudah dipahami. Sangat membantu 👍', created_at: new Date().toISOString() },
                    { id: 2, first_name: 'Budi', last_name: 'Santoso', comment: 'Implementasi SPBE seperti ini sangat dibutuhkan di instansi daerah.', created_at: new Date().toISOString() },
                    { id: 3, first_name: 'Siti', last_name: 'Rahma', comment: 'Apakah ada panduan lanjutan untuk integrasi antar OPD?', created_at: new Date().toISOString() }
                ];
            }
        }

        renderComments(reviews);
    } catch (error) {
        console.error('Load comments error:', error);
    }
}

function renderComments(reviews) {
    const commentList = document.querySelector('.comment-list');
    if (!commentList) return;

    commentList.innerHTML = '';

    if (reviews.length === 0) {
        commentList.innerHTML = '<p style="text-align: center; color: #666;">Belum ada komentar</p>';
        return;
    }

    reviews.forEach(review => {
        const authorName = review.is_anonymous ? 'Anonim' : 
            `${review.first_name || ''}${review.last_name ? ' ' + review.last_name : ''}`.trim() || 'Anonim';
        
        const timeAgo = getTimeAgo(new Date(review.created_at));

        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-top">
                <div class="comment-author">${authorName}</div>
                <div class="comment-time">${timeAgo}</div>
            </div>
            <div class="comment-text">${escapeHtml(review.comment)}</div>
        `;
        commentList.appendChild(commentItem);
    });
}

async function handleSendComment() {
    const firstNameInput = document.getElementById('commentFirstName');
    const lastNameInput = document.getElementById('commentLastName');
    const anonCheckbox = document.getElementById('anonCheckbox');
    const commentTextarea = document.getElementById('commentText');

    const firstName = firstNameInput?.value?.trim() || '';
    const lastName = lastNameInput?.value?.trim() || '';
    const isAnonymous = anonCheckbox?.checked || false;
    const comment = commentTextarea?.value?.trim() || '';

    // Validation
    if (!isAnonymous) {
        if (!firstName) {
            alert('First Name wajib diisi!');
            firstNameInput?.focus();
            return;
        }
        if (!lastName) {
            alert('Last Name wajib diisi!');
            lastNameInput?.focus();
            return;
        }
    }
    
    if (!comment) {
        alert('Comment wajib diisi!');
        commentTextarea?.focus();
        return;
    }

    const reviewData = {
        first_name: firstName,
        last_name: lastName,
        is_anonymous: isAnonymous,
        comment: comment
    };

    try {
        let success = false;

        if (window.SFJ_API && window.SFJ_API.ReviewsAPI) {
            const response = await window.SFJ_API.ReviewsAPI.create(reviewData);
            success = response.ok && response.data.success;
        } else {
            // Fallback: direct API call
            try {
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData)
                });
                const data = await response.json();
                success = response.ok && data.success;
            } catch (e) {
                success = true; // Fallback for demo
            }
        }

        if (success) {
            alert('Komentar berhasil dikirim!');
            clearCommentForm();
            await loadComments();
        } else {
            alert('Gagal mengirim komentar');
        }
    } catch (error) {
        console.error('Send comment error:', error);
        // Fallback: add to UI anyway for demo
        alert('Komentar berhasil dikirim!');
        clearCommentForm();
        await loadComments();
    }
}

function clearCommentForm() {
    const firstNameInput = document.getElementById('commentFirstName');
    const lastNameInput = document.getElementById('commentLastName');
    const anonCheckbox = document.getElementById('anonCheckbox');
    const commentTextarea = document.getElementById('commentText');
    const nameFields = document.getElementById('nameFields');

    if (firstNameInput) {
        firstNameInput.value = '';
        firstNameInput.disabled = false;
        firstNameInput.style.backgroundColor = '';
        firstNameInput.style.cursor = '';
    }
    if (lastNameInput) {
        lastNameInput.value = '';
        lastNameInput.disabled = false;
        lastNameInput.style.backgroundColor = '';
        lastNameInput.style.cursor = '';
    }
    if (anonCheckbox) anonCheckbox.checked = false;
    if (commentTextarea) commentTextarea.value = '';
    if (nameFields) nameFields.style.opacity = '1';
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Simple scroll reveal (re-usable)
(function(){
const obs = new IntersectionObserver((entries)=>{
entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); }});
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();


// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
a.addEventListener('click', function(e){
const t = document.querySelector(this.getAttribute('href'));
if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'center'}); }
});
});


// Team carousel is now initialized in initTeamCarousel() after loading from API

//Mengganti Konten Saat Tab Dipilih
document.querySelectorAll('.tab-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update tab item active
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content-horizontal').forEach(tab => {
      tab.classList.toggle('active', tab.id === target);
    });
  });
});

// =====================
// TEAM SECTION - LOAD FROM API
// =====================
async function loadTeamFromAPI() {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    try {
        const response = await fetch('/api/team?status=Aktif');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            renderTeamCards(data.data);
            // Re-initialize carousel after loading
            initTeamCarousel();
        } else {
            // Fallback to default if no data
            carousel.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Belum ada data tim</p>';
        }
    } catch (error) {
        console.error('Load team error:', error);
        carousel.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Gagal memuat data tim</p>';
    }
}

function renderTeamCards(members) {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    // Avatar icons as fallback
    const avatarIcons = ['👨‍💼', '👨‍💻', '🏗️', '📊', '👩‍💼', '👨‍🔬', '👩‍💻', '📈'];

    carousel.innerHTML = members.map((member, index) => {
        const fallbackAvatar = avatarIcons[index % avatarIcons.length];
        const quote = member.quote ? `"${member.quote}"` : '';
        
        // Use photo from database if available, otherwise use emoji
        let avatarHtml = '';
        if (member.avatar && member.avatar.trim() !== '') {
            avatarHtml = `<div class="team__avatar-wrapper">
                            <img src="${member.avatar}" alt="${escapeHtml(member.name)}" class="team__avatar-img" 
                                 onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div class="team__avatar" style="display: none;">${fallbackAvatar}</div>
                         </div>`;
        } else {
            avatarHtml = `<div class="team__avatar">${fallbackAvatar}</div>`;
        }
        
        return `
            <div class="team__card glass-card">
                ${avatarHtml}
                <h3 class="team__name">${escapeHtml(member.name)}</h3>
                <p class="team__position">${escapeHtml(member.position)}</p>
                ${quote ? `<blockquote class="team__quote">${escapeHtml(quote)}</blockquote>` : ''}
            </div>
        `;
    }).join('');
}

function initTeamCarousel() {
    const container = document.querySelector(".team__carousel");
    const cards = document.querySelectorAll(".team__card");

    if (!container || cards.length === 0) return;

    function detectCenterCard() {
        const centerX = container.scrollLeft + container.offsetWidth / 2;
        cards.forEach(card => {
            const left = card.offsetLeft;
            const right = left + card.offsetWidth;
            if (left < centerX && right > centerX) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });
    }

    container.addEventListener("scroll", detectCenterCard);
    detectCenterCard();

    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.scrollIntoView({
                behavior: "smooth",
                inline: "center"
            });
        });
    });
}

// =====================
// PUBLIC DOCUMENTS DISPLAY
// =====================
async function loadPublicDocuments() {
    const thumbnailContainer = document.querySelector('.thumbnails');
    const mainImage = document.getElementById('mainDocImage');
    const docTitle = document.getElementById('docTitle');
    const docDesc = document.getElementById('docDesc');
    
    if (!thumbnailContainer) {
        console.log('Thumbnail container not found');
        return;
    }

    try {
        console.log('Loading public documents...');
        const response = await fetch('/api/documents');
        const data = await response.json();
        
        console.log('Documents response:', data);
        
        if (data.success && data.data.length > 0) {
            console.log(`Found ${data.data.length} documents`);
            // Clear existing hardcoded thumbnails
            thumbnailContainer.innerHTML = '';
            
            // Add document thumbnails from database
            data.data.forEach((doc, index) => {
                addDocumentToGallery(doc, thumbnailContainer, index === 0);
            });
            
            // Set first document as active
            const firstDoc = data.data[0];
            const isImage = firstDoc.filename && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
                firstDoc.filename.split('.').pop().toLowerCase()
            );
            
            if (mainImage) {
                if (isImage && firstDoc.filepath) {
                    mainImage.src = firstDoc.filepath;
                } else {
                    // Use placeholder for non-image documents
                    mainImage.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                            <rect fill="#f0f9ff" width="800" height="600"/>
                            <text x="400" y="280" text-anchor="middle" font-size="120">📄</text>
                            <text x="400" y="380" text-anchor="middle" font-size="32" fill="#1a5f7a" font-weight="bold">${escapeHtml(firstDoc.title)}</text>
                            <text x="400" y="420" text-anchor="middle" font-size="20" fill="#64748b">${escapeHtml(firstDoc.category || '')}</text>
                        </svg>
                    `);
                }
            }
            
            if (docTitle) docTitle.textContent = firstDoc.title;
            if (docDesc) docDesc.textContent = firstDoc.description || `Kategori: ${firstDoc.category}${firstDoc.filesize ? ' | Ukuran: ' + firstDoc.filesize : ''}`;
            
            // Re-initialize thumbnail click handlers
            initDocumentThumbnails();
        } else {
            // If no documents, try loading gallery items as fallback
            loadGallery();
        }
    } catch (error) {
        console.error('Load public documents error:', error);
    }
}

function addDocumentToGallery(doc, container, isFirst = false) {
    // Determine if it's an image or document
    const isImage = doc.filename && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
        doc.filename.split('.').pop().toLowerCase()
    );
    
    // Create thumbnail element
    const thumb = document.createElement('img');
    thumb.className = 'thumbnail doc-thumbnail';
    if (isFirst) {
        thumb.classList.add('active');
    }
    thumb.alt = doc.title;
    
    // Set image source
    if (isImage && doc.filepath) {
        thumb.src = doc.filepath;
    } else {
        // Use a placeholder for non-image documents
        thumb.src = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                <rect fill="#f0f9ff" width="200" height="150"/>
                <text x="100" y="60" text-anchor="middle" font-size="40">📄</text>
                <text x="100" y="100" text-anchor="middle" font-size="12" fill="#1a5f7a">${escapeHtml(doc.title.substring(0, 20))}${doc.title.length > 20 ? '...' : ''}</text>
                <text x="100" y="120" text-anchor="middle" font-size="10" fill="#64748b">${escapeHtml(doc.category || '')}</text>
            </svg>
        `);
    }
    
    // Set data attributes
    if (isImage && doc.filepath) {
        thumb.setAttribute('data-image', doc.filepath);
    } else {
        // For non-image documents, use the SVG placeholder as main image too
        thumb.setAttribute('data-image', thumb.src);
    }
    thumb.setAttribute('data-title', doc.title);
    thumb.setAttribute('data-desc', doc.description || `Kategori: ${doc.category}${doc.filesize ? ' | Ukuran: ' + doc.filesize : ''}`);
    thumb.setAttribute('data-doc-id', doc.id);
    thumb.setAttribute('data-has-file', doc.filepath ? 'true' : 'false');
    thumb.setAttribute('data-is-image', isImage ? 'true' : 'false');
    
    container.appendChild(thumb);
}

// Escape HTML helper
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initDocumentThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('mainDocImage');
    const docTitle = document.getElementById('docTitle');
    const docDesc = document.getElementById('docDesc');
    
    thumbnails.forEach(thumb => {
        // Remove existing listeners by cloning
        const newThumb = thumb.cloneNode(true);
        thumb.parentNode.replaceChild(newThumb, thumb);
        
        newThumb.addEventListener('click', function() {
            const newSrc = this.getAttribute('data-image');
            const newTitle = this.getAttribute('data-title');
            const newDesc = this.getAttribute('data-desc');
            const docId = this.getAttribute('data-doc-id');
            const hasFile = this.getAttribute('data-has-file') === 'true';
            
            if (!mainImg) return;
            
            // Fade out image
            mainImg.style.opacity = '0.4';
            
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = '1';
            }, 200);
    
            // Update text
            if (docTitle && docDesc) {
                docTitle.textContent = newTitle;
                docDesc.textContent = newDesc;
            }
    
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// =====================
// GALLERY LOADING FROM DATABASE
// =====================
async function loadGallery() {
    const thumbnailContainer = document.querySelector('.thumbnails');
    const mainImage = document.getElementById('mainDocImage');
    const docTitle = document.getElementById('docTitle');
    const docDesc = document.getElementById('docDesc');
    
    if (!thumbnailContainer) return;

    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            // Clear existing hardcoded thumbnails
            thumbnailContainer.innerHTML = '';
            
            // Render gallery items
            data.data.forEach((item, index) => {
                const thumb = document.createElement('img');
                thumb.src = item.image_path;
                thumb.alt = item.title;
                thumb.className = 'thumbnail';
                thumb.setAttribute('data-image', item.image_path);
                thumb.setAttribute('data-title', item.title);
                thumb.setAttribute('data-desc', item.description || '');
                
                // Set first item as active
                if (index === 0) {
                    thumb.classList.add('active');
                    if (mainImage) mainImage.src = item.image_path;
                    if (docTitle) docTitle.textContent = item.title;
                    if (docDesc) docDesc.textContent = item.description || '';
                }
                
                thumbnailContainer.appendChild(thumb);
            });
            
            // Re-initialize thumbnail click handlers
            initDocumentThumbnails();
        }
    } catch (error) {
        console.error('Load gallery error:', error);
    }
}

