function formatDate(aDate)
{
	var suffix = 'am'; 
	
	var hours = aDate.getHours();
	if (hours >= 12)
	{
		suffix = 'pm';
		if (hours > 12)
			hours -= 12; // Military time -> standard time.
	}
	else if (hours == 0) // Midnight military time.
		hours = 12;	
		
	function zeroFill(val)
	{
		if (val < 10)
			return '0' + val;
		return val;	
	}
	
	var minutes = zeroFill(aDate.getMinutes());
	var seconds = zeroFill(aDate.getSeconds());
			
	return hours + ':' + minutes + ':' + seconds + suffix; 	
}