#include <stdio.h> 
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[5][5];
	char b[5];
	int i;
	//���� 
	printf("������ѧ����ѧ��:\n");
	for(i=0;i<5;i++)
	{
		scanf("%s",a[i]);
	}
	//���� 
    printf("��������Ҫ�����˵�ѧ��:");
    scanf("%s",b);
for(i=0;i<5;i++)
		{
			if(strcmp(a[i],b)==0)  //�Ƚ�             
			{
				printf("�ҵ��ˣ�λ����%d",i+1);   //��� 
				printf("\n");
				break;
			}	
		}
		if(i>=5)
			{
				printf("���޴���!");      //��� 
			    printf("\n"); 
			}

	system("pause");
	return 0; 
}
