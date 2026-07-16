# BRUSHworks / MRPRODUCTION — Firecrawl Search Agent (wrap only)
# Usage (fresh PowerShell):
#   $env:FIRECRAWL_API_KEY = "fc-..."   # from https://www.firecrawl.dev/app/playground?endpoint=search
#   .\search.ps1 -Query "luxury cosmetics dropshipping suppliers"
#   .\search.ps1 -Query "unapologetic beauty brand SEO" -Limit 8 -OutFile ".\out\search.json"

param(
  [Parameter(Mandatory = $true)]
  [string]$Query,

  [int]$Limit = 5,

  [string]$OutFile = "",

  [string]$ApiBase = "https://api.firecrawl.dev"
)

$ErrorActionPreference = "Stop"

$key = $env:FIRECRAWL_API_KEY
if (-not $key) { $key = $env:FIRECRAWL_KEY }
if (-not $key) {
  Write-Host ""
  Write-Host "FIRECRAWL_API_KEY missing." -ForegroundColor Yellow
  Write-Host "1) Open https://www.firecrawl.dev/app/playground?endpoint=search"
  Write-Host "2) Copy your API key (fc-...)"
  Write-Host "3) In this PowerShell window:"
  Write-Host '   $env:FIRECRAWL_API_KEY = "fc-your-key"'
  Write-Host "4) Re-run this script."
  exit 1
}

$uri = "$ApiBase/v1/search"
$bodyObj = @{
  query = $Query
  limit = $Limit
}
$body = $bodyObj | ConvertTo-Json -Compress

Write-Host "Firecrawl search → $Query" -ForegroundColor Cyan

try {
  $resp = Invoke-RestMethod -Method Post -Uri $uri -Headers @{
    "Authorization" = "Bearer $key"
    "Content-Type"  = "application/json"
  } -Body $body -TimeoutSec 60
} catch {
  Write-Host "Firecrawl request failed: $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
  exit 1
}

# Normalize common response shapes
$items = @()
if ($resp.data) { $items = $resp.data }
elseif ($resp.web) { $items = $resp.web }
elseif ($resp.results) { $items = $resp.results }
elseif ($resp -is [System.Array]) { $items = $resp }

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "OK · $($items.Count) hits · $stamp" -ForegroundColor Green
Write-Host ""

$i = 1
foreach ($hit in $items) {
  $title = $hit.title
  if (-not $title) { $title = $hit.metadata.title }
  $url = $hit.url
  if (-not $url) { $url = $hit.metadata.sourceURL }
  if (-not $url) { $url = $hit.metadata.url }
  $desc = $hit.description
  if (-not $desc) { $desc = $hit.markdown }
  if (-not $desc) { $desc = $hit.content }
  if ($desc -and $desc.Length -gt 180) { $desc = $desc.Substring(0, 180) + "…" }

  Write-Host ("{0}. {1}" -f $i, $title)
  if ($url) { Write-Host "   $url" -ForegroundColor DarkGray }
  if ($desc) { Write-Host "   $desc" }
  Write-Host ""
  $i++
}

$payload = [ordered]@{
  brand       = "BRUSHworks"
  agent       = "firecrawl-search"
  fingerprint = "LIBRA-BW-AK-2026"
  query       = $Query
  limit       = $Limit
  at          = (Get-Date).ToString("o")
  raw         = $resp
}

if (-not $OutFile) {
  $outDir = Join-Path $PSScriptRoot "out"
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  $safe = ($Query -replace "[^a-zA-Z0-9]+", "-").Trim("-").ToLower()
  if ($safe.Length -gt 40) { $safe = $safe.Substring(0, 40) }
  $OutFile = Join-Path $outDir ("search-" + $safe + "-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".json")
}

$payload | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $OutFile -Encoding utf8
Write-Host "Saved: $OutFile" -ForegroundColor Cyan
