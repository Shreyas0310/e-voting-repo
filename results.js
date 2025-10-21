// Initialize results page
document.addEventListener('DOMContentLoaded', function() {
    initializeResults();
    updateResults();
    
    // Update results every 5 seconds for live updates
    setInterval(updateResults, 5000);
});

function initializeResults() {
    // Ensure all required data exists
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
}

function updateResults() {
    const voters = JSON.parse(localStorage.getItem('users')) || [];
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const committees = JSON.parse(localStorage.getItem('committees'));
    const roles = JSON.parse(localStorage.getItem('roles'));

    // Update header statistics
    document.getElementById('totalVotersCount').textContent = voters.length;
    document.getElementById('votesCastCount').textContent = votes.length;
    document.getElementById('totalCandidatesCount').textContent = candidates.length;
    
    const voterTurnout = voters.length > 0 ? ((votes.length / voters.length) * 100).toFixed(1) : 0;
    document.getElementById('voterTurnout').textContent = `${voterTurnout}%`;
    
    document.getElementById('resultsTime').textContent = new Date().toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();

    // Calculate and display results
    displayResults(committees, roles, candidates, votes);
}

function displayResults(committees, roles, candidates, votes) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    committees.forEach(committee => {
        const committeeRoles = roles.filter(role => role.committee_id === committee.id);
        
        let committeeHTML = `
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="maroon-bg text-white p-6">
                    <h2 class="text-2xl font-bold">${committee.name}</h2>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        `;

        committeeRoles.forEach(role => {
            const roleCandidates = candidates.filter(candidate => candidate.role_id === role.id);
            const roleVotes = votes.filter(vote => vote.role_id === role.id);
            
            let roleHTML = `
                <div class="border border-gray-200 rounded-lg p-4">
                    <h3 class="text-lg font-semibold maroon-text mb-3">${role.name}</h3>
                    <div class="space-y-3">
            `;

            if (roleVotes.length === 0) {
                roleHTML += `
                    <div class="text-center py-4 text-gray-500">
                        <i class="fas fa-vote-yea text-2xl mb-2"></i>
                        <p>No votes cast yet</p>
                    </div>
                `;
            } else {
                // Calculate votes for each candidate
                const candidateVotes = {};
                roleCandidates.forEach(candidate => {
                    candidateVotes[candidate.id] = 0;
                });
                
                roleVotes.forEach(vote => {
                    if (candidateVotes[vote.candidate_id] !== undefined) {
                        candidateVotes[vote.candidate_id]++;
                    }
                });

                // Sort candidates by votes
                const sortedCandidates = roleCandidates.map(candidate => ({
                    ...candidate,
                    votes: candidateVotes[candidate.id] || 0
                })).sort((a, b) => b.votes - a.votes);

                sortedCandidates.forEach((candidate, index) => {
                    const percentage = roleVotes.length > 0 ? ((candidate.votes / roleVotes.length) * 100).toFixed(1) : 0;
                    const isWinner = index === 0 && candidate.votes > 0;
                    
                    roleHTML += `
                        <div class="p-3 border border-gray-200 rounded-lg ${isWinner ? 'bg-green-50 border-green-200' : ''}">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-center">
                                    <span class="font-medium">${candidate.name}</span>
                                    ${isWinner ? '<span class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">WINNER</span>' : ''}
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-lg">${candidate.votes}</div>
                                    <div class="text-sm text-gray-600">${percentage}%</div>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                            ${candidate.statement ? `<p class="text-sm text-gray-600 mt-2">${candidate.statement}</p>` : ''}
                        </div>
                    `;
                });
            }

            roleHTML += `
                    </div>
                </div>
            `;

            committeeHTML += roleHTML;
        });

        committeeHTML += `
                    </div>
                </div>
            </div>
        `;

        resultsContainer.innerHTML += committeeHTML;
    });

    // Check if all positions have winners and show celebration modal
    checkElectionCompletion(committees, roles, votes, candidates);
}

function checkElectionCompletion(committees, roles, votes, candidates) {
    let completedPositions = 0;
    let totalPositions = roles.length;

    roles.forEach(role => {
        const roleVotes = votes.filter(vote => vote.role_id === role.id);
        if (roleVotes.length > 0) {
            completedPositions++;
        }
    });

    // Show celebration modal if election is complete (for demo purposes, showing after 50% completion)
    if (completedPositions >= totalPositions * 0.5 && !sessionStorage.getItem('celebrationShown')) {
        setTimeout(() => {
            document.getElementById('winnerModal').classList.remove('hidden');
            sessionStorage.setItem('celebrationShown', 'true');
        }, 2000);
    }
}

function hideWinnerModal() {
    document.getElementById('winnerModal').classList.add('hidden');
}

function exportResults(format) {
    const voters = JSON.parse(localStorage.getItem('users')) || [];
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const committees = JSON.parse(localStorage.getItem('committees'));
    const roles = JSON.parse(localStorage.getItem('roles'));

    let data, filename, mimeType;

    if (format === 'csv') {
        // Create CSV content
        let csvContent = "Committee,Position,Candidate,Votes,Percentage\n";
        
        committees.forEach(committee => {
            const committeeRoles = roles.filter(role => role.committee_id === committee.id);
            
            committeeRoles.forEach(role => {
                const roleCandidates = candidates.filter(candidate => candidate.role_id === role.id);
                const roleVotes = votes.filter(vote => vote.role_id === role.id);
                
                roleCandidates.forEach(candidate => {
                    const candidateVotes = roleVotes.filter(vote => vote.candidate_id === candidate.id).length;
                    const percentage = roleVotes.length > 0 ? ((candidateVotes / roleVotes.length) * 100).toFixed(2) : 0;
                    
                    csvContent += `"${committee.name}","${role.name}","${candidate.name}",${candidateVotes},${percentage}%\n`;
                });
            });
        });

        data = csvContent;
        filename = `election-results-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
    } else {
        // Create JSON content
        const results = {
            exportDate: new Date().toISOString(),
            totalVoters: voters.length,
            totalVotes: votes.length,
            voterTurnout: ((votes.length / voters.length) * 100).toFixed(2),
            results: {}
        };

        committees.forEach(committee => {
            results.results[committee.name] = {};
            const committeeRoles = roles.filter(role => role.committee_id === committee.id);
            
            committeeRoles.forEach(role => {
                results.results[committee.name][role.name] = {};
                const roleCandidates = candidates.filter(candidate => candidate.role_id === role.id);
                const roleVotes = votes.filter(vote => vote.role_id === role.id);
                
                roleCandidates.forEach(candidate => {
                    const candidateVotes = roleVotes.filter(vote => vote.candidate_id === candidate.id).length;
                    results.results[committee.name][role.name][candidate.name] = {
                        votes: candidateVotes,
                        percentage: roleVotes.length > 0 ? ((candidateVotes / roleVotes.length) * 100).toFixed(2) : 0
                    };
                });
            });
        });

        data = JSON.stringify(results, null, 2);
        filename = `election-results-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
    }

    // Create and trigger download
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    showExportSuccess();
}

function showExportSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3 text-xl"></i>
            <div>
                <strong class="block">Export Successful!</strong>
                <span>Results have been downloaded.</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function printResults() {
    window.print();
}