#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[20];   //�洢���� 
	int i=0;   //���ݳ�ʼ�� 
	printf("������һ���ַ���:\n");	  //������ֵ 
	gets(a);
	for(i=0;i<strlen(a);i++)     //�������� 
	{
	printf("%c \n",a[i]);    //��� 
	printf("\n");	
	}
	system("pause");
	return 0;
 } 
