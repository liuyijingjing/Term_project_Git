#include <stdio.h>
#include <stdlib.h>
#define N 100
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
	struct books stu[N];   //����ṹ�����
	int i,n=0; 
	while(1)
 {
	printf("������ͼ����:\n");
	scanf("%s",stu[n].id);
	printf("������ͼ������:\n");
	scanf("%s",stu[n].name);
	printf("������ͼ������:\n");
	scanf("%s",stu[n].author);
	printf("������ͼ��ĳ�����:\n");
	scanf("%s",stu[n].press);
	printf("������ͼ��۸�:\n");
	scanf("%f",&stu[n].price);
	n++;
    printf("���ʻ�Ҫ������(y/n)");
	fflush(stdin);     //ѯ���Ƿ�������� 
	if(getchar()=='n')   
	 {
		break;   //����ѭ�� 
	 }
 }
	printf("ͼ����\t����\t����\t������\t�۸�\n");  
  for(i=0;i<n;i++)    //���ѧ����Ϣ
	{
	 printf("%s\t%s\t%s\t%s\t%.2f \n",stu[i].id,stu[i].name,stu[i].author,stu[i].press,stu[i].price);
	}
	printf("\n");
	system("pause");
	return 0; 
} 
