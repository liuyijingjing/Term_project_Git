
# USAGE: ios_emu run outputFile ipapath sdkversion family
# USAGE: ios_emu list outputFile
./iphonesim showsdks
palm-emulator --list | grep SDK
android list avd | grep Name | awk '{print $2}'
exit
if [ $1 == 'list' ]; then
	
	BASEDIR=$(dirname $0) &> $2.cunt
	echo $BASEDIR &> $2.cunt
	iphonesim showsdks &> $2
	
elif [ $1 == 'run' ]; then
	
	iphonesim launch $3 $4 $5 &> $2
	
else
	
	echo Bad Arguments &> $2
	
fi

