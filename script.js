// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const helmetSection = document.getElementById('helmetSection');
const avatarCanvas = document.getElementById('avatarCanvas');
const helmetSlider = document.getElementById('helmetSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// State
let uploadedImage = null;
let currentHelmet = 'neon';
let currentHelmetIndex = 0;

// Helmet data
const helmets = [
    { name: 'neon', colors: ['#ff006e', '#00f5ff'] },
    { name: 'ocean', colors: ['#0077be', '#00a8cc'] },
    { name: 'dark-neon', colors: ['#8b00ff', '#ff1493'] },
    { name: 'jup', colors: ['#ffd700', '#ff8c00'] }
];

// Initialize the app
function init() {
    setupEventListeners();
    updateHelmetNavigation();
}

// Set up all event listeners
function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Generate button
    generateBtn.addEventListener('click', generateAvatar);

    // Helmet selection
    document.querySelectorAll('.helmet-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const helmet = e.currentTarget.dataset.helmet;
            selectHelmet(helmet);
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateHelmet(-1));
    nextBtn.addEventListener('click', () => navigateHelmet(1));

    // Touch/swipe events for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    helmetSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    helmetSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault();
    });

    helmetSlider.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateHelmet(1); // Swipe left - next
            } else {
                navigateHelmet(-1); // Swipe right - previous
            }
        }
    });
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// Handle file processing
function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, GIF)');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    // Create image object
    const img = new Image();
    img.onload = function() {
        uploadedImage = img;
        generateBtn.disabled = false;
        
        // Update upload area to show preview
        updateUploadPreview(img);
    };
    
    img.src = URL.createObjectURL(file);
}

// Update upload area with preview
function updateUploadPreview(img) {
    const uploadContent = uploadArea.querySelector('.upload-content');
    uploadContent.innerHTML = `
        <div class="preview-container">
            <img src="${img.src}" style="max-width: 200px; max-height: 200px; border-radius: 10px; object-fit: cover;" alt="Preview">
            <p style="margin-top: 15px; color: #667eea; font-weight: 600;">Image uploaded successfully!</p>
            <p style="color: #666;">Click "Generate" to create your Bubblehead</p>
        </div>
    `;
}

// Generate avatar with helmet
function generateAvatar() {
    if (!uploadedImage) return;

    const ctx = avatarCanvas.getContext('2d');
    const canvasSize = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the user's image (circular crop)
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 20, 0, Math.PI * 2);
    ctx.clip();

    // Calculate aspect ratio and draw image
    const imgAspect = uploadedImage.width / uploadedImage.height;
    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > 1) {
        // Landscape image
        drawHeight = canvasSize - 40;
        drawWidth = drawHeight * imgAspect;
        drawX = (canvasSize - drawWidth) / 2;
        drawY = 20;
    } else {
        // Portrait or square image
        drawWidth = canvasSize - 40;
        drawHeight = drawWidth / imgAspect;
        drawX = 20;
        drawY = (canvasSize - drawHeight) / 2;
    }

    ctx.drawImage(uploadedImage, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Draw helmet overlay
    drawHelmet(ctx, canvasSize);

    // Show result section
    resultSection.style.display = 'block';
    helmetSection.style.display = 'block';

    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Draw helmet on canvas
function drawHelmet(ctx, size) {
    const helmetData = helmets.find(h => h.name === currentHelmet);
    if (!helmetData) return;

    // Create gradient for helmet
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, helmetData.colors[0]);
    gradient.addColorStop(1, helmetData.colors[1]);

    // Draw helmet shape (simplified bubble helmet)
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    
    // Outer helmet ring
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
    ctx.stroke();

    // Inner glow effect
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 15, 0, Math.PI * 2);
    ctx.stroke();

    // Add some sparkle effects
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = helmetData.colors[0];
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = size / 2 + Math.cos(angle) * (size / 2 - 25);
        const y = size / 2 + Math.sin(angle) * (size / 2 - 25);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Select helmet
function selectHelmet(helmetName) {
    currentHelmet = helmetName;
    currentHelmetIndex = helmets.findIndex(h => h.name === helmetName);
    
    // Update active state
    document.querySelectorAll('.helmet-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-helmet="${helmetName}"]`).classList.add('active');

    // Regenerate avatar if image is loaded
    if (uploadedImage) {
        generateAvatar();
    }

    updateHelmetNavigation();
}

// Navigate helmet selection
function navigateHelmet(direction) {
    currentHelmetIndex += direction;
    
    if (currentHelmetIndex < 0) {
        currentHelmetIndex = helmets.length - 1;
    } else if (currentHelmetIndex >= helmets.length) {
        currentHelmetIndex = 0;
    }
    
    selectHelmet(helmets[currentHelmetIndex].name);
    
    // Scroll to active helmet
    const activeOption = document.querySelector('.helmet-option.active');
    if (activeOption) {
        activeOption.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Update helmet navigation buttons
function updateHelmetNavigation() {
    // This could be used to update button states if needed
    // For now, buttons are always active since we loop around
}

// Add some fun animations
function addSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
    sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle animation CSS
const sparkleCSS = `
@keyframes sparkle {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = sparkleCSS;
document.head.appendChild(styleSheet);

// Add sparkle effects on interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('helmet-option') || 
        e.target.closest('.helmet-option') ||
        e.target.classList.contains('generate-btn')) {
        addSparkleEffect(e.target.closest('.helmet-option') || e.target);
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some floating animation to helmet previews
function animateHelmetPreviews() {
    const previews = document.querySelectorAll('.helmet-preview');
    previews.forEach((preview, index) => {
        preview.style.animation = `float 3s ease-in-out infinite`;
        preview.style.animationDelay = `${index * 0.2}s`;
    });
}

// Call animation function after a delay to ensure elements are rendered
setTimeout(animateHelmetPreviews, 500);
