
document.getElementById('add-job-btn').addEventListener('click', function () {
    document.getElementById('job-modal').style.display = 'block';
});


document.querySelectorAll('.modal .close').forEach(btn => {
    btn.onclick = () => {
        btn.closest('.modal').style.display = 'none';
    };
});

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

document.getElementById('job-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);

    fetch('homepage.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {

        if (data.includes('Job added successfully')) {
            alert('Job added successfully!');
            this.reset();
            document.getElementById('job-modal').style.display = 'none';

            window.location.reload();
        } else {
            alert('Error adding job. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding job. Please try again.');
    });
});


function deleteJob(id) {
    if (confirm("Are you sure you want to delete this job?")) {
        const formData = new FormData();
        formData.append('delete_job_id', id);
        
        fetch('homepage.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('success') || data.includes('deleted')) {
                alert('Job deleted successfully!');
                window.location.reload();
            } else {
                alert('Failed to delete job.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting job.');
        });
    }
}


function editJob(id, currentTitle) {
    const newTitle = prompt("Edit job title:", currentTitle || "");
    
    if (newTitle !== null && newTitle.trim() !== "") {
        const formData = new FormData();
        formData.append('edit_job_id', id);
        formData.append('new_job_title', newTitle.trim());
        
        fetch('homepage.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('success') || data.includes('updated')) {
                alert('Job updated successfully!');
                window.location.reload();
            } else {
                alert('Failed to update job.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating job.');
        });
    }
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        

        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        

        this.classList.add('active');
        

        const pageId = this.getAttribute('data-page') + '-page';
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
            
            if (pageId === 'ranking-page') {
                loadRankingData();
            } else if (pageId === 'dashboard-page') {
                loadDashboardCharts();
            }
        }
    });
});


function loadRankingData() {
    const jobPosition = document.getElementById('job-position').value;
    console.log('Loading ranking data for:', jobPosition);
}


function loadDashboardCharts() {
    initializeCharts();
}


function initializeCharts() {

    const applicantsCtx = document.getElementById('applicantsChart');
    if (applicantsCtx && !applicantsCtx.chart) {
        applicantsCtx.chart = new Chart(applicantsCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Applicants',
                    data: [12, 19, 3, 5, 2, 3, 9],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    const openingsCtx = document.getElementById('openingsChart');
    if (openingsCtx && !openingsCtx.chart) {
        openingsCtx.chart = new Chart(openingsCtx, {
            type: 'bar',
            data: {
                labels: ['Treasury', 'Faculty', 'Guidance', 'Laboratory'],
                datasets: [{
                    label: 'Applicants',
                    data: [65, 59, 80, 81],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    

    const statusCtx = document.getElementById('statusChart');
    if (statusCtx && !statusCtx.chart) {
        statusCtx.chart = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Accepted', 'Rejected'],
                datasets: [{
                    data: [234, 32, 45],
                    backgroundColor: [
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}


document.getElementById('job-position')?.addEventListener('change', function() {
    loadRankingData();
});

document.getElementById('generate-link-btn')?.addEventListener('click', function() {

    const link = window.location.origin + '/apply.php';
    navigator.clipboard.writeText(link).then(() => {
        alert('Application link copied to clipboard: ' + link);
    }).catch(() => {
        prompt('Copy this application link:', link);
    });
});

document.addEventListener('DOMContentLoaded', function() {

    setTimeout(initializeCharts, 100);
});


function viewResume(applicantId) {

    document.getElementById('resume-modal').style.display = 'block';
    document.getElementById('resume-content').innerHTML = 'Loading resume...';
    

    fetch(`get_resume.php?id=${applicantId}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('resume-content').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('resume-content').innerHTML = 'Error loading resume.';
        });
}