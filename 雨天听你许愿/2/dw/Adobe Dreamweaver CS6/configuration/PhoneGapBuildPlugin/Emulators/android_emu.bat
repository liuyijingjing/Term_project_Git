@echo off

rem USAGE: android_emu tempdir apkpath activity

del "%1\emulation.log"

FOR /F "tokens=1" %%I in ('adb devices avd^|findstr /i emulator') DO (
    adb -e wait-for-device
    goto :installapp
)

FOR /F "tokens=*" %%I in ('android list avd -c') DO (
    SET AVD=%%I
    goto :runemulator
)

echo { error:"No Android AVD's found" } > "%1\emulation.log"
goto EOF

:runemulator

CALL emulator -avd %AVD%
CALL adb -e wait-for-device

:installapp

CALL adb -e install -r "%2"

:runapp

IF "%3%"=="" goto EOF
CALL adb -e shell am start -a android.intent.action.MAIN -n com.phonegap.DroidGap.%3

:EOF