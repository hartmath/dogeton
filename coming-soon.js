// DOM elements
const countdownEl = document.getElementById('countdown');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const notifyBtn = document.getElementById('notifyBtn');
const emailModal = document.getElementById('emailModal');
const closeBtn = document.querySelector('.close');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const particlesContainer = document.getElementById('particles');

// Set launch date (you can change this to your desired launch date)
const launchDate = new Date('2024-02-01T00:00:00').getTime();

// Countdown timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
        // Launch date has passed
        document.querySelector('.countdown-section').innerHTML = `
            <h2 style="font-size: 2.5rem; color: #00f5ff; margin: 40px 0;">
                🚀 IT'S HERE! 🚀
            </h2>
        `;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Particle system
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and properties
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    // Random color
    const colors = ['#667eea', '#764ba2', '#ff006e', '#00f5ff', '#8b00ff'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 6000);
}

// Create particles continuously
setInterval(createParticle, 200);

// Modal functionality
notifyBtn.addEventListener('click', () => {
    emailModal.style.display = 'block';
    emailInput.focus();
});

closeBtn.addEventListener('click', () => {
    emailModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === emailModal) {
        emailModal.style.display = 'none';
    }
});

// Email form submission
emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    
    if (email) {
        // Simulate email submission
        notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
        notifyBtn.style.background = 'linear-gradient(45deg, #00ff88, #00aa55)';
        notifyBtn.disabled = true;
        
        emailModal.style.display = 'none';
        
        // Show success message
        showNotification('🎉 You\'re all set! We\'ll notify you when the magic begins.');
        
        // Store email in localStorage (in a real app, you'd send this to your server)
        localStorage.setItem('bubbleheads_email', email);
    }
});

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 136, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Add notification animations
const notificationCSS = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationCSS;
document.head.appendChild(styleSheet);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emailModal.style.display === 'block') {
        emailModal.style.display = 'none';
    }
    
    if (e.key === 'Enter' && e.target !== emailInput && emailModal.style.display !== 'block') {
        notifyBtn.click();
    }
});

// Check if user is already subscribed
if (localStorage.getItem('bubbleheads_email')) {
    notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
    notifyBtn.style.background = 'linear-gradient(45deg, #00ff88, #00aa55)';
    notifyBtn.disabled = true;
}

// Video fallback for browsers that don't support the video
const video = document.getElementById('bgVideo');
if (video) {
    video.addEventListener('error', () => {
        // If video fails to load, add animated background
        document.body.style.background = `
            linear-gradient(-45deg, #000, #1a1a2e, #16213e, #0f0f23)
        `;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientBG 15s ease infinite';
        
        // Add CSS for animated background
        const bgCSS = `
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        `;
        
        const bgStyleSheet = document.createElement('style');
        bgStyleSheet.textContent = bgCSS;
        document.head.appendChild(bgStyleSheet);
    });
}

// Add glitch effect to dramatic header
function addGlitchEffect() {
    const header = document.querySelector('.dramatic-header');
    if (header) {
        header.style.animation = 'glitch 0.3s ease-in-out';
        
        setTimeout(() => {
            header.style.animation = '';
        }, 300);
    }
}

// Add glitch CSS
const glitchCSS = `
@keyframes glitch {
    0% { transform: translateX(0); }
    20% { transform: translateX(-2px) skew(-2deg); }
    40% { transform: translateX(2px) skew(2deg); }
    60% { transform: translateX(-1px) skew(-1deg); }
    80% { transform: translateX(1px) skew(1deg); }
    100% { transform: translateX(0); }
}
`;

const glitchStyleSheet = document.createElement('style');
glitchStyleSheet.textContent = glitchCSS;
document.head.appendChild(glitchStyleSheet);

// Trigger glitch effect randomly
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 5 seconds
        addGlitchEffect();
    }
}, 5000);

// Add initial dramatic entrance animation
setTimeout(() => {
    document.querySelector('.main-content').style.transform = 'scale(1)';
    document.querySelector('.main-content').style.opacity = '1';
}, 100);

// Matrix rain effect (subtle)
function createMatrixRain() {
    const chars = '01';
    const rainContainer = document.createElement('div');
    rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.textContent = chars[Math.floor(Math.random() * chars.length)];
        drop.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            color: #00f5ff;
            font-family: monospace;
            font-size: 14px;
            animation: matrixFall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        rainContainer.appendChild(drop);
    }
    
    document.body.appendChild(rainContainer);
}

// Matrix fall animation CSS
const matrixCSS = `
@keyframes matrixFall {
    to {
        transform: translateY(100vh);
        opacity: 0;
    }
}
`;

const matrixStyleSheet = document.createElement('style');
matrixStyleSheet.textContent = matrixCSS;
document.head.appendChild(matrixStyleSheet);

// Initialize matrix rain
createMatrixRain();
