// Global state
let map;
let markers = {};
let potholes = [];
let currentFilters = {
    status: 'all',
    sort: 'newest'
};
let nextId = 1;

// Detection type colors for markers
const DETECTION_COLORS = {
    Camera: '#3b82f6',
    LiDAR: '#10b981',
    Both: '#8b5cf6'
};

const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved'
};

// Initialize map
function initMap() {
    // Center on Riyadh
    map = L.map('map').setView([24.7136, 46.6753], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    console.log('Map initialized');
}

// Create custom marker icon
function createMarkerIcon(detectionType) {
    const color = DETECTION_COLORS[detectionType] || DETECTION_COLORS.Camera;

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// Add pothole marker to map
function addPotholeMarker(pothole) {
    const marker = L.marker([pothole.latitude, pothole.longitude], {
        icon: createMarkerIcon(pothole.detectionType)
    }).addTo(map);

    // Create popup content
    const popupContent = `
        <div style="padding: 0.5rem;">
            <h4 style="margin-bottom: 0.5rem;">Pothole #${pothole.id}</h4>
            <p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Detection:</strong> ${pothole.detectionType}</p>
            <p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Confidence:</strong> ${pothole.confidence.toFixed(1)}%</p>
            <p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Status:</strong> ${STATUS_LABELS[pothole.status]}</p>
            <p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Detected:</strong> ${formatDate(pothole.timestamp)}</p>
        </div>
    `;

    marker.bindPopup(popupContent);
    markers[pothole.id] = marker;

    return marker;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get intervention urgency text
function getInterventionText(severity) {
    if (severity === 'high') {
        return 'High Priority - Intervention needed within 24 hours';
    } else if (severity === 'medium') {
        return 'Medium Priority - Intervention needed within 1 week';
    } else {
        return 'Low Priority - Schedule for routine maintenance';
    }
}

// Render pothole list
function renderPotholeList() {
    const listContainer = document.getElementById('potholeList');
    console.log('🔍 renderPotholeList called. Potholes array length:', potholes.length);
    console.log('🔍 List container:', listContainer);

    if (!listContainer) {
        console.error('❌ potholeList element not found!');
        return;
    }

    // Apply filters
    let filteredPotholes = potholes.filter(p => {
        if (currentFilters.status !== 'all' && p.status !== currentFilters.status) {
            return false;
        }
        return true;
    });
    console.log('🔍 Filtered potholes:', filteredPotholes.length);

    // Apply sorting
    filteredPotholes.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'newest':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'oldest':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'depth_high':
                return b.depth - a.depth;
            case 'depth_low':
                return a.depth - b.depth;
            case 'severity':
                const severityOrder = { high: 0, medium: 1, low: 2 };
                return severityOrder[a.severity] - severityOrder[b.severity];
            default:
                return 0;
        }
    });

    if (filteredPotholes.length === 0) {
        listContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6b7280;">No potholes found.</div>';
        return;
    }

    // Render list items
    const htmlContent = filteredPotholes.map(pothole => `
        <div class="pothole-item" data-id="${pothole.id}">
            <div class="pothole-item-header">
                <h4>Pothole #${pothole.id}</h4>
            </div>
            <div class="pothole-item-body">
                <div class="pothole-info">
                    <div class="info-row">
                        <span class="info-label">Resolved?</span>
                        <div class="status-checkbox-container">
                            <input
                                type="checkbox"
                                class="status-checkbox"
                                id="status-${pothole.id}"
                                ${pothole.status === 'resolved' ? 'checked' : ''}
                                onchange="togglePotholeStatus(${pothole.id}, this.checked)"
                            >
                        </div>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Location:</span>
                        <span class="info-value">${pothole.latitude.toFixed(6)}, ${pothole.longitude.toFixed(6)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Detected:</span>
                        <span class="info-value">${formatDate(pothole.timestamp)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    console.log('🔍 Generated HTML length:', htmlContent.length);
    console.log('🔍 Setting innerHTML now...');
    listContainer.innerHTML = htmlContent;
    console.log('✅ innerHTML set. Current innerHTML length:', listContainer.innerHTML.length);
}

// Update statistics
function updateStatistics() {
    const totalCount = potholes.length;

    // Update total count next to "Pothole Details" heading
    const totalCountElement = document.getElementById('totalPotholesCount');
    if (totalCountElement) {
        totalCountElement.textContent = `(${totalCount})`;
    }
}

// Toggle pothole status (checkbox function)
async function togglePotholeStatus(id, isResolved) {
    const pothole = potholes.find(p => p.id === id);
    if (pothole) {
        const newStatus = isResolved ? 'resolved' : 'pending';

        try {
            const response = await fetch(`/api/potholes/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();
            if (result.success) {
                pothole.status = newStatus;
                renderPotholeList();
                updateStatistics();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
}

// Generate random pothole
function generateRandomPothole() {
    const severities = ['high', 'medium', 'low'];
    const statuses = ['pending', 'resolved'];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    // Generate random location around Riyadh
    const latOffset = (Math.random() - 0.5) * 0.3;
    const lngOffset = (Math.random() - 0.5) * 0.3;

    // Depth based on severity
    let depth;
    if (severity === 'high') {
        depth = 5 + Math.random() * 5; // 5-10 cm
    } else if (severity === 'medium') {
        depth = 3 + Math.random() * 2; // 3-5 cm
    } else {
        depth = 1 + Math.random() * 2; // 1-3 cm
    }

    const pothole = {
        id: nextId++,
        latitude: 24.7136 + latOffset,
        longitude: 46.6753 + lngOffset,
        depth: depth,
        severity: severity,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: new Date().toISOString(),
        sensor_id: `RASD-${Math.floor(Math.random() * 100)}`
    };

    return pothole;
}

// Add random pothole (demo function)
function addRandomPothole() {
    const pothole = generateRandomPothole();
    potholes.unshift(pothole);
    addPotholeMarker(pothole);
    renderPotholeList();
    updateStatistics();

    // Zoom to new pothole
    map.setView([pothole.latitude, pothole.longitude], 14);
    markers[pothole.id].openPopup();
}

// Generate initial demo data
function generateInitialData() {
    // Add ONLY the specific pothole with given coordinates
    const specificPothole = {
        id: 1,
        latitude: 24.80534553,
        longitude: 46.66214752,
        depth: 4.5,
        severity: 'medium',
        status: 'pending',
        timestamp: new Date().toISOString(),
        sensor_id: 'RASD-001'
    };
    potholes.push(specificPothole);
    addPotholeMarker(specificPothole);

    console.log('✅ Added 1 pothole with coordinates:', specificPothole.latitude, specificPothole.longitude);

    renderPotholeList();
    updateStatistics();
}
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in (simple demo check)
    const isLoggedIn = sessionStorage.getItem('demoLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'demo-login.html';
        return;
    }

    // Initialize map
    initMap();

    // If running as a local file (file:// protocol), load demo data immediately
    if (window.location.protocol === 'file:') {
        console.log('📁 Running as local file - loading demo data');
        // Use setTimeout to ensure DOM is fully ready
        setTimeout(() => {
            console.log('⏱️ Executing generateInitialData after timeout');
            generateInitialData();
        }, 100);
    } else {
        // Load real data from backend only if running on a server
        loadPotholes();
        // Refresh data every 5 seconds
        setInterval(loadPotholes, 5000);
    }

    // Filter controls
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        renderPotholeList();
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        renderPotholeList();
    });
});

// Load potholes from backend API
async function loadPotholes() {
    try {
        const response = await fetch('/api/potholes');
        const result = await response.json();

        if (result.success) {
            // Clear old markers
            Object.values(markers).forEach(marker => map.removeLayer(marker));
            markers = {};

            // Update potholes array
            potholes = result.data;
            nextId = potholes.length > 0 ? Math.max(...potholes.map(p => p.id)) + 1 : 1;

            // Add new markers
            potholes.forEach(pothole => addPotholeMarker(pothole));

            // Update UI
            renderPotholeList();
            updateStatistics();
        }
    } catch (error) {
        console.log('⚠️ API not available, using demo data');
        // If API fails, load demo data instead
        if (potholes.length === 0) {
            generateInitialData();
        }
    }
}
