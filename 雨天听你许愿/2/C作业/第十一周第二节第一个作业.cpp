#include <stdio.h>
#include <stdlib.h>
int main()
{
   int x[5],i;
   for(i=0;i<5;i++)    //����������� 
   {
     	printf("�������%d��ѧ���ɼ�:\n",i+1);
	    scanf("%d",&x[i]);
   }
   for(i=0;i<5;i++)     //���������� 
   {
    printf("%d\n",x[i]);
   } 
   system("pause");
   return 0;
}
 
