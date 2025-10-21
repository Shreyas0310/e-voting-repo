document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Initialize default users if not exists
    if (!localStorage.getItem('users')) {
        const defaultUsers = [];
        for (let i = 1; i <= 20; i++) {
            const rollNo = `23IT${1000 + i}`;
            defaultUsers.push({
                rollNo: rollNo,
                password: 'rait@123',
                name: `Student ${i}`,
                email: `${rollNo.toLowerCase()}@rait.ac.in`,
                hasVoted: false,
                isCandidate: false
            });
        }
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Initialize other data if not exists
    if (!localStorage.getItem('candidates')) {
        localStorage.setItem('candidates', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('votes')) {
        localStorage.setItem('votes', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('voters')) {
        localStorage.setItem('voters', JSON.stringify([]));
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rollNo = document.getElementById('rollNo').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate roll number format
        if (!isValidRollNo(rollNo)) {
            showAlert('Please enter a valid roll number (23IT1001 to 23IT1020)', 'error');
            return;
        }
        
        // Authenticate user
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.rollNo === rollNo && u.password === password);
        
        if (user) {
            // Store current user in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Check if user has already voted
            if (user.hasVoted) {
                window.location.href = 'results.html';
            } else {
                window.location.href = 'voting.html';
            }
        } else {
            showAlert('Invalid roll number or password', 'error');
        }
    });
    
    function isValidRollNo(rollNo) {
        const regex = /^23IT(10[0-1][0-9]|1020)$/;
        return regex.test(rollNo);
    }
    
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
        }`;
        alertDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
});