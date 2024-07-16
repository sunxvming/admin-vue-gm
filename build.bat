
@echo off

set WEB_DIR=C:\Users\DELL\Desktop\project\game-frontend\minerva_web
set BUILD_DIR=%WEB_DIR%\bg\gm


call npm run build

:: 复制打包的代码到web目录
rd/s/q %BUILD_DIR%
xcopy /s/e/i/y .\dist %BUILD_DIR%

:: 推送源代码
call push.bat

:: 推送打包的代码
cd %WEB_DIR%
%WEB_DIR%\push.bat