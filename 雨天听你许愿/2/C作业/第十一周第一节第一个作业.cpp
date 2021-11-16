#include <stdio.h>
#include <stdlib.h>
main()
{
	int i,j,k;
	for(i=0;i<5;i++)  //控制行数 
	{
		for(j=5;j>i;j--)  //控制空格
		{
			printf(" ");
		}
		for(k=0;k<i*2+1;k++) //控制*的个数 
		{
			printf("*");
		}
		printf("\n");
	}
	system("pause");
	return 0; 
}
