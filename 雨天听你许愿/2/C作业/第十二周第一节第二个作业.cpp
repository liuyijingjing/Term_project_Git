#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a[5],i;   //����洢�ɼ���i���Ʊ���  
	int j;
	for(i=0;i<5;i++)
	{
		printf("�������%d����ֵ:\n",i+1);   //������ֵ
		scanf("%d",&a[i]);
	}
	printf("����ǰ:\n");
	for(i=0;i<5;i++)       //�����ֵ 
	{
	    printf("%d ",a[i]);
	}
	for(i=0;i<5/2;i++)    //�������� 
	{
	    j=a[(5-1)-i];
	    a[(5-1)-i]=a[i];
	    a[i]=j;
	}
	printf("\n");
	printf("�����\n");
	for(i=0;i<5;i++)       //������ս���������� 
	{
		printf("%d ",a[i]);
	} 
		printf("\n");
	system("pause");
	return 0;
} 
