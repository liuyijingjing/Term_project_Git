#include<stdio.h>
#include<stdlib.h>
int main()
{
	int a;
	printf("������һ����ݣ�\n");
	scanf("%d",&a);
	if((a%4==0&&a%100!=0)||(a%400==0))
	printf("��������",a);
	else
	printf("����ƽ��",a);
}

