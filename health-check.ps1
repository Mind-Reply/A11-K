while($true) {
    Write-Host "Monitoring MRPRODUCTION Estate Health..." -ForegroundColor Cyan
    curl.exe -I https://escrow.a11-k.dev
    Start-Sleep -Seconds 60
}
