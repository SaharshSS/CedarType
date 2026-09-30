$ErrorActionPreference = "Stop"

$AppDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepositoryRoot = Split-Path -Parent $AppDirectory
$ProfilesPath = Join-Path $AppDirectory "Resources\LanguageProfiles.json"
$OutputDirectory = Join-Path $AppDirectory "dist"

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ProfilesPath) | Out-Null
node (Join-Path $RepositoryRoot "mac-app\export-profiles.mjs") $ProfilesPath
if ($LASTEXITCODE -ne 0) { throw "Could not export CedarType language profiles." }

dotnet publish (Join-Path $AppDirectory "CedarType.Windows.csproj") `
  --configuration Release `
  --runtime win-x64 `
  --self-contained true `
  --output $OutputDirectory `
  -p:PublishSingleFile=true `
  -p:IncludeNativeLibrariesForSelfExtract=true
if ($LASTEXITCODE -ne 0) { throw "The CedarType Windows build failed." }

Write-Host "Built CedarType for Windows: $OutputDirectory\CedarType.exe"
