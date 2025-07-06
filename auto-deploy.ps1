# Auto Deploy Script สำหรับ Frontend POS (PowerShell)
# ใช้สำหรับ auto commit และ push ทุกครั้งที่มีการแก้ไข

Write-Host "Starting auto-deploy for Frontend POS..." -ForegroundColor Green

# ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
$unstagedChanges = git status --porcelain
$hasChanges = $unstagedChanges.Length -gt 0

if ($hasChanges) {
    Write-Host "Changes detected, preparing to commit..." -ForegroundColor Yellow
    
    # เพิ่มไฟล์ทั้งหมด
    git add -A
    
    # สร้าง commit message อัตโนมัติ
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $branch = git branch --show-current
    
    # ตรวจสอบว่ามีไฟล์อะไรเปลี่ยนแปลงบ้าง
    $changedFiles = git diff --cached --name-only | Select-Object -First 5
    $filesList = $changedFiles | ForEach-Object { "- $_" } | Out-String
    
    $commitMsg = @"
Auto-deploy: Frontend updates ($timestamp)

Modified files:
$filesList
Branch: $branch
Timestamp: $timestamp
"@

    # Commit การเปลี่ยนแปลง
    Write-Host "Committing changes..." -ForegroundColor Blue
    git commit -m "$commitMsg"
    
    if ($LASTEXITCODE -eq 0) {
        # Push ไปยัง origin
        Write-Host "Pushing to origin/$branch..." -ForegroundColor Blue
        git push origin $branch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Auto-deploy completed successfully!" -ForegroundColor Green
            Write-Host "Frontend changes have been deployed" -ForegroundColor Green
            Write-Host "Check your hosting platform for deployment status" -ForegroundColor Cyan
        } else {
            Write-Host "Push failed! Please check your Git configuration" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Commit failed! Please check your changes" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "No changes detected. Nothing to deploy." -ForegroundColor Gray
}

Write-Host "Auto-deploy script finished." -ForegroundColor Green
