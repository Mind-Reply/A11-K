# Firecrawl Scrape Agent — wrap only
# Usage:
#   $env:FIRECRAWL_API_KEY = "fc-..."
#   .\scrape.ps1 -Url "https://example.com"

param(
  [Parameter(Mandatory = $true)]
  [string]$Url,

  [string]$OutFile = "",

  [string]$ApiBase = "https://api.firecrawl.dev"
)

$ErrorActionPreference = "Stop"
$key = $env:FIRECRAWL_API_KEY
if (-not $key) { $key = $env:FIRECRAWL_KEY }
if (-not $key) {
  Write-Host "Set FIRECRAWL_API_KEY from https://www.firecrawl.dev/app/playground?endpoint=search" -ForegroundColor Yellow
  exit 1
}

$uri = "$ApiBase/v1/scrape"
$body = @{ url = $Url; formats = @("markdown", "links") } | ConvertTo-Json -Compress

Write-Host "Firecrawl scrape → $Url" -ForegroundColor Cyan
$resp = Invoke-RestMethod -Method Post -Uri $uri -Headers @{
  Authorization = "Bearer $key"
  "Content-Type" = "application/json"
} -Body $body -TimeoutSec 90

if (-not $OutFile) {
  $outDir = Join-Path $PSScriptRoot "out"
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  $OutFile = Join-Path $outDir ("scrape-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".json")
}

$resp | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $OutFile -Encoding utf8
Write-Host "Saved: $OutFile" -ForegroundColor Green
if ($resp.data.markdown) {
  $preview = $resp.data.markdown
  if ($preview.Length -gt 400) { $preview = $preview.Substring(0, 400) + "…" }
  Write-Host $preview
}
