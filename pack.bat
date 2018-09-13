@echo off

echo -------清空build-------
rmdir /q /s build
mkdir build

echo -------打包font-------
rmdir /q /s serv\subs\font\dist
cd font
call webpack -p
cd ..

echo -------复制serv-------
mkdir build\serv
xcopy /q /s serv build\serv
rmdir /q /s build\serv\.vscode
del build\serv\.eslintrc.json
del build\serv\subs\back\.auth.json
del build\serv\subs\perm\.auth.json
del build\serv\subs\font\.auth.json
copy .auth.json build\serv\subs\back\.auth.json
copy .auth.json build\serv\subs\perm\.auth.json
copy .auth.json build\serv\subs\font\.auth.json

echo -------复制back-------
mkdir build\back
xcopy /q /s back build\back
rmdir /q /s build\back\.vscode
del build\back\.eslintrc.json

echo -------复制配置-------
copy package.json build
copy package-lock.json build
copy config.js build

echo -------压缩文件-------
call node pack.js

echo -------打包完毕-------

pause