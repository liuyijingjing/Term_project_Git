#include <stdio.h>
#include <stdlib.h>
main()
{
	int i,j,k;
	for(i=0;i<5;i++)  //�������� 
	{
		for(j=5;j>i;j--)  //���ƿո�
		{
			printf(" ");
		}
		for(k=0;k<i*2+1;k++) //����*�ĸ��� 
		{
			printf("*");
		}
		printf("\n");
	}
	system("pause");
	return 0; 
}
