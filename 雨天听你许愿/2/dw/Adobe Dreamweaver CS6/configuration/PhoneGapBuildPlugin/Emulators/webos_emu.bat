@echo off

rem USAGE: webos_emu tempdir ipkpath fullappname

del "%1\emulation.log"

FOR /F "tokens=*" %%I in ('palm-emulator --list^|findstr /i SDK ') DO (
    SET EMULATOR=%%I
    goto :runemulator
)

echo { error:"Emulator image not found" } > "%1\emulation.log"
goto EOF

:runemulator

CALL palm-emulator --start="%EMULATOR%"

:installapp

CALL palm-install %2

:runapp

IF "%3"=="" goto EOF

CALL palm-launch %3

:EOF
