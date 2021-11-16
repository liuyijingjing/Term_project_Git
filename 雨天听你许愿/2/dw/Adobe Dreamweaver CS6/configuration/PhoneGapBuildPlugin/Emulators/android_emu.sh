
# USAGE: android_emu run tempfile avd_name apkpath activity
#        android_emu list tempfile sdk

if [[ $1 == list ]]; then

  "$3/tools/android" list avd | grep Name | awk '{print $2}' >> $2

elif [[ $1 == run ]]; then

  "$3/tools/emulator" -avd $3 &
  "$3/platform-tools/adb" -e wait-for-device
  COUNTER=0
  while $COUNTER < 1:
  do
    PMREADY=`"$3/platform-tools/adb" -e shell pm path android`
    if [[ $PMREADY == package* ]]; then
      AVD_READY = 1
      break
    fi
    sleep 5s
    COUNTER = COUNTER + 1
  done

	if [[ $AVD_READY == 1 ]]; then
    echo 'Error starting AVD' >> $2
	fi

	"$3/platform-tools/adb" -e install -r "$4"

  if [ ! -z "$5" ]; then
    "$3/platform-tools/adb" -e shell am start -a android.intent.action.MAIN -n com.phonegap.DroidGap.$3
  fi

else
	echo 'USAGE: android_emu run avd_name tempdir apkpath activity'
	echo 'USAGE: android_emu list tempdir'
fi