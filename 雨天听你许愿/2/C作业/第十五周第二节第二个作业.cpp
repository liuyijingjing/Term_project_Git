#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#define N 1000
#define n 3


struct student
{
	char id[10];
	char name[20];
	float lession[n];
	float average;
}stu[N];
int num=0,i;

int Input()    //����ѧ����¼
{
	while(1)
	{
	    float sum=0;
	    printf("������ѧ�ţ�");
	    scanf("%s",stu[num].id);
	    printf("������ѧ��������");
	    scanf("%s",stu[num].name);
		for(i=0;i<n;i++)
		  {
			  printf("������ѧ���ĵ�%d�ųɼ���",i+1);
		      scanf("%f",&stu[num].lession[i]);
			  sum+=stu[num].lession[i];
		  }
		stu[num].average=sum/n;
		num++;
		printf("�Ƿ����?(y/n)");
	    fflush(stdin);
	    if(getchar()=='n')
	     {break;}
	}
}

int student_Display()  //��ʾѧ����¼
{
	printf("\tѧ��\t����\t�ɼ�\t�ɼ�\t�ɼ�\tƽ���ɼ�\t\n");
	printf("������������������������������������������������������������������������\n");
	for(i=0;i<num;i++)
	{
		printf("\t%4s\t%4s\t%4.2f\t%4.2f\t%4.2f\t%4.2f\t\n",stu[i].id,stu[i].name,stu[i].lession[0],stu[i].lession[1],stu[i].lession[2],stu[i].average); 
	}
}

int student_Findbyid(char id[])   //��¼���ҵ���ѧ�ŵ��±�
{
	for(i=0;i<num;i++)
	{
		if(strcmp(stu[i].id,id)==0)
		{
			return i;
			break;
		}
	}
	return -1;
}

int Printfsinge(int i)  //��ʾ������¼
{
	printf("\tѧ��\t����\t�ɼ�\t�ɼ�\t�ɼ�\tƽ���ɼ�\t\n");
	printf("������������������������������������������������������������������������\n");
	printf("\t%4s\t%4s\t%4.2f\t%4.2f\t%4.2f\t%4.2f\t\n",stu[i].id,stu[i].name,stu[i].lession[0],stu[i].lession[1],stu[i].lession[2],stu[i].average); 
}

int student_Find()//��ѯѧ����¼
{
	while(1)
	{
	  char id[20];
	  printf("������Ҫ���ҵ�ѧ��:");
	  scanf("%s",id);
	  student_Findbyid(id);
	  if(student_Findbyid(id)==-1)
		 printf("û�ҵ�ѧ��,��������ѧ���Ƿ���ȷ��\n");
	  else
	  {
		 printf("���ҵ���ѧ����ϢΪ��\n");
	     Printfsinge(i);
	  }
	  printf("�Ƿ�Ҫ���ң�y/n����");
	  fflush(stdin);
	  if(getchar()=='n') 
	  {break; }
	}
}
int Revise(int index)  //�޸ĵ�����¼
{
	 float sum=0;
	    printf("������ѧ�ţ�");
	    scanf("%s",stu[index].id);
	    printf("������ѧ��������");
	    scanf("%s",stu[index].name);
		for(i=0;i<n;i++)
		  {
			  printf("������ѧ���ĵ�%d�ųɼ���",i+1);
		      scanf("%f",&stu[index].lession[i]);
			  sum+=stu[index].lession[i];
		  }
		stu[index].average=sum/n;
}
int student_Revise()  //�޸�ѧ����¼
{
	while(1)
	{
	char id[20];
	int index;
	  printf("������Ҫ�޸ĵ�ѧ��:");
	  scanf("%s",id);
	  index=student_Findbyid(id);  //���� 
	  if(index==-1)      //�ж� 
	  printf("û�ҵ�ѧ��,��������ѧ���Ƿ���ȷ��\n");
	  else
	  Revise(index);
	  printf("�޸ĺ�ļ�¼Ϊ��\n");
	  Printfsinge(index);
	  printf("�Ƿ�Ҫ�޸ģ�y/n����");
	  fflush(stdin);
	  if(getchar()=='n') 
	  {break; }
	}
}
 //���˵�
int main()  
{
	while(1)
	{
	int choice;
	printf("\n");
	printf("************************��ӭʹ��ѧ���ɼ�����ϵͳ************************\n");
	printf("\n");
	printf("1.����ѧ����¼\t2.�鿴ѧ����¼\t3.�޸�ѧ����¼\t4.ɾ��ѧ����¼\t\n");
	printf("\n");
	printf("5.��ѯѧ����¼\t6.��ƽ���ɼ�����\t\t7.�˳�\t\n");
	printf("\n");
	printf("************************************************************************\n");
	printf("\n");
	printf("��ѡ��<1-7>��");
	scanf("%d",&choice);
	getchar();
	switch(choice)
	{
	    case 1:
		Input();
		break;
		case 2:
		student_Display();
		break;
		case 3:
		student_Revise();
		break;
		case 4:
		//student_Delet();
		case 5:
	    student_Find();
		break;
		case 6:
		//student_Order();
		case 7:
		exit(0);
     }
	}
	return 0;
	system("pause");
}

