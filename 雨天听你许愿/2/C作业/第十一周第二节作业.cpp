#include <stdio.h>
#include <stdlib.h>
int main() {
	int x[5],i,max,j,k,temp;//x数组存储成绩，i是循环变量// 
	float sum=0;
	for(i=0;i<5;i++)
	{
		printf("请输入第%d个成绩:\n",i+1);
		scanf("%d",&x[i]);
	}
	for(i=0;i<5;i++)
	sum=sum+x[i];
		printf("平均成绩是%.1f\n",sum/5);
		   max=x[0];
	    for(i=1;i<5;i++)
	    {
	    	if(max<x[i])     //条件判断// 
	    	max=x[i];       //赋值//
		} 
		printf("最高分是:%d\n",max);
    for(i=0;i<4;i++)
	{
		k=i;
		for(j=i+1;j<5;j++)
		   if(x[j]<x[k])
		   k=j;
		   if(i!=k)
		   {
		   temp=x[i];
		   x[i]=x[k];
		   x[k]=temp;
		   }
	}
	printf("排序后的成绩是:\n");
	for(i=0;i<5;i++)
	{
		printf("%d ",x[i]);
	}
	return 0;
}
