#include<stdio.h>
#include<stdlib.h>
#include<string.h>
 main()
{
    char a[20];        //�û��� 
    char b[20];        
    char c[20]={"admin"};  //������ȷ������
	char d[20]={"admin"};    
    int i=0;
	printf("��½\n");
    printf("�������û���:\n");   //�����û���a 
    gets(a);
    printf("����������:\n");     //�������� 
    gets(b);
    strcmp(b,c);             //�Ƚ��û��������� 
    if(strcmp(b,c)>0||strcmp(b,c)<0||strcmp(a,d)>0||strcmp(a,d)<0)   //�����ϵ���� 
    {
        printf("��½ʧ��,�����û����������Ƿ���ȷ����.\n");       //��������� 
    }
    else
    {
        printf("�û�%s��½�ɹ�!\n",a);                            //��ȷ����� 
    }
    system("pause");
    return 0;
}
