# Installs/removes DiDi autostart at Windows logon via Task Scheduler.
# Fully background — start-hidden.vbs runs npm start with zero visible window.
#
# Usage:
#   powershell -File scripts/autostart.ps1 -Install
#   powershell -File scripts/autostart.ps1 -Uninstall
#   powershell -File scripts/autostart.ps1 -Status

param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Status
)

$TaskName = "DiDi Assistant Autostart"
$ScriptDir = Split-Path -Parent $PSScriptRoot
$VbsPath = Join-Path $ScriptDir "start-hidden.vbs"

if ($Install) {
    if (-not (Test-Path $VbsPath)) {
        Write-Error "Not found: $VbsPath"
        exit 1
    }
    $action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$VbsPath`""
    $trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit ([TimeSpan]::Zero)

    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -RunLevel Limited -Force | Out-Null

    Write-Output "Done: DiDi will start at Windows logon (no visible window)."
    Write-Output "First-run log after reboot: assistant/didi-boot.log"
}
elseif ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Output "Autostart removed."
}
elseif ($Status) {
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($task) {
        Write-Output "Autostart installed. State: $($task.State)"
    } else {
        Write-Output "Autostart not installed."
    }
}
else {
    Write-Output "Pass -Install, -Uninstall, or -Status."
}
