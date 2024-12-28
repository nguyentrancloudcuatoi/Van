// Authentication check
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'templates/login.html';
        return null;
    }
    return JSON.parse(user);
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // Update UI based on user role
    updateUIForRole(user.role);
    
    // Update user info in all places
    updateUserInfo(user);
    
    // Initialize all event listeners
    initializeEventListeners();
});

function updateUserInfo(user) {
    // Update sidebar user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 
        user.role === 'admin' ? 'Quản trị viên' : 
        user.role === 'teacher' ? 'Giáo viên' : 'Sinh viên';
        
    // Update header user info
    const headerUserName = document.querySelector('#userProfile span');
    if (headerUserName) {
        headerUserName.textContent = user.name;
    }

    // Update dashboard content based on role
    updateDashboardContent(user);
}

function updateDashboardContent(user) {
    // Update quick stats
    const statsSection = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    if (statsSection) {
        if (user.role === 'student') {
            statsSection.innerHTML = `
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Điểm Trung Bình</p>
                            <h3 class="text-2xl font-bold">${user.stats.gpa}</h3>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <i class="fas fa-graduation-cap text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Môn Học Đang Học</p>
                            <h3 class="text-2xl font-bold">${user.stats.currentCourses}</h3>
                        </div>
                        <div class="bg-green-100 p-3 rounded-full">
                            <i class="fas fa-book text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Tín Chỉ Tích Lũy</p>
                            <h3 class="text-2xl font-bold">${user.stats.totalCredits}</h3>
                        </div>
                        <div class="bg-yellow-100 p-3 rounded-full">
                            <i class="fas fa-star text-yellow-500 text-xl"></i>
                        </div>
                    </div>
                </div>`;
        } else if (user.role === 'teacher') {
            statsSection.innerHTML = `
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Lớp Đang Dạy</p>
                            <h3 class="text-2xl font-bold">${user.stats.currentClasses}</h3>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <i class="fas fa-chalkboard-teacher text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Sinh Viên</p>
                            <h3 class="text-2xl font-bold">${user.stats.totalStudents}</h3>
                        </div>
                        <div class="bg-green-100 p-3 rounded-full">
                            <i class="fas fa-users text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Bài Kiểm Tra</p>
                            <h3 class="text-2xl font-bold">${user.stats.examCount}</h3>
                        </div>
                        <div class="bg-yellow-100 p-3 rounded-full">
                            <i class="fas fa-file-alt text-yellow-500 text-xl"></i>
                        </div>
                    </div>
                </div>`;
        } else if (user.role === 'admin') {
            statsSection.innerHTML = `
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Tổng Sinh Viên</p>
                            <h3 class="text-2xl font-bold">${user.stats.totalStudents}</h3>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <i class="fas fa-users text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Tổng Giáo Viên</p>
                            <h3 class="text-2xl font-bold">${user.stats.totalTeachers}</h3>
                        </div>
                        <div class="bg-green-100 p-3 rounded-full">
                            <i class="fas fa-chalkboard-teacher text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500">Tổng Môn Học</p>
                            <h3 class="text-2xl font-bold">${user.stats.totalCourses}</h3>
                        </div>
                        <div class="bg-yellow-100 p-3 rounded-full">
                            <i class="fas fa-book text-yellow-500 text-xl"></i>
                        </div>
                    </div>
                </div>`;
        }
    }

    // Update recent activities
    updateRecentActivities(user);
}

function updateRecentActivities(user) {
    const activitiesContainer = document.querySelector('.recent-activities');
    if (activitiesContainer && user.stats.recentActivities) {
        const activitiesHTML = user.stats.recentActivities.map(activity => `
            <div class="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div class="bg-blue-100 p-2 rounded-full">
                    <i class="fas fa-bell text-blue-500"></i>
                </div>
                <div>
                    <h4 class="font-medium">${activity.action}</h4>
                    <span class="text-gray-400 text-xs">${activity.time}</span>
                </div>
            </div>
        `).join('');
        
        activitiesContainer.innerHTML = activitiesHTML;
    }
}
function initializeEventListeners() {
    // Toggle user dropdown
    const userProfileButton = document.querySelector('#userProfile button');
    if (userProfileButton) {
        userProfileButton.addEventListener('click', toggleUserMenu);
    }

    // Toggle notifications
    const notificationButton = document.querySelector('.notifications button');
    if (notificationButton) {
        notificationButton.addEventListener('click', toggleNotifications);
    }

    // Global search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', handleOutsideClick);
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('hidden');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('hidden');
}

function handleSearch(e) {
    const searchResults = document.getElementById('searchResults');
    if (e.target.value.length > 0) {
        searchResults.classList.remove('hidden');
        // Add your search logic here
    } else {
        searchResults.classList.add('hidden');
    }
}

function handleOutsideClick(e) {
    // Close user dropdown if clicking outside
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    if (!userProfile?.contains(e.target) && !userDropdown?.classList.contains('hidden')) {
        userDropdown.classList.add('hidden');
    }

    // Close notifications if clicking outside
    const notificationsButton = document.querySelector('.notifications');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    if (!notificationsButton?.contains(e.target) && !notificationsDropdown?.classList.contains('hidden')) {
        notificationsDropdown.classList.add('hidden');
    }
}

// Logout functions
function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function confirmLogout() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
    localStorage.removeItem('user');
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
        window.location.href = 'templates/login.html';
    }, 1000);
}

// Close modal when clicking outside
document.getElementById('logoutModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideLogoutModal();
    }
});
