@echo off
chcp 65001 >nul
echo ========================================================
echo   성장 서재 50 (50books) - GitHub 최신 코드 자동 업데이트
echo   경로: C:\Users\user\Documents\ChatGPT\50books
echo ========================================================
echo.

set "TARGET_DIR=C:\Users\user\Documents\ChatGPT\50books"

if not exist "C:\Users\user\Documents\ChatGPT" (
    mkdir "C:\Users\user\Documents\ChatGPT"
)

if exist "%TARGET_DIR%\.git" (
    echo [1/2] 기존 50books 폴더 발견! GitHub에서 최신 코드를 받아옵니다...
    cd /d "%TARGET_DIR%"
    git pull origin main
) else (
    echo [1/2] 지정된 경로에 GitHub 저장소를 복제(Clone)합니다...
    git clone https://github.com/yooht25/developebooks50.git "%TARGET_DIR%"
    cd /d "%TARGET_DIR%"
)

echo.
echo [2/2] 완료되었습니다! 현재 폴더 경로: %CD%
echo ========================================================
pause
