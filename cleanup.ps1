# สคริปต์สำหรับลบไฟล์ที่ไม่จำเป็น (Frontend)
# Clean unnecessary files script

Write-Host "Cleaning unnecessary files..." -ForegroundColor Green

# ลบ dist directory หากมี
if (Test-Path "dist") {
    Write-Host "Removing dist directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}

# ลบ build directory หากมี
if (Test-Path "build") {
    Write-Host "Removing build directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "build" -ErrorAction SilentlyContinue
}

# ลบ logs หากมี
if (Test-Path "logs") {
    Write-Host "Removing logs directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "logs" -ErrorAction SilentlyContinue
}

# ลบไฟล์ log
$logFiles = Get-ChildItem -Path . -Name "*.log" -ErrorAction SilentlyContinue
if ($logFiles) {
    foreach ($logFile in $logFiles) {
        Write-Host "Removing log file: $logFile" -ForegroundColor Yellow
        Remove-Item $logFile -Force -ErrorAction SilentlyContinue
    }
}

# ลบ temporary files
if (Test-Path "tmp") {
    Write-Host "Removing tmp directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "tmp" -ErrorAction SilentlyContinue
}

if (Test-Path "temp") {
    Write-Host "Removing temp directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "temp" -ErrorAction SilentlyContinue
}

# ลบ .vite cache
if (Test-Path ".vite") {
    Write-Host "Removing .vite cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".vite" -ErrorAction SilentlyContinue
}

# ลบ coverage reports
if (Test-Path "coverage") {
    Write-Host "Removing coverage directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "coverage" -ErrorAction SilentlyContinue
}

# Clean npm cache (global)
Write-Host "Cleaning npm cache..." -ForegroundColor Blue
npm cache clean --force 2>$null

Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host "Current directory size:"
$size = (Get-ChildItem -Recurse -Exclude node_modules | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "$([math]::Round($size, 2)) MB (excluding node_modules)" -ForegroundColor Cyan
