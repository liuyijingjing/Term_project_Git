#include <stdio.h>
#include <stdlib.h>

/* 4行4列二维数组的对角线之和 */
void print(int array[][4]);//函数声明
int dj(int array[][4]);//函数声明
int main(int argc, char *argv[]) 
{
	int a[4][4]={{1,2,3,4},{5,6,7,8},{9,10,11,12},{13,14,15,16}};
	int b[4][4]={{1,2,3,4},{2,3,4,5},{3,4,5,6},{4,5,6,7}};
	print(a);
	printf("对交线之和是:%d\n",dj(a));//调用函数djxh(a)
	print(b);
	printf("对交线之和是:%d\n",dj(b));
	return 0;
}
void print(int a[][4])//输出函数
{
	int i,j;
	for(i=0;i<4;i++)
	{
		 for(j=0;j<4;j++)
	        printf("%6d",a[i][j]);
	        	printf("\n");
	}
	   
}
int dj(int a[][4])//计算对角线之和
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

