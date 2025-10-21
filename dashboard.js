// Create floating particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size, position and animation
        const size = Math.random() * 60 + 20;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize dashboard statistics
function initStats() {
    // Get data from localStorage or set defaults
    const voters = JSON.parse(localStorage.getItem('voters')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    
    document.getElementById('totalVoters').textContent = voters.length;
    document.getElementById('totalCandidates').textContent = candidates.length;
    document.getElementById('votesCast').textContent = votes.length;
    
    // Calculate time remaining until voting closes (example: 5 hours from now)
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(now.getHours() + 5);
    
    updateCountdown(endTime);
}

function updateCountdown(endTime) {
    const countdownElement = document.getElementById('timeRemaining');
    
    function update() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            countdownElement.textContent = 'Voting Closed';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        countdownElement.textContent = `${hours}h ${minutes}m`;
    }
    
    update();
    setInterval(update, 60000); // Update every minute
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initStats();
});