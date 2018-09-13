@echo off

echo -------���build-------
rmdir /q /s build
mkdir build

echo -------���font-------
rmdir /q /s serv\subs\font\dist
cd font
call webpack -p
cd ..

echo -------����serv-------
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

echo -------����back-------
mkdir build\back
xcopy /q /s back build\back
rmdir /q /s build\back\.vscode
del build\back\.eslintrc.json

echo -------��������-------
copy package.json build
copy package-lock.json build
copy config.js build

echo -------ѹ���ļ�-------
call node pack.js

echo -------������-------

pause