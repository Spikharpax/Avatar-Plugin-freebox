@echo off
set "PATH=..\..\..\nodejs;..\..\..\npm;%~dp0;%PATH%"
setlocal enabledelayedexpansion
pushd "%~dp0"
set print_version=..\..\..\nodejs\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
for /F "usebackq delims=" %%v in (`%print_version%`) do set version=%%v
popd
endlocal
rem Stating Avatar
cls
call node FreeAuth.js
