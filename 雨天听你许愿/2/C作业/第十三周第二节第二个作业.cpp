#include<stdio.h>
#include<stdlib.h>
#include<string.h> 
//ת�� 
int main()
{
	int a[2][3]={{1,2,3},{4,5,6}},b[3][2];      //��������洢���� 
	int i,j;                    //�����������Ԫ�ص�ѭ������
	printf("ת��ǰ:\n");
	for(i=0;i<=1;i++)           //���� ���� 
	{
		for(j=0;j<=2;j++)
		   {
			   printf("%3d",a[i][j]);
			   b[j][i]=a[i][j];
		   }
		printf("\n");
	}
	//��� 
	printf("ת�ú�:\n");
	for(i=0;i<=2;i++)
	{
	for(j=0;j<=1;j++)
		printf("%3d",b[i][j]);
	printf("\n");
	}
    system("pause");
}

