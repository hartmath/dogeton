// DOM elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const videoFileInput = document.getElementById('videoFileInput');
const videoUploadArea = document.getElementById('videoUploadArea');
const videoElement = document.getElementById('videoElement');
const notifyBtn = document.getElementById('notifyBtn');
const emailModal = document.getElementById('emailModal');
const closeModal = document.getElementById('closeModal');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');

// Set launch date - 3 days from now as specified
const now = new Date();
const launchDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)).getTime();

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

// Video file upload functionality
videoFileInput.addEventListener('change', handleVideoUpload);

// Handle drag and drop for video upload
videoUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    videoUploadArea.classList.add('bg-gradient-to-br', 'from-purple-800/70', 'to-blue-800/70');
});

videoUploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    videoUploadArea.classList.remove('bg-gradient-to-br', 'from-purple-800/70', 'to-blue-800/70');
});

videoUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    videoUploadArea.classList.remove('bg-gradient-to-br', 'from-purple-800/70', 'to-blue-800/70');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
        handleVideoFile(files[0]);
    } else {
        showErrorMessage('Please upload a valid video file');
    }
});

// Handle video upload
function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleVideoFile(file);
    }
}

// Process video file
function handleVideoFile(file) {
    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        showErrorMessage('Video file is too large. Please choose a file under 100MB.');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
        showErrorMessage('Please select a valid video file.');
        return;
    }
    
    // Create video URL
    const videoURL = URL.createObjectURL(file);
    
    // Set video source and show player
    videoElement.src = videoURL;
    videoUploadArea.style.display = 'none';
    videoElement.classList.remove('hidden');
    
    // Show success message
    showSuccessMessage('Video uploaded successfully! 🎬');
    
    // Add controls and autoplay
    videoElement.controls = true;
    videoElement.load();
    
    // Add replace video button
    addReplaceVideoButton();
}

// Add replace video button
function addReplaceVideoButton() {
    const videoContainer = videoElement.parentElement;
    
    // Remove existing replace button if any
    const existingBtn = videoContainer.querySelector('.replace-video-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'replace-video-btn absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-10';
    replaceBtn.innerHTML = '🔄 Replace Video';
    replaceBtn.addEventListener('click', () => {
        videoElement.classList.add('hidden');
        videoElement.src = '';
        videoUploadArea.style.display = 'flex';
        replaceBtn.remove();
        videoFileInput.value = ''; // Reset file input
    });
    
    videoContainer.appendChild(replaceBtn);
}

// Error message function
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Animate in
    setTimeout(() => {
        errorDiv.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        errorDiv.classList.add('translate-x-full');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 4000);
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
        showSuccessMessage();
        emailModal.classList.add('hidden');
        
        // Update button state
        notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
        notifyBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-600');
        notifyBtn.classList.add('bg-green-600');
        notifyBtn.disabled = true;
        
        // Store email (in real app, send to server)
        localStorage.setItem('bubbleheads_email', email);
    }
});

// Success message function
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    successDiv.textContent = '🎉 Success! You\'ll be notified when we launch!';
    
    document.body.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
        successDiv.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        successDiv.classList.add('translate-x-full');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 4000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !emailModal.classList.contains('hidden')) {
        emailModal.classList.add('hidden');
    }
    
    if (e.key === 'Enter' && emailModal.classList.contains('hidden')) {
        notifyBtn.click();
    }
    
    if (e.key === 'v' && e.ctrlKey && videoElement.classList.contains('hidden')) {
        e.preventDefault();
        videoFileInput.click();
    }
});

// Check if user is already subscribed
if (localStorage.getItem('bubbleheads_email')) {
    notifyBtn.innerHTML = '✓ YOU\'RE ON THE LIST!';
    notifyBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-600');
    notifyBtn.classList.add('bg-green-600');
    notifyBtn.disabled = true;
}

// Add some interactive animations
function addInteractiveEffects() {
    // Add subtle animation to the header
    const header = document.querySelector('h1');
    let glitchInterval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            header.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
            setTimeout(() => {
                header.style.textShadow = 'none';
            }, 100);
        }
    }, 2000);
    
    // Add video upload area hover effect
    if (videoUploadArea) {
        videoUploadArea.addEventListener('mouseenter', () => {
            videoUploadArea.style.transform = 'scale(1.02)';
            videoUploadArea.style.transition = 'transform 0.3s ease';
        });
        
        videoUploadArea.addEventListener('mouseleave', () => {
            videoUploadArea.style.transform = 'scale(1)';
        });
    }
}

// Initialize interactive effects
addInteractiveEffects();

// Add loading animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.layout-content-container');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 200);
});

// Add particle effect (minimal)
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'fixed w-2 h-2 bg-purple-500 rounded-full opacity-20 pointer-events-none';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    particle.style.transition = 'transform 8s linear, opacity 8s linear';
    
    document.body.appendChild(particle);
    
    // Animate upward
    setTimeout(() => {
        particle.style.transform = `translateY(-${window.innerHeight + 100}px) translateX(${(Math.random() - 0.5) * 200}px)`;
        particle.style.opacity = '0';
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Create particles periodically
setInterval(createFloatingParticle, 2000);

// Add some console easter egg
console.log(`
    🫧 THE BUBBLEHEADS 🫧
    
    You found the secret console!
    
    Ready to dive into the future?
    The revolution starts in ${daysEl.textContent} days...
    
    Follow us for updates:
    Twitter: @thebubbleheads
    Discord: discord.gg/bubbleheads
`);

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    const animatedElements = document.querySelectorAll('[class*="animate"]');
    
    animatedElements.forEach(el => {
        if (isHidden) {
            el.style.animationPlayState = 'paused';
        } else {
            el.style.animationPlayState = 'running';
        }
    });
});
