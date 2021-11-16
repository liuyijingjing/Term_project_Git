#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a[5],i,j;   //数组存储成绩，i控制变量 ,j为查找时输入的变量 
		for(i=0;i<5;i++)
	{
		printf("请输入第%d个成绩:\n",i+1);   //输入成绩 
		scanf("%d",&a[i]);
	}
	printf("请输入要查找的数：");       //输入任意数值 
	scanf("%d",&j);
  for(i=0;i<5;i++)
	{
	  if(a[i]==j)
     	{
	    printf("找到了，位置在%d\n",i+1);    //输出位置结果 
		break;	
	    }
	}
  if(i>=5)         
	{
	    printf("未找到!\n");
	} 
	system("pause");
	return 0;
}
