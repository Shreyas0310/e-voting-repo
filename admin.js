// Admin page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in (simple check)
    if (!sessionStorage.getItem('adminLoggedIn')) {
        showAdminLogin();
        return;
    }

    initializeAdmin();
    showSection('dashboard');
    updateAdminStats();
    
    // Update stats every 10 seconds
    setInterval(updateAdminStats, 10000);
});

function showAdminLogin() {
    const loginHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <div class="flex justify-center items-center space-x-3 mb-6">
                        <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">RAIT</span>
                        </div>
                        <h2 class="text-3xl font-bold maroon-text">Admin Login</h2>
                    </div>
                    <p class="text-gray-600">Enter admin credentials to access the dashboard</p>
                </div>
                
                <div class="bg-white p-8 rounded-xl shadow-md">
                    <form id="adminLoginForm" class="space-y-6">
                        <div>
                            <label for="adminUsername" class="block text-sm font-medium text-gray-700">Username</label>
                            <input id="adminUsername" name="username" type="text" required 
                                class="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-maroon focus:border-maroon"
                                placeholder="admin">
                        </div>

                        <div>
                            <label for="adminPassword" class="block text-sm font-medium text-gray-700">Password</label>
                            <input id="adminPassword" name="password" type="password" required 
                                class="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-maroon focus:border-maroon"
                                placeholder="Enter password">
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white maroon-bg hover:bg-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition">
                                <i class="fas fa-lock mr-2"></i>
                                Login as Admin
                            </button>
                        </div>
                    </form>
                    
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-600">Default credentials: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = loginHTML;
    
    // Add login form handler
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simple admin authentication
        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            location.reload();
        } else {
            alert('Invalid admin credentials!');
        }
    });
}

function initializeAdmin() {
    // Update admin time
    updateAdminTime();
    setInterval(updateAdminTime, 60000);
    
    // Initialize all sections
    initializeDashboard();
    initializeCandidatesSection();
    initializeVotersSection();
    initializeResultsSection();
    initializeSettingsSection();
}

function updateAdminTime() {
    const now = new Date();
    document.getElementById('adminTime').textContent = now.toLocaleTimeString();
    document.getElementById('lastUpdateTime').textContent = now.toLocaleTimeString();
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.remove('hidden');
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Update section title
    const titles = {
        'dashboard': 'Admin Dashboard',
        'candidates': 'Manage Candidates',
        'voters': 'Voter Management',
        'results': 'Election Results',
        'settings': 'System Settings'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName];
}

// Dashboard Section
function initializeDashboard() {
    updateRecentActivity();
}

function updateAdminStats() {
    const voters = JSON.parse(localStorage.getItem('users')) || [];
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    document.getElementById('adminTotalVoters').textContent = voters.length;
    document.getElementById('adminVotesCast').textContent = votes.length;
    document.getElementById('adminCandidates').textContent = candidates.length;
    
    const turnout = voters.length > 0 ? ((votes.length / voters.length) * 100).toFixed(1) : 0;
    document.getElementById('adminTurnout').textContent = turnout + '%';
    
    updateRecentActivity();
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    // Get recent votes (last 5)
    const recentVotes = votes.slice(-5).reverse();
    
    let activityHTML = '';
    
    if (recentVotes.length === 0) {
        activityHTML = `
            <div class="text-center py-4 text-gray-500">
                <i class="fas fa-info-circle text-2xl mb-2"></i>
                <p>No recent activity</p>
            </div>
        `;
    } else {
        recentVotes.forEach(vote => {
            const voter = users.find(u => u.rollNo === vote.voter_id);
            const candidate = candidates.find(c => c.id === vote.candidate_id);
            
            if (voter && candidate) {
                activityHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-maroon rounded-full flex items-center justify-center text-white text-sm font-bold">
                                ${voter.rollNo.slice(-2)}
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium">${voter.rollNo} voted</p>
                                <p class="text-xs text-gray-500">For ${candidate.name}</p>
                            </div>
                        </div>
                        <span class="text-xs text-gray-500">${new Date(vote.cast_at).toLocaleTimeString()}</span>
                    </div>
                `;
            }
        });
    }
    
    activityContainer.innerHTML = activityHTML;
}

// Candidates Section
function initializeCandidatesSection() {
    const candidatesSection = document.getElementById('candidatesSection');
    
    candidatesSection.innerHTML = `
        <div class="mb-6 flex justify-between items-center">
            <h3 class="text-2xl font-bold maroon-text">Candidate Management</h3>
            <button onclick="showAddCandidateModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                <i class="fas fa-user-plus mr-2"></i>Add Candidate
            </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-md">
                <h4 class="text-lg font-semibold mb-4">Candidates by Committee</h4>
                <div id="candidatesList">
                    <!-- Candidates will be loaded here -->
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-md">
                <h4 class="text-lg font-semibold mb-4">Candidate Statistics</h4>
                <div id="candidateStats">
                    <!-- Stats will be loaded here -->
                </div>
            </div>
        </div>
        
        <!-- Add Candidate Modal -->
        <div id="addCandidateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold maroon-text mb-4">Add New Candidate</h3>
                <form id="addCandidateForm">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Student Roll No</label>
                            <input type="text" id="candidateRollNo" required 
                                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-maroon focus:border-maroon">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Candidate Name</label>
                            <input type="text" id="candidateName" required 
                                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-maroon focus:border-maroon">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Committee & Role</label>
                            <select id="candidateRole" required 
                                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-maroon focus:border-maroon">
                                <option value="">Select Role</option>
                                <!-- Options will be populated by JavaScript -->
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Statement</label>
                            <textarea id="candidateStatement" rows="3"
                                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-maroon focus:border-maroon"
                                placeholder="Candidate's mission statement"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex space-x-4">
                        <button type="button" onclick="hideAddCandidateModal()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition">Cancel</button>
                        <button type="submit" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">Add Candidate</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    loadCandidatesData();
    populateRoleOptions();
    
    // Add form handler
    document.getElementById('addCandidateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewCandidate();
    });
}

function loadCandidatesData() {
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const committees = JSON.parse(localStorage.getItem('committees')) || [];
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    
    // Update candidates list
    let candidatesHTML = '';
    committees.forEach(committee => {
        const committeeRoles = roles.filter(role => role.committee_id === committee.id);
        
        candidatesHTML += `<div class="mb-4"><h5 class="font-semibold text-maroon mb-2">${committee.name}</h5>`;
        
        committeeRoles.forEach(role => {
            const roleCandidates = candidates.filter(c => c.role_id === role.id);
            
            candidatesHTML += `<div class="ml-4 mb-3"><h6 class="text-sm font-medium">${role.name}</h6>`;
            
            if (roleCandidates.length === 0) {
                candidatesHTML += `<p class="text-xs text-gray-500 ml-2">No candidates</p>`;
            } else {
                roleCandidates.forEach(candidate => {
                    candidatesHTML += `
                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded mt-1">
                            <div>
                                <span class="text-sm">${candidate.name}</span>
                                <span class="text-xs text-gray-500 ml-2">(${candidate.student_id})</span>
                            </div>
                            <button onclick="removeCandidate(${candidate.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
            }
            
            candidatesHTML += `</div>`;
        });
        
        candidatesHTML += `</div>`;
    });
    
    document.getElementById('candidatesList').innerHTML = candidatesHTML;
    
    // Update candidate stats
    const totalCandidates = candidates.length;
    const approvedCandidates = candidates.filter(c => c.status === 'approved').length;
    const pendingCandidates = candidates.filter(c => c.status === 'pending').length;
    
    document.getElementById('candidateStats').innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between p-2">
                <span>Total Candidates</span>
                <span class="font-bold">${totalCandidates}</span>
            </div>
            <div class="flex justify-between p-2">
                <span>Approved</span>
                <span class="font-bold text-green-600">${approvedCandidates}</span>
            </div>
            <div class="flex justify-between p-2">
                <span>Pending</span>
                <span class="font-bold text-yellow-600">${pendingCandidates}</span>
            </div>
            <div class="flex justify-between p-2">
                <span>Available Slots</span>
                <span class="font-bold">${16 - totalCandidates}</span>
            </div>
        </div>
    `;
}

function populateRoleOptions() {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    const committees = JSON.parse(localStorage.getItem('committees')) || [];
    const select = document.getElementById('candidateRole');
    
    let optionsHTML = '<option value="">Select Role</option>';
    
    committees.forEach(committee => {
        const committeeRoles = roles.filter(role => role.committee_id === committee.id);
        optionsHTML += `<optgroup label="${committee.name}">`;
        
        committeeRoles.forEach(role => {
            optionsHTML += `<option value="${role.id}">${role.name}</option>`;
        });
        
        optionsHTML += `</optgroup>`;
    });
    
    select.innerHTML = optionsHTML;
}

function showAddCandidateModal() {
    document.getElementById('addCandidateModal').classList.remove('hidden');
}

function hideAddCandidateModal() {
    document.getElementById('addCandidateModal').classList.add('hidden');
}

function addNewCandidate() {
    const rollNo = document.getElementById('candidateRollNo').value;
    const name = document.getElementById('candidateName').value;
    const roleId = parseInt(document.getElementById('candidateRole').value);
    const statement = document.getElementById('candidateStatement').value;
    
    // Validate roll number
    if (!/^23IT(10[0-1][0-9]|1020)$/.test(rollNo)) {
        alert('Please enter a valid roll number (23IT1001-1020)');
        return;
    }
    
    // Get existing candidates
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    // Check if student is already a candidate
    const existingCandidate = candidates.find(c => c.student_id === rollNo);
    if (existingCandidate) {
        alert('This student is already a candidate!');
        return;
    }
    
    // Check role capacity (max 5 candidates per role)
    const roleCandidates = candidates.filter(c => c.role_id === roleId);
    if (roleCandidates.length >= 5) {
        alert('This role already has maximum number of candidates (5)!');
        return;
    }
    
    // Add new candidate
    const newCandidate = {
        id: Date.now(),
        student_id: rollNo,
        role_id: roleId,
        name: name,
        statement: statement,
        status: 'approved',
        applied_at: new Date().toISOString()
    };
    
    candidates.push(newCandidate);
    localStorage.setItem('candidates', JSON.stringify(candidates));
    
    // Update the user's candidate status
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.rollNo === rollNo);
    if (userIndex !== -1) {
        users[userIndex].isCandidate = true;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    hideAddCandidateModal();
    loadCandidatesData();
    
    // Show success message
    alert('Candidate added successfully!');
}

function removeCandidate(candidateId) {
    if (confirm('Are you sure you want to remove this candidate?')) {
        const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
        const candidateIndex = candidates.findIndex(c => c.id === candidateId);
        
        if (candidateIndex !== -1) {
            const candidate = candidates[candidateIndex];
            
            // Remove candidate
            candidates.splice(candidateIndex, 1);
            localStorage.setItem('candidates', JSON.stringify(candidates));
            
            // Update user's candidate status
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.rollNo === candidate.student_id);
            if (userIndex !== -1) {
                users[userIndex].isCandidate = false;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            loadCandidatesData();
            alert('Candidate removed successfully!');
        }
    }
}

// Voters Section (simplified)
function initializeVotersSection() {
    const votersSection = document.getElementById('votersSection');
    
    votersSection.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-2xl font-bold maroon-text mb-4">Voter Management</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voted</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                        </tr>
                    </thead>
                    <tbody id="votersTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- Voters will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    loadVotersData();
}

function loadVotersData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    
    let tableHTML = '';
    
    users.forEach(user => {
        const hasVoted = votes.some(vote => vote.voter_id === user.rollNo);
        const votedStatus = hasVoted ? 
            '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Yes</span>' :
            '<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No</span>';
        
        const candidateStatus = user.isCandidate ? 
            '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Yes</span>' :
            '<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">No</span>';
        
        tableHTML += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.rollNo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${votedStatus}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${candidateStatus}</td>
            </tr>
        `;
    });
    
    document.getElementById('votersTableBody').innerHTML = tableHTML;
}

// Results Section (similar to results page but with admin features)
function initializeResultsSection() {
    const resultsSection = document.getElementById('resultsSection');
    
    resultsSection.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-2xl font-bold maroon-text mb-4">Election Results</h3>
            <div class="mb-6">
                <button onclick="exportData('all')" class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition mr-4">
                    <i class="fas fa-download mr-2"></i>Export All Data
                </button>
                <button onclick="resetElection()" class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition">
                    <i class="fas fa-redo mr-2"></i>Reset Election
                </button>
            </div>
            <div id="adminResultsContainer">
                <!-- Results will be loaded here -->
            </div>
        </div>
    `;
    
    loadAdminResults();
}

function loadAdminResults() {
    // Similar to results.js but for admin
    const container = document.getElementById('adminResultsContainer');
    container.innerHTML = `<p class="text-gray-500">Loading results...</p>`;
    
    // Simulate loading
    setTimeout(() => {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Results will be displayed here</p>
                <p class="text-sm text-gray-400 mt-2">Navigate to the Results page for detailed view</p>
            </div>
        `;
    }, 1000);
}

// Settings Section
function initializeSettingsSection() {
    const settingsSection = document.getElementById('settingsSection');
    
    settingsSection.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-2xl font-bold maroon-text mb-4">System Settings</h3>
            
            <div class="space-y-6">
                <div class="border-b border-gray-200 pb-6">
                    <h4 class="text-lg font-semibold mb-3">Election Dates</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Enrollment Start</label>
                            <input type="date" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Enrollment End</label>
                            <input type="date" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Voting Date</label>
                            <input type="date" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        </div>
                    </div>
                </div>
                
                <div class="border-b border-gray-200 pb-6">
                    <h4 class="text-lg font-semibold mb-3">System Configuration</h4>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="votingEnabled" checked class="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded">
                            <label for="votingEnabled" class="ml-2 block text-sm text-gray-700">Voting System Enabled</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="resultsPublic" checked class="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded">
                            <label for="resultsPublic" class="ml-2 block text-sm text-gray-700">Results Publicly Visible</label>
                        </div>
                    </div>
                </div>
                
                <div>
                    <button class="bg-maroon text-white px-6 py-2 rounded-lg font-medium hover:bg-maroon transition">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function exportData(type) {
    alert(`Exporting ${type} data... (This would download a file in a real application)`);
}

function resetElection() {
    if (confirm('WARNING: This will reset all election data including votes! This action cannot be undone. Are you sure?')) {
        // Reset votes
        localStorage.setItem('votes', JSON.stringify([]));
        
        // Reset user voting status
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach(user => {
            user.hasVoted = false;
        });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Election data has been reset!');
        updateAdminStats();
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Add CSS for admin nav items
const style = document.createElement('style');
style.textContent = `
    .admin-nav-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        color: #e5e7eb;
        text-decoration: none;
    }
    
    .admin-nav-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .admin-nav-item.active {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        font-weight: 600;
    }
`;
document.head.appendChild(style);