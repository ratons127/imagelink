param(
  [string]$ApiBaseUrl = "https://imagelink.qtiqo.com/api/"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$gradleWrapper = Join-Path $projectRoot "gradlew.bat"

if (-not (Test-Path $gradleWrapper)) {
  throw "gradlew.bat not found at $gradleWrapper"
}

Write-Host "Building release AAB with API URL: $ApiBaseUrl"
& $gradleWrapper bundleRelease "-PTASKFLOW_RELEASE_API_BASE_URL=$ApiBaseUrl"
