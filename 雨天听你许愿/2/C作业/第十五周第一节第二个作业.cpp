#include <stdio.h> 
#include<string.h>
#define N 1000 
struct Student 
{
     char ID[20]; 
     char Name[20]; 
     float Mark[3];      
     float Average;  
}students[N];  
//定义全局变量
char id[20];  
int num=0;
void Student_Display()              //查看学生记录
{
     int i;
     printf("%10s%10s%8s%8s%8s%10s\n","学号","姓名","成绩","成绩","成绩","平均成绩"); 
     printf("-------------------------------------------------------------\n");  
     for (i=0;i<num;i++) 
     {
          printf("%10s%10s%8.2f%8.2f%8.2f%10.2f\n",students[i].ID,students[i].Name,
                      students[i].Mark[0],students[i].Mark[1],students[i].Mark[2],students[i].Average); 
     }   
}
/*主程序*/ 
int main()
{ 
     int choice,i,sum=0; 
     while(1)
     { 
         /*主菜单*/ 
         printf("\n**********************欢迎使用学生成绩管理系统********************\n"); 
         printf(" \n1.增加学生记录\t2.查看学生记录\t3.修改学生记录\t4.删除学生记录\n"); 
         printf(" \n5.查询学生记录\t6.按平均成绩排序\t\t7. 退出\n");
         printf("\n******************************************************************\n");
         printf("请选择(1-7):");
         scanf("%d",&choice);
         getchar();
         switch(choice) 
         { 
         case 1:
              while(1) 
             { 
                 printf("请输入学号:"); 
                 scanf("%s",students[num].ID);                  
                 printf("请输入姓名:"); 
                 scanf("%s",students[num].Name);  
                 for(i=0;i<3;i++)
                 {
                    printf("请输入第%d门功课的成绩:",i+1); 
                    scanf("%f",&students[num].Mark[i]); 
                    sum+=students[num].Mark[i];
                 } 
                 students[num].Average=sum/3;
                 num++; 
                 printf("是否继续?(y/n)"); 
                 fflush(stdin);				//清除输入缓冲区中的换行符
                 if (getchar()=='n') 
                 {  
                      break; 
                 } 
             }
              break;
		 case 2: Student_Display(); break;  
         case 3: break; 
         case 4: break;
         case 5: break;
         case 6: break;
         case 7: break;
        } 
     }
     return 0; 
}

