#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a;
	do
	{
		printf("������ѧ���ɼ�<����-1����>��");
		scanf("%d",&a);
		if(a>=0&&a<=100)
		{
			if(a>=90&&a<=100)
			printf("�ȼ�=��\n");
			else if(a<90&&a>=80)
			printf("�ȼ�=��\n");
			else if(a<80&&a>=70)
			printf("�ȼ�=��\n");
			else if(a<70&&a>=60)
			printf("�ȼ�=����\n");
	        else
		    printf("�ȼ�=������\n");  
		}
		else if(a<0&&a>=100)
		printf("����ɼ�Ӧ��0-100֮�䣡����\n");		
	    else
	    {
	    printf("ллʹ�ã�\n"); 	
		}
	}
	while(a!=-1);
	system("pause");
	return 0;
 } 
