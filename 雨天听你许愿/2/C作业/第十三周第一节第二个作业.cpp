#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int main()
{
	int a[4][3],i,j,max;
    int sum=0;
	for(i=0;i<4;i++)
	{
		printf("请输入第%d个学生的成绩:",i+1); //输入数据 
		for(j=0;j<3;j++)
		{
			scanf("%d",&a[i][j]);
		}
    }
	for(i=0;i<4;i++)   //行 
    {
		sum=0;
		for(j=0;j<3;j++)  //列 
    	{
    		sum+=a[i][j];    //求三门成绩的总和 
		}
		printf("第%d个学生的平均分:%d",i+1,sum/3);  //输出平均分 
		max=a[i][0];
	    for(j=0;j<3;j++)
       {	
		  if(max<a[i][j])   //定义条件 
			{
				max=a[i][j];
			}
		} 
	printf("最高分:%d\n",max);	   //输出最高分 
	}
	system("pause");
	return 0;
}     
