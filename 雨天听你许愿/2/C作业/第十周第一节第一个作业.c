#include <stdio.h>
#include <stdlib.h>
int main()
 {
 	int a,b,g;
	printf("��������ĵ������룺") ;
    scanf("%d",&a);
    b=a-3500;
    if(b<=1500)
    {
    	g=b*0.03-0;
    	printf("��ĸ�������˰�����:%d\n",g);
	}
	else if(b>=1500 && b<4500)
	{
		g=b*0.10-105;
		printf("��ĸ�������˰�����:%d\n",g);
	}
	else if(b>=4500 && b<9000)
	{
		g=b*0.20-555;
		printf("��ĸ�������˰�����:%d\n",g);
	}
	else if(b>=9000 && b<35000)
	{
		g=b*0.25-1005;
		printf("��ĸ�������˰�����:%d\n",g);
	}
	else if(b>=35000 && b<55000)
	{
		g=b*0.30-2755;
		printf("��ĸ�������˰�����:%d\n",g);
	}
	else if(b>=55000 && b<80000)
	{
		g=b*0.35-5505;
		printf("��ĸ�������˰�����:%d\n",g);
	}
	else g=b*0.45-13505;
	printf("��ĸ�������˰�����:%d\n",g);
	system("pause");
	return 0;
}
	

