#include <stdio.h>
#include <stdlib.h>
main()
{
	int i=0,j=0;    //��ʼ��ÿ��ѧ���ĳɼ�
	int a[5][3];   //����ÿ��ѧ���ɼ�
	for(i=0;i<5;i++)
	{
		printf("�������%d��ѧ���ɼ�:\n",i+1);	
		for(j=0;j<3;j++)
		{
		    scanf("%d",&a[i][j]);
		}	
	} 
	printf("\n");   //ÿ����һ��ѧ���ɼ��ͻ���
    for(i=0;i<5;i++)     //��� 
    {
    	printf("��%d�ĳɼ�:",i+1);
        for(j=0;j<3;j++)
        {
    	   printf("%3d",a[i][j]);
	    }
	    printf("\n");
	}
    system("pause");
	return 0; 
}
