@echo off
:: Check for Administrator privileges
NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    echo [SUCCESS] Running with Administrator privileges.
) else (
    echo.
    echo =================================================================
    echo [ERROR] This script is NOT running as Administrator.
    echo.
    echo Please close this window.
    echo Right-click on 'safe_install_pg.bat' and select "Run as administrator".
    echo =================================================================
    echo.
    pause
    exit
)

:: Create a clean temp directory
if not exist "c:\Users\audwl\pium\pium\pg_install_temp" mkdir "c:\Users\audwl\pium\pium\pg_install_temp"

:: Force the environment variables to use this new directory
set TMP=c:\Users\audwl\pium\pium\pg_install_temp
set TEMP=c:\Users\audwl\pium\pium\pg_install_temp

echo.
echo Environment variables updated:
echo TMP=%TMP%
echo TEMP=%TEMP%
echo.

echo Launching PostgreSQL Installer...
:: Run the installer
"c:\Users\audwl\pium\pium\pg_temp\postgresql-18.1-1-windows-x64.exe"

pause
