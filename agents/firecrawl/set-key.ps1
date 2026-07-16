# Set FIRECRAWL_API_KEY for this user (never prints the value)
# Fresh PowerShell:
#   .\set-key.ps1
# Or:
#   .\set-key.ps1 -Key "fc-..."

param(
  [string]$Key = ""
)

$ErrorActionPreference = "Stop"

if (-not $Key) {
  Write-Host "Paste Firecrawl key (fc-...). Input is hidden." -ForegroundColor Cyan
  Write-Host "Get it: https://www.firecrawl.dev/app/playground?endpoint=search"
  $secure = Read-Host -AsSecureString "FIRECRAWL_API_KEY"
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $Key = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$Key = $Key.Trim()
if (-not $Key.StartsWith("fc-")) {
  Write-Host "Key should start with fc- — aborting." -ForegroundColor Yellow
  exit 1
}

# Session
$env:FIRECRAWL_API_KEY = $Key

# User permanent
[System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", $Key, "User")

Write-Host "OK — FIRECRAWL_API_KEY set for this session + User env (len=$($Key.Length))." -ForegroundColor Green
Write-Host "Test: .\search.ps1 -Query `"luxury cosmetics dropshipping`""
Write-Host "GitHub: https://github.com/Mind-Reply/A11-K/settings/secrets/actions → New secret FIRECRAWL_API_KEY"
