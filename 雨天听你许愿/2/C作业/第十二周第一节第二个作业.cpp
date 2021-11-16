#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a[5],i;   //数组存储成绩，i控制变量  
	int j;
	for(i=0;i<5;i++)
	{
		printf("请输入第%d个数值:\n",i+1);   //输入数值
		scanf("%d",&a[i]);
	}
	printf("逆序前:\n");
	for(i=0;i<5;i++)       //输出数值 
	{
	    printf("%d ",a[i]);
	}
	for(i=0;i<5/2;i++)    //定义条件 
	{
	    j=a[(5-1)-i];
	    a[(5-1)-i]=a[i];
	    a[i]=j;
	}
	printf("\n");
	printf("逆序后：\n");
	for(i=0;i<5;i++)       //输出最终结果，逆序结果 
	{
		printf("%d ",a[i]);
	} 
		printf("\n");
	system("pause");
	return 0;
} 
