$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$frontend = Join-Path $root 'frontend'

function Get-BackendProcessIds {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$Ports
    )

    $processIds = New-Object System.Collections.Generic.HashSet[int]

    foreach ($port in $Ports) {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($procId in ($connections | Select-Object -ExpandProperty OwningProcess -Unique)) {
                [void]$processIds.Add([int]$procId)
            }
        }
    }

    $backendHints = @(
        $root.Path,
        'nest start --watch',
        'nest start --debug --watch',
        'dist/main.js',
        'dist\main.js',
        'src/main.ts',
        'ts-node'
    )

    $processes = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine }
    foreach ($process in $processes) {
        foreach ($hint in $backendHints) {
            if ($process.CommandLine -like "*${hint}*") {
                [void]$processIds.Add([int]$process.ProcessId)
                break
            }
        }
    }

    return $processIds
}

function Stop-ListeningPort {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        Write-Host "[ok] Port $Port is free"
        return
    }

    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        try {
            Stop-Process -Id $procId -Force -ErrorAction Stop
            Write-Host "[kill] Stopped PID $procId on port $Port"
        }
        catch {
            Write-Warning "Could not stop PID $procId on port ${Port}: $($_.Exception.Message)"
        }
    }
}

function Stop-BackendProcesses {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$Ports
    )

    $processIds = Get-BackendProcessIds -Ports $Ports
    if (-not $processIds.Count) {
        Write-Host "[ok] No backend processes found"
        return
    }

    foreach ($procId in $processIds) {
        try {
            Stop-Process -Id $procId -Force -ErrorAction Stop
            Write-Host "[kill] Stopped backend PID $procId"
        }
        catch {
            Write-Warning "Could not stop backend PID ${procId}: $($_.Exception.Message)"
        }
    }
}

Write-Host "=== Clean start MME ==="
Stop-BackendProcesses -Ports @(3000, 5173)
Stop-ListeningPort -Port 3000
Stop-ListeningPort -Port 5173

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$root'; npm run start:dev"
)

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$frontend'; npm run dev"
)

Write-Host "[run] Backend:  http://localhost:3000"
Write-Host "[run] Frontend: http://localhost:5173"
Write-Host "Close the spawned terminals to stop servers."
