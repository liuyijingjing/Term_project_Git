#include <stdio.h>
#include <stdlib.h>
//����ṹ������
struct  books
{
	char id[20];   //ͼ���� 
	char name[20];  //ͼ������
	char author[10]; //��������
	char press[20]; //ͼ��ĳ����� 
	float price; //ͼ��۸� 
};
 main()
{
	struct books stu1;   //����ṹ�����
	printf("������ͼ����:\n");
	scanf("%s",stu1.id);
	printf("������ͼ������:\n");
	scanf("%s",stu1.name);
	printf("������ͼ������:\n");
	scanf("%s",stu1.author);
	printf("������ͼ��ĳ�����:\n");
	scanf("%s",stu1.press);
	printf("������ͼ��۸�:\n");
	scanf("%f",&stu1.price);
	printf("��ղ������ͼ����ϢΪ:\n");  //���ѧ����Ϣ
	printf("%s\t%s\t%s\t%s\t%.2f\t",stu1.id,stu1.name,stu1.author,stu1.press,stu1.price);
	printf("\n"); 
	system("pause");
	return 0; 
} 
