# RASD Pothole System Startup

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " RASD Pothole Detection System" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not installed!" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "`n"
}

# Start server
Write-Host "🚀 Starting server..." -ForegroundColor Green
Write-Host "   Dashboard: http://localhost:3000/demo-dashboard.html`n" -ForegroundColor Cyan

node backend/server.js
