#include<stdio.h>
#include<stdlib.h>
main()
{
	int a;
	printf("������һ����ݣ�");
	scanf("%d",&a);
	if((a%4==0&&a%100!=0)||(a%400==0))
	{
	 printf("��������",a);
	}
	else if(a<0)
	{
	 printf("��������ȷ�����...");
    }
	else
	{
	 printf("����ƽ��",a);
    }
    printf("\n");
	system("pause");
	return 0;
}

	
