@echo off
REM Usage: ollama_pull_and_run.bat [model]
SETLOCAL
IF "%~1"=="" (
  set "MODEL=deepseek-coder:6.7b"
) ELSE (
  set "MODEL=%~1"
)
echo Pulling model %MODEL% (may take a while)...
ollama pull %MODEL%
IF ERRORLEVEL 1 (
  echo Pull failed. Exiting.
  EXIT /B 1
)
echo Starting model %MODEL%...
ollama run %MODEL%
ENDLOCAL
