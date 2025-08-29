// DOM elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const playButton = document.getElementById('playButton');
const videoElement = document.getElementById('videoElement');
const videoContainer = document.getElementById('videoContainer');
const notifyBtn = document.getElementById('notifyBtn');
const emailModal = document.getElementById('emailModal');
const closeModal = document.getElementById('closeModal');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');

// Set launch date - Fixed date that won't reset on refresh
// Change this to your actual launch date
const launchDate = new Date('2025-09-01T00:00:00').getTime();

// Countdown timer function
function updateCountdown() {
    const currentTime = new Date().getTime();
    const distance = launchDate - currentTime;

    if (distance < 0) {
        // Launch time has passed
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        // Show launch message
        document.querySelector('h1').textContent = '🚀 IT\'S HERE! THE FUTURE IS NOW! 🚀';
        document.querySelector('h1').classList.add('animate-pulse');
        
        return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update display with zero padding
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');

    // Add pulse animation to seconds for visual feedback
    if (seconds % 2 === 0) {
        secondsEl.parentElement.classList.add('animate-pulse');
        setTimeout(() => {
            secondsEl.parentElement.classList.remove('animate-pulse');
        }, 500);
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Initialize video autoplay
function initializeVideo() {
    // Show video immediately without play button
    videoElement.classList.remove('hidden');
    playButton.style.display = 'none';
    
    // Ensure video fills container properly
    videoElement.style.objectFit = 'contain';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    
    // Force video to play and keep playing
    const playVideo = () => {
        videoElement.play().catch(e => {
            console.log('Autoplay attempt failed, trying again...', e);
            // Retry after a short delay
            setTimeout(playVideo, 1000);
        });
    };
    
    // Initial play attempt
    playVideo();
    
    // Ensure video keeps playing if paused
    videoElement.addEventListener('pause', () => {
        console.log('Video paused, resuming...');
        setTimeout(() => {
            if (videoElement.paused) {
                playVideo();
            }
        }, 100);
    });
    
    // Ensure video restarts when ended (backup for loop attribute)
    videoElement.addEventListener('ended', () => {
        console.log('Video ended, restarting...');
        videoElement.currentTime = 0;
        playVideo();
    });
}

// Video play functionality
playButton.addEventListener('click', () => {
    // Hide the play button
    playButton.style.display = 'none';
    
    // Show the video element
    videoElement.classList.remove('hidden');
    
    // Ensure video fills container properly
    videoElement.style.objectFit = 'contain';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    
    // Try to play the video
    videoElement.play().catch(e => {
        console.log('Video playback failed:', e);
        // Show fallback or error message
        showVideoError();
    });
    
    // Add a close button for the video
    addVideoCloseButton();
});

// Add close button for video
function addVideoCloseButton() {
    // Remove existing close button if any
    const existingBtn = videoContainer.querySelector('.video-close-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'video-close-btn absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10';
    closeBtn.innerHTML = '×';
    closeBtn.style.fontSize = '20px';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoElement.pause();
        videoElement.classList.add('hidden');
        playButton.style.display = 'flex';
        closeBtn.remove();
    });
    
    videoContainer.appendChild(closeBtn);
}

// Show video error
function showVideoError() {
    playButton.style.display = 'flex';
    videoElement.classList.add('hidden');
    
    // Show error message
    showNotification('Video could not be loaded. Please check the file path.', 'error');
}

// Modal functionality
notifyBtn.addEventListener('click', () => {
    emailModal.classList.remove('hidden');
    emailInput.focus();
});

closeModal.addEventListener('click', () => {
    emailModal.classList.add('hidden');
});

// Close modal when clicking outside
emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) {
        emailModal.classList.add('hidden');
    }
});

// Email form submission
emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (email) {
        // Simulate email submission
        showNotification('🎉 Success! You\'ll be notified when we launch!', 'success');
        emailModal.classList.add('hidden');
        
        // Update button state
        notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
        notifyBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-600');
        notifyBtn.classList.add('bg-green-600');
        notifyBtn.disabled = true;
        
        // Store email (in real app, send to server)
        localStorage.setItem('bubbleheads_email', email);
        
        // Reset form
        emailInput.value = '';
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!emailModal.classList.contains('hidden')) {
            emailModal.classList.add('hidden');
        }
        // Also close video if playing
        const closeBtn = videoContainer.querySelector('.video-close-btn');
        if (closeBtn) {
            closeBtn.click();
        }
    }
    
    if (e.key === 'Enter' && emailModal.classList.contains('hidden')) {
        notifyBtn.click();
    }
    
    if (e.key === ' ' && videoElement.classList.contains('hidden')) {
        e.preventDefault();
        playButton.click();
    }
});

// Check if user is already subscribed
if (localStorage.getItem('bubbleheads_email')) {
    notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
    notifyBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-600');
    notifyBtn.classList.add('bg-green-600');
    notifyBtn.disabled = true;
}

// Add interactive effects
function addInteractiveEffects() {
    // Add subtle animation to the header
    const header = document.querySelector('h1');
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            header.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
            setTimeout(() => {
                header.style.textShadow = 'none';
            }, 100);
        }
    }, 2000);
    
    // Add hover effect to play button
    playButton.addEventListener('mouseenter', () => {
        playButton.style.transform = 'scale(1.1)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.transform = 'scale(1)';
    });
}

// Initialize interactive effects
addInteractiveEffects();

// Load logo image
function loadLogo() {
    const logoImg = document.getElementById('logoImage');
    // Using the actual logo file
    logoImg.src = 'image.png';
    logoImg.onerror = function() {
        // Fallback if image doesn't load
        console.log('Logo image failed to load');
        this.style.display = 'none';
    };
}

// Add loading animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.layout-content-container');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
        
        // Initialize video autoplay after page loads
        initializeVideo();
        
        // Start crypto animations
        startCryptoAnimations();
        
        // Load logo
        loadLogo();
    }, 200);
});

// SVG Crypto Symbol Templates
const cryptoSVGs = {
    bitcoin: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-1.189 2.75-2.568 3.101v.001c1.656.46 2.335 1.589 2.123 3.59-.24 2.253-.993 3.188-3.239 3.188H9.93V6.98h1.692c2.163 0 2.44 1.035 2.402 2.05-.04 1.025-.43 1.594-1.458 1.788v.06c1.36.169 2.138.96 2.002 2.282z"/></svg>',
    dollar: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V8h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
    chart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>',
    coin: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><circle cx="12" cy="12" r="10" stroke="#fbbf24" stroke-width="2" fill="none"/><path d="M12 6v12M8 9h8M8 15h8"/></svg>',
    diamond: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><path d="M6,2L18,2L22,8L12,22L2,8L6,2M12,4.5L9,7L15,7L12,4.5M6.5,7L10.5,17.5L5,9L6.5,7M17.5,7L19,9L13.5,17.5L17.5,7M12,4.5L15,7L12,9.5L9,7L12,4.5Z"/></svg>',
    rocket: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><path d="M2.81,14.12L5.64,11.29L8.17,10.79C11.39,6.41 16.8,4.16 19.78,4.16C19.78,7.14 17.53,12.55 13.15,15.77L12.65,18.3L9.82,21.13C9.4,21.54 8.73,21.54 8.32,21.13L2.81,15.62C2.4,15.21 2.4,14.54 2.81,14.12M5.93,16.5L7.34,17.91L10.36,14.89L8.95,13.47L5.93,16.5M16.96,5.93L18.37,7.34L21.4,4.32L19.99,2.91L16.96,5.93Z"/></svg>'
};

// Crypto Animation Functions
function createCryptoSymbol() {
    const symbolKeys = Object.keys(cryptoSVGs);
    const randomKey = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
    
    const symbol = document.createElement('div');
    symbol.className = 'crypto-symbol';
    symbol.innerHTML = cryptoSVGs[randomKey];
    symbol.style.left = Math.random() * window.innerWidth + 'px';
    symbol.style.animationDelay = Math.random() * 2 + 's';
    symbol.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    document.querySelector('.crypto-symbols').appendChild(symbol);
    
    setTimeout(() => {
        symbol.remove();
    }, 10000);
}

function createGoldenParticle() {
    const particle = document.createElement('div');
    particle.className = 'golden-particle';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.animationDelay = Math.random() * 2 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
    
    document.querySelector('.golden-particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

function createBlockchainLine() {
    const line = document.createElement('div');
    line.className = 'blockchain-line';
    line.style.top = Math.random() * window.innerHeight + 'px';
    line.style.width = Math.random() * 200 + 100 + 'px';
    line.style.animationDelay = Math.random() * 2 + 's';
    line.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    document.querySelector('.blockchain-network').appendChild(line);
    
    setTimeout(() => {
        line.remove();
    }, 5000);
}

function createMoneyFlow() {
    const moneySVGs = ['bitcoin', 'dollar', 'coin'];
    const randomSVG = moneySVGs[Math.floor(Math.random() * moneySVGs.length)];
    
    const money = document.createElement('div');
    money.className = 'money-symbol';
    money.innerHTML = cryptoSVGs[randomSVG];
    money.style.top = Math.random() * (window.innerHeight - 100) + 50 + 'px';
    money.style.animationDelay = Math.random() * 2 + 's';
    money.style.animationDuration = (Math.random() * 2 + 3) + 's';
    
    document.querySelector('.money-flow').appendChild(money);
    
    setTimeout(() => {
        money.remove();
    }, 6000);
}

// Initialize crypto animations
function startCryptoAnimations() {
    // Create crypto symbols
    setInterval(createCryptoSymbol, 1500);
    
    // Create golden particles
    setInterval(createGoldenParticle, 800);
    
    // Create blockchain lines
    setInterval(createBlockchainLine, 2000);
    
    // Create money flow
    setInterval(createMoneyFlow, 1200);
    
    // Initial burst
    for (let i = 0; i < 5; i++) {
        setTimeout(createCryptoSymbol, i * 300);
        setTimeout(createGoldenParticle, i * 200);
        setTimeout(createMoneyFlow, i * 400);
    }
}

// Console easter egg
console.log(`
    🫧 THE BUBBLEHEADS 🫧
    
    Ready for the revolution?
    ${daysEl.textContent} days remaining...
    
    Press SPACE to play the teaser video!
`);

// Keep video playing even when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !videoElement.classList.contains('hidden')) {
        // Resume video when tab becomes visible again
        if (videoElement.paused) {
            videoElement.play().catch(e => {
                console.log('Failed to resume video:', e);
            });
        }
    }
    // Don't pause when hidden - let it continue playing
});

// Make the page responsive on mobile
function handleMobileResize() {
    const isMobile = window.innerWidth < 768;
    const container = document.querySelector('.px-40');
    
    if (isMobile) {
        container.classList.remove('px-40');
        container.classList.add('px-4');
    } else {
        container.classList.remove('px-4');
        container.classList.add('px-40');
    }
}

// Handle resize events
window.addEventListener('resize', handleMobileResize);
handleMobileResize(); // Initial call
