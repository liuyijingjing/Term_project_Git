#include<stdio.h>
#include<stdlib.h>
main()
{
	int a;
	printf("请输入一个年份：");
	scanf("%d",&a);
	if((a%4==0&&a%100!=0)||(a%400==0))
	{
	 printf("这是闰年",a);
	}
	else if(a<0)
	{
	 printf("请输入正确的年份...");
    }
	else
	{
	 printf("这是平年",a);
    }
    printf("\n");
	system("pause");
	return 0;
}

	
