$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$backendDirectory = Join-Path $projectRoot 'backend'
$frontendDirectory = Join-Path $projectRoot 'frontend'
$pythonExecutable = Join-Path $backendDirectory '.venv/Scripts/python.exe'
$nodeExecutable = (Get-Command node -ErrorAction Stop).Source
$nextExecutable = Join-Path $frontendDirectory 'node_modules/next/dist/bin/next'
$logDirectory = Join-Path $projectRoot 'output'
if (!(Test-Path -LiteralPath $pythonExecutable) -or !(Test-Path -LiteralPath $nextExecutable)) {
    throw 'Install the dependencies described in README.md first.'
}
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
if (!(Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $pythonExecutable -ArgumentList '-m uvicorn app:app --host 127.0.0.1 --port 8000' -WorkingDirectory $backendDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'api.log') -RedirectStandardError (Join-Path $logDirectory 'api-error.log') | Out-Null
} else { Write-Host 'Port 8000 is already in use. Keeping the existing process.' }
if (!(Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $nodeExecutable -ArgumentList @(('"' + $nextExecutable + '"'), 'dev', '--hostname', '127.0.0.1', '--port', '3000') -WorkingDirectory $frontendDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'web.log') -RedirectStandardError (Join-Path $logDirectory 'web-error.log') | Out-Null
} else { Write-Host 'Port 3000 is already in use. Keeping the existing process.' }
Write-Host 'Design Farm: http://127.0.0.1:3000'
