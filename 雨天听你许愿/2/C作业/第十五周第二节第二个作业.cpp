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

int Input()    //增加学生记录
{
	while(1)
	{
	    float sum=0;
	    printf("请输入学号：");
	    scanf("%s",stu[num].id);
	    printf("请输入学生姓名：");
	    scanf("%s",stu[num].name);
		for(i=0;i<n;i++)
		  {
			  printf("请输入学生的第%d门成绩：",i+1);
		      scanf("%f",&stu[num].lession[i]);
			  sum+=stu[num].lession[i];
		  }
		stu[num].average=sum/n;
		num++;
		printf("是否继续?(y/n)");
	    fflush(stdin);
	    if(getchar()=='n')
	     {break;}
	}
}

int student_Display()  //显示学生记录
{
	printf("\t学号\t姓名\t成绩\t成绩\t成绩\t平均成绩\t\n");
	printf("————————————————————————————————————\n");
	for(i=0;i<num;i++)
	{
		printf("\t%4s\t%4s\t%4.2f\t%4.2f\t%4.2f\t%4.2f\t\n",stu[i].id,stu[i].name,stu[i].lession[0],stu[i].lession[1],stu[i].lession[2],stu[i].average); 
	}
}

int student_Findbyid(char id[])   //记录查找到的学号的下标
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

int Printfsinge(int i)  //显示单条记录
{
	printf("\t学号\t姓名\t成绩\t成绩\t成绩\t平均成绩\t\n");
	printf("————————————————————————————————————\n");
	printf("\t%4s\t%4s\t%4.2f\t%4.2f\t%4.2f\t%4.2f\t\n",stu[i].id,stu[i].name,stu[i].lession[0],stu[i].lession[1],stu[i].lession[2],stu[i].average); 
}

int student_Find()//查询学生记录
{
	while(1)
	{
	  char id[20];
	  printf("请输入要查找的学号:");
	  scanf("%s",id);
	  student_Findbyid(id);
	  if(student_Findbyid(id)==-1)
		 printf("没找到学生,请检查输入学号是否正确！\n");
	  else
	  {
		 printf("查找到的学生信息为：\n");
	     Printfsinge(i);
	  }
	  printf("是否还要查找（y/n）：");
	  fflush(stdin);
	  if(getchar()=='n') 
	  {break; }
	}
}
int Revise(int index)  //修改单条记录
{
	 float sum=0;
	    printf("请输入学号：");
	    scanf("%s",stu[index].id);
	    printf("请输入学生姓名：");
	    scanf("%s",stu[index].name);
		for(i=0;i<n;i++)
		  {
			  printf("请输入学生的第%d门成绩：",i+1);
		      scanf("%f",&stu[index].lession[i]);
			  sum+=stu[index].lession[i];
		  }
		stu[index].average=sum/n;
}
int student_Revise()  //修改学生记录
{
	while(1)
	{
	char id[20];
	int index;
	  printf("请输入要修改的学号:");
	  scanf("%s",id);
	  index=student_Findbyid(id);  //调用 
	  if(index==-1)      //判断 
	  printf("没找到学生,请检查输入学号是否正确！\n");
	  else
	  Revise(index);
	  printf("修改后的记录为：\n");
	  Printfsinge(index);
	  printf("是否还要修改（y/n）：");
	  fflush(stdin);
	  if(getchar()=='n') 
	  {break; }
	}
}
 //主菜单
int main()  
{
	while(1)
	{
	int choice;
	printf("\n");
	printf("************************欢迎使用学生成绩管理系统************************\n");
	printf("\n");
	printf("1.增加学生记录\t2.查看学生记录\t3.修改学生记录\t4.删除学生记录\t\n");
	printf("\n");
	printf("5.查询学生记录\t6.按平均成绩排序\t\t7.退出\t\n");
	printf("\n");
	printf("************************************************************************\n");
	printf("\n");
	printf("请选择<1-7>：");
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

