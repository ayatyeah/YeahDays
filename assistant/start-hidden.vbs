' Запускает "npm start" совсем без окна консоли — тем же способом, что
' используют для тихого автозапуска на Windows десятилетиями (WScript.Shell
' с параметром окна 0). PowerShell/cmd напрямую из Task Scheduler иногда всё
' равно мигают окном на долю секунды — этот способ не мигает вообще.
Set objShell = CreateObject("WScript.Shell")
scriptDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
objShell.CurrentDirectory = scriptDir
objShell.Run "cmd /c chcp 65001 >nul && npm start >> didi-boot.log 2>&1", 0, False
