#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[20];     //�����ַ����� 
	printf("������һ���ַ�����\n");    //�����ַ��� 
	gets(a);
	printf("�޸�ǰ���ַ������£�%s\n",a); //����޸�ǰ 
	strupr(a);                         //��Сд��ĸ��� ��д��ĸ 
	printf("�޸ĺ���ַ������£�%s \n",a);   //����ַ��� 
   system("pause");
   return 0;
}
