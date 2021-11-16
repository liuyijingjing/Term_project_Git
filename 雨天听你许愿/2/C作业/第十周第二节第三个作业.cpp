#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a;
	do
	{
		printf("请输入学生成绩<输入-1结束>：");
		scanf("%d",&a);
		if(a>=0&&a<=100)
		{
			if(a>=90&&a<=100)
			printf("等级=优\n");
			else if(a<90&&a>=80)
			printf("等级=良\n");
			else if(a<80&&a>=70)
			printf("等级=中\n");
			else if(a<70&&a>=60)
			printf("等级=及格\n");
	        else
		    printf("等级=不及格\n");  
		}
		else if(a<0&&a>=100)
		printf("输入成绩应在0-100之间！！！\n");		
	    else
	    {
	    printf("谢谢使用！\n"); 	
		}
	}
	while(a!=-1);
	system("pause");
	return 0;
 } 
