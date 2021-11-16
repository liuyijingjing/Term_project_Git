#include <stdio.h>
#include <stdlib.h>
int main()
{
	int i,sum;
	for(i=1,sum=0;i<=100;i++)
	{
		if(i%2==0)
		{
		sum-=i;
		}
		if(i%2!=0)
		{
		sum+=i;
		}
	}
	printf("1-2+3-бн-100=%d\n",sum);
	system("pause");
	return 0;
 } 


