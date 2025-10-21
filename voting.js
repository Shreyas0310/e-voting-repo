// Initialize voting page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check if user has already voted
    if (currentUser.hasVoted) {
        window.location.href = 'results.html';
        return;
    }

    // Display user info
    document.getElementById('userInfo').textContent = `${currentUser.name} (${currentUser.rollNo})`;

    // Initialize data
    initializeData();
    renderVotingForms();
    updateProgress();
});

function initializeData() {
    // Initialize committees and roles if not exists
    if (!localStorage.getItem('committees')) {
        const committees = [
            { id: 1, name: 'Sports Committee' },
            { id: 2, name: 'Student Union Council' },
            { id: 3, name: 'Social Wing' },
            { id: 4, name: 'ACM Student Chapter' }
        ];
        localStorage.setItem('committees', JSON.stringify(committees));
    }

    if (!localStorage.getItem('roles')) {
        const roles = [
            { id: 1, committee_id: 1, name: 'President' },
            { id: 2, committee_id: 1, name: 'General Secretary' },
            { id: 3, committee_id: 1, name: 'PRO' },
            { id: 4, committee_id: 1, name: 'Publicity Head' },
            { id: 5, committee_id: 2, name: 'President' },
            { id: 6, committee_id: 2, name: 'General Secretary' },
            { id: 7, committee_id: 2, name: 'PRO' },
            { id: 8, committee_id: 2, name: 'Publicity Head' },
            { id: 9, committee_id: 3, name: 'President' },
            { id: 10, committee_id: 3, name: 'General Secretary' },
            { id: 11, committee_id: 3, name: 'PRO' },
            { id: 12, committee_id: 3, name: 'Publicity Head' },
            { id: 13, committee_id: 4, name: 'President' },
            { id: 14, committee_id: 4, name: 'General Secretary' },
            { id: 15, committee_id: 4, name: 'PRO' },
            { id: 16, committee_id: 4, name: 'Publicity Head' }
        ];
        localStorage.setItem('roles', JSON.stringify(roles));
    }

    // Initialize sample candidates if not exists
    if (!localStorage.getItem('candidates') || JSON.parse(localStorage.getItem('candidates')).length === 0) {
        const sampleCandidates = [
            // Sports Committee
            { id: 1, student_id: '23IT1005', role_id: 1, name: 'Raj Sharma', statement: 'Promote sports excellence', status: 'approved' },
            { id: 2, student_id: '23IT1008', role_id: 1, name: 'Priya Singh', statement: 'More inter-college tournaments', status: 'approved' },
            { id: 3, student_id: '23IT1012', role_id: 2, name: 'Amit Kumar', statement: 'Efficient management', status: 'approved' },
            { id: 4, student_id: '23IT1015', role_id: 3, name: 'Neha Patel', statement: 'Better communication', status: 'approved' },
            { id: 5, student_id: '23IT1018', role_id: 4, name: 'Sandeep Roy', statement: 'Creative publicity', status: 'approved' },
            
            // Student Union Council
            { id: 6, student_id: '23IT1003', role_id: 5, name: 'Vikram Joshi', statement: 'Student welfare first', status: 'approved' },
            { id: 7, student_id: '23IT1007', role_id: 5, name: 'Anjali Mehta', statement: 'Transparent governance', status: 'approved' },
            { id: 8, student_id: '23IT1011', role_id: 6, name: 'Rahul Verma', statement: 'Effective coordination', status: 'approved' },
            { id: 9, student_id: '23IT1016', role_id: 7, name: 'Pooja Reddy', statement: 'Strong representation', status: 'approved' },
            { id: 10, student_id: '23IT1020', role_id: 8, name: 'Karan Malhotra', statement: 'Engaging campaigns', status: 'approved' }
        ];
        localStorage.setItem('candidates', JSON.stringify(sampleCandidates));
    }
}

function renderVotingForms() {
    const committees = JSON.parse(localStorage.getItem('committees'));
    const roles = JSON.parse(localStorage.getItem('roles'));
    const candidates = JSON.parse(localStorage.getItem('candidates'));
    const votingForms = document.getElementById('votingForms');

    committees.forEach(committee => {
        const committeeRoles = roles.filter(role => role.committee_id === committee.id);
        
        let formHTML = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="maroon-bg text-white p-4">
                    <h2 class="text-xl font-bold">${committee.name}</h2>
                </div>
                <div class="p-6">
        `;

        committeeRoles.forEach(role => {
            const roleCandidates = candidates.filter(candidate => 
                candidate.role_id === role.id && candidate.status === 'approved'
            );

            if (roleCandidates.length > 0) {
                formHTML += `
                    <div class="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                        <h3 class="text-lg font-semibold maroon-text mb-3">${role.name}</h3>
                        <div class="space-y-3">
                `;

                roleCandidates.forEach(candidate => {
                    formHTML += `
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition voting-card">
                            <input type="radio" name="role_${role.id}" value="${candidate.id}" class="h-4 w-4 text-maroon focus:ring-maroon border-gray-300">
                            <div class="ml-3">
                                <span class="font-medium">${candidate.name}</span>
                                <p class="text-sm text-gray-600 mt-1">${candidate.statement}</p>
                            </div>
                        </label>
                    `;
                });

                formHTML += `
                        </div>
                    </div>
                `;
            }
        });

        formHTML += `
                </div>
            </div>
        `;

        votingForms.innerHTML += formHTML;
    });
}

function updateProgress() {
    const roles = JSON.parse(localStorage.getItem('roles'));
    const committees = JSON.parse(localStorage.getItem('committees'));
    
    committees.forEach(committee => {
        const committeeRoles = roles.filter(role => role.committee_id === committee.id);
        let selectedCount = 0;
        
        committeeRoles.forEach(role => {
            const selected = document.querySelector(`input[name="role_${role.id}"]:checked`);
            if (selected) selectedCount++;
        });
        
        const progressElement = document.getElementById(`${committee.name.toLowerCase().replace(' ', '')}Progress`);
        const barElement = document.getElementById(`${committee.name.toLowerCase().replace(' ', '')}Bar`);
        
        if (progressElement && barElement) {
            const percentage = (selectedCount / committeeRoles.length) * 100;
            progressElement.textContent = `${selectedCount}/${committeeRoles.length}`;
            barElement.style.width = `${percentage}%`;
        }
    });
    
    // Update submit button state
    const totalRoles = roles.length;
    const selectedRoles = document.querySelectorAll('input[type="radio"]:checked').length;
    const submitButton = document.getElementById('submitVotes');
    
    submitButton.disabled = selectedRoles === 0;
    
    if (selectedRoles > 0) {
        submitButton.innerHTML = `<i class="fas fa-paper-plane mr-2"></i>Submit Votes (${selectedRoles}/${totalRoles})`;
    }
}

// Add event listeners for radio buttons
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        updateProgress();
    }
});

// Submit votes button click
document.getElementById('submitVotes').addEventListener('click', function() {
    showConfirmationModal();
});

function showConfirmationModal() {
    const roles = JSON.parse(localStorage.getItem('roles'));
    const candidates = JSON.parse(localStorage.getItem('candidates'));
    const voteSummary = document.getElementById('voteSummary');
    
    let summaryHTML = '<div class="space-y-3">';
    let hasVotes = false;
    
    roles.forEach(role => {
        const selected = document.querySelector(`input[name="role_${role.id}"]:checked`);
        if (selected) {
            hasVotes = true;
            const candidate = candidates.find(c => c.id === parseInt(selected.value));
            summaryHTML += `
                <div class="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                        <span class="font-medium">${role.name}</span>
                        <span class="text-gray-600 ml-2">→ ${candidate.name}</span>
                    </div>
                    <i class="fas fa-check text-green-600"></i>
                </div>
            `;
        }
    });
    
    summaryHTML += '</div>';
    
    if (hasVotes) {
        voteSummary.innerHTML = summaryHTML;
        document.getElementById('confirmationModal').classList.remove('hidden');
    }
}

function hideConfirmationModal() {
    document.getElementById('confirmationModal').classList.add('hidden');
}

function submitVotes() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const roles = JSON.parse(localStorage.getItem('roles'));
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    
    // Record votes
    roles.forEach(role => {
        const selected = document.querySelector(`input[name="role_${role.id}"]:checked`);
        if (selected) {
            const vote = {
                id: Date.now() + Math.random(),
                voter_id: currentUser.rollNo,
                role_id: role.id,
                candidate_id: parseInt(selected.value),
                cast_at: new Date().toISOString()
            };
            votes.push(vote);
        }
    });
    
    // Save votes
    localStorage.setItem('votes', JSON.stringify(votes));
    
    // Update user voting status
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.rollNo === currentUser.rollNo);
    if (userIndex !== -1) {
        users[userIndex].hasVoted = true;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update session
        currentUser.hasVoted = true;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Show success message
    hideConfirmationModal();
    showSuccessMessage();
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3 text-xl"></i>
            <div>
                <strong class="block">Votes Submitted Successfully!</strong>
                <span>Thank you for participating in the election.</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
        window.location.href = 'results.html';
    }, 3000);
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}