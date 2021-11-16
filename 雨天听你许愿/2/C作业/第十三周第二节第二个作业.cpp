#include<stdio.h>
#include<stdlib.h>
#include<string.h> 
//转置 
int main()
{
	int a[2][3]={{1,2,3},{4,5,6}},b[3][2];      //定义数组存储变量 
	int i,j;                    //定义操作数组元素的循环变量
	printf("转置前:\n");
	for(i=0;i<=1;i++)           //数据 输入 
	{
		for(j=0;j<=2;j++)
		   {
			   printf("%3d",a[i][j]);
			   b[j][i]=a[i][j];
		   }
		printf("\n");
	}
	//输出 
	printf("转置后:\n");
	for(i=0;i<=2;i++)
	{
	for(j=0;j<=1;j++)
		printf("%3d",b[i][j]);
	printf("\n");
	}
    system("pause");
}

