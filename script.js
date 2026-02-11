// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Navigation Menu Active State
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

// Search Filter
const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('tableBody');
const tableRows = tableBody.querySelectorAll('tr');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    tableRows.forEach(row => {
        const product = row.getAttribute('data-product').toLowerCase();
        const user = row.getAttribute('data-user').toLowerCase();
        const text = row.textContent.toLowerCase();
        
        if (product.includes(searchTerm) || user.includes(searchTerm) || text.includes(searchTerm)) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
});

// Table Sorting
const sortBtn = document.getElementById('sortBtn');
let sortAscending = true;

sortBtn.addEventListener('click', () => {
    const rows = Array.from(tableRows);
    
    rows.sort((a, b) => {
        const amountA = parseInt(a.getAttribute('data-amount'));
        const amountB = parseInt(b.getAttribute('data-amount'));
        
        return sortAscending ? amountA - amountB : amountB - amountA;
    });
    
    rows.forEach(row => tableBody.appendChild(row));
    
    sortAscending = !sortAscending;
    
    // Update button text and icon
    const icon = sortBtn.querySelector('svg polyline');
    if (sortAscending) {
        sortBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            Sort by Amount
        `;
    } else {
        sortBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            Sort by Amount
        `;
    }
});

// KPI Update Function
function generateKPIValue(base, variance) {
    return base + Math.floor(Math.random() * variance) - variance / 2;
}

function generatePercentage() {
    return (Math.random() * 20 - 5).toFixed(1);
}

function updateKPIs() {
    // Update Revenue
    const revenue = generateKPIValue(45000, 10000);
    const revenueChange = generatePercentage();
    document.getElementById('kpiRevenue').textContent = `$${revenue.toLocaleString()}`;
    document.getElementById('kpiRevenue').nextElementSibling.textContent = `${revenueChange > 0 ? '+' : ''}${revenueChange}%`;
    document.getElementById('kpiRevenue').nextElementSibling.className = `kpi-change ${revenueChange > 0 ? 'positive' : 'negative'}`;
    
    // Update Orders
    const orders = generateKPIValue(1200, 300);
    const ordersChange = generatePercentage();
    document.getElementById('kpiOrders').textContent = orders.toLocaleString();
    document.getElementById('kpiOrders').nextElementSibling.textContent = `${ordersChange > 0 ? '+' : ''}${ordersChange}%`;
    document.getElementById('kpiOrders').nextElementSibling.className = `kpi-change ${ordersChange > 0 ? 'positive' : 'negative'}`;
    
    // Update Users
    const users = generateKPIValue(8500, 1000);
    const usersChange = generatePercentage();
    document.getElementById('kpiUsers').textContent = users.toLocaleString();
    document.getElementById('kpiUsers').nextElementSibling.textContent = `${usersChange > 0 ? '+' : ''}${usersChange}%`;
    document.getElementById('kpiUsers').nextElementSibling.className = `kpi-change ${usersChange > 0 ? 'positive' : 'negative'}`;
    
    // Update Conversion
    const conversion = (Math.random() * 5 + 1).toFixed(2);
    const conversionChange = generatePercentage();
    document.getElementById('kpiConversion').textContent = `${conversion}%`;
    document.getElementById('kpiConversion').nextElementSibling.textContent = `${conversionChange > 0 ? '+' : ''}${conversionChange}%`;
    document.getElementById('kpiConversion').nextElementSibling.className = `kpi-change ${conversionChange > 0 ? 'positive' : 'negative'}`;
}

// Refresh Button
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => {
    updateKPIs();
    drawChart();
});

// Auto-update KPIs every 5 seconds
setInterval(updateKPIs, 5000);

// Simple Chart Drawing
const canvas = document.getElementById('revenueChart');
const ctx = canvas.getContext('2d');

function drawChart() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get theme colors
    const isDark = html.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const barColor = '#4f46e5';
    
    // Generate random data for 12 months
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push(Math.random() * 80 + 20);
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length;
    
    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / 100) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        const actualBarWidth = barWidth * 0.8;
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, barColor + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
        
        // Draw month labels
        ctx.fillStyle = textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(months[index], x + actualBarWidth / 2, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = 100 - (i * 20);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(`$${value}k`, padding - 10, y + 4);
    }
}

// Initialize chart
function initChart() {
    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth - 48; // Account for padding
    canvas.height = 300;
    drawChart();
}

// Redraw chart on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initChart();
    }, 250);
});

// Redraw chart on theme change
const observer = new MutationObserver(() => {
    drawChart();
});
observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

// Initialize on page load
window.addEventListener('load', () => {
    initChart();
});
