@echo off
setlocal
title NAPLEX Study Companion
set "NAPLEX_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%NAPLEX_PY%" goto bundled
where py >nul 2>&1
if not errorlevel 1 goto pylauncher
where python >nul 2>&1
if not errorlevel 1 goto systempython
echo Python 3 was not found. Install Python from https://www.python.org/downloads/ and run this file again.
goto end
:bundled
"%NAPLEX_PY%" "%~dp0local-server.py"
goto end
:pylauncher
py -3 "%~dp0local-server.py"
goto end
:systempython
python "%~dp0local-server.py"
:end
echo.
pause
