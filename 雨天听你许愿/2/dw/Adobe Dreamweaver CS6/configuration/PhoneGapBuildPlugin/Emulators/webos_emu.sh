
# USAGE: webos_emu list tempdir sdkpath
# USAGE: webos_emu launch tempdir sdkpath emulator
# USAGE: webos_emu run tempdir sdkpath ipkpath bundle

rm -f $2/emulation_status.txt

if [ $1 == 'list' ]; then
	
	palm-emulator --list | grep SDK &> $2/emulation_status.txt

elif [ $1 == 'launch' ]; then
	
	palm-emulator --start="$3"

elif [ $1 == 'run' ]; then
	
	palm-install -d tcp ~/app.ipk $4 $5
	palm-launch -d tcp com.example.app
	
else
	
	echo Bad Arguments &> $2/emulation_status.txt
	
fi