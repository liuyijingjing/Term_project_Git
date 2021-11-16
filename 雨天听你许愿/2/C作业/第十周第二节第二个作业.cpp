#include <stdio.h>
#include <stdlib.h>
main()
{
	int i=1,sum=0;
	while(i<=200)
	{ 
	sum=sum+i;
	i+=2;
	}
	printf("1+3+5+бн+199=%d\n",sum);
	system("pause");
	return 0;
 } 
