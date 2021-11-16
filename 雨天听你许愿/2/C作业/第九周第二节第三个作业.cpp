#include<stdio.h>
#include<stdlib.h>
int main()
{
	int a;
	printf("请输入一个年份：\n");
	scanf("%d",&a);
	if((a%4==0&&a%100!=0)||(a%400==0))
	printf("这是闰年",a);
	else
	printf("这是平年",a);
}

