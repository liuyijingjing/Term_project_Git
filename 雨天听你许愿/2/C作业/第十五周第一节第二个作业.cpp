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
//����ȫ�ֱ���
char id[20];  
int num=0;
void Student_Display()              //�鿴ѧ����¼
{
     int i;
     printf("%10s%10s%8s%8s%8s%10s\n","ѧ��","����","�ɼ�","�ɼ�","�ɼ�","ƽ���ɼ�"); 
     printf("-------------------------------------------------------------\n");  
     for (i=0;i<num;i++) 
     {
          printf("%10s%10s%8.2f%8.2f%8.2f%10.2f\n",students[i].ID,students[i].Name,
                      students[i].Mark[0],students[i].Mark[1],students[i].Mark[2],students[i].Average); 
     }   
}
/*������*/ 
int main()
{ 
     int choice,i,sum=0; 
     while(1)
     { 
         /*���˵�*/ 
         printf("\n**********************��ӭʹ��ѧ���ɼ�����ϵͳ********************\n"); 
         printf(" \n1.����ѧ����¼\t2.�鿴ѧ����¼\t3.�޸�ѧ����¼\t4.ɾ��ѧ����¼\n"); 
         printf(" \n5.��ѯѧ����¼\t6.��ƽ���ɼ�����\t\t7. �˳�\n");
         printf("\n******************************************************************\n");
         printf("��ѡ��(1-7):");
         scanf("%d",&choice);
         getchar();
         switch(choice) 
         { 
         case 1:
              while(1) 
             { 
                 printf("������ѧ��:"); 
                 scanf("%s",students[num].ID);                  
                 printf("����������:"); 
                 scanf("%s",students[num].Name);  
                 for(i=0;i<3;i++)
                 {
                    printf("�������%d�Ź��εĳɼ�:",i+1); 
                    scanf("%f",&students[num].Mark[i]); 
                    sum+=students[num].Mark[i];
                 } 
                 students[num].Average=sum/3;
                 num++; 
                 printf("�Ƿ����?(y/n)"); 
                 fflush(stdin);				//������뻺�����еĻ��з�
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

