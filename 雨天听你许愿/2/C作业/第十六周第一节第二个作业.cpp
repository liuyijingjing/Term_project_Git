#include <stdio.h>
#include <stdlib.h>

/* 4��4�ж�ά����ĶԽ���֮�� */
void print(int array[][4]);//��������
int dj(int array[][4]);//��������
int main(int argc, char *argv[]) 
{
	int a[4][4]={{1,2,3,4},{5,6,7,8},{9,10,11,12},{13,14,15,16}};
	int b[4][4]={{1,2,3,4},{2,3,4,5},{3,4,5,6},{4,5,6,7}};
	print(a);
	printf("�Խ���֮����:%d\n",dj(a));//���ú���djxh(a)
	print(b);
	printf("�Խ���֮����:%d\n",dj(b));
	return 0;
}
void print(int a[][4])//�������
{
	int i,j;
	for(i=0;i<4;i++)
	{
		 for(j=0;j<4;j++)
	        printf("%6d",a[i][j]);
	        	printf("\n");
	}
	   
}
int dj(int a[][4])//����Խ���֮��
{
	int i,j;
	int sum=0;
	for(i=0;i<4;i++)
	{
		for(j=0;j<4;j++)
		{
			if((i==j)||(i+j==3))
			   sum+=a[i][j];
		}
	}
	 return sum;
}

