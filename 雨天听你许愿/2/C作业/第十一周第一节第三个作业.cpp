#include <stdio.h>
#include <stdlib.h>
int main()
{
     int id;   
	 float i,j,k,avg;     //����ɼ�1���ɼ�2���ɼ�����ƽ���� 
	while(1)
	{
		printf("������ѧ�ţ�\n");     //����ѧ�� 
		scanf("%d",&id);
		printf("������ɼ�һ��\n");   //����ɼ�1 
		scanf("%f",&i);
		printf("������ɼ�����\n");    //����ɼ�2 
		scanf("%f",&j);
		printf("������ɼ�����\n");     //����ɼ�3 
		scanf("%f",&k);
		avg=(i+j+k)/3;                  //�����ϵ 
		printf("ƽ������%f\n",avg);     
		printf("�Ƿ����������һ��ͬѧ����y/n��\n");    //�ж��Ƿ�������� 
		fflush(stdin);
		 if(getchar()=='n')
		 {
		 	break;     //����ѭ�� 
		 }
	}
	printf("\n");
	system("pause");
}


































/*#include <stdio.h>
#include <stdlib.h>
main()
{
	int id;
	int i,j,k,b,p;    //����ɼ�һ���ɼ������ɼ��� ,ѧ�� 
    	while(1)
	{
	printf("������ѧ�ţ�%d\n",b);
	scanf("%d",id);
	printf("������ɼ�һ��&d",i);
	scanf("%d",i);
	printf("������ɼ�����&d",j);
	scanf("%d",j);
	printf("������ɼ�����&d",k);
	scanf("%d",k);

	p=(i+j+k)%3;    //�����ϵ 
	} 
	printf("%dͬѧ��ƽ���ɼ���:%d",id,p); 
	printf("�Ƿ����������һ��ͬѧ����y/n):");
	fflush(stdin);   // ����ļ�������
	if(getchar()=='n')   //����һ���ַ�
	{
	break; 
	} 
}*/
