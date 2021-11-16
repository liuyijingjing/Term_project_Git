#include <stdio.h>
#include <stdlib.h>
int main()
{
   int x[5],i;
   for(i=0;i<5;i++)    //输入五个整数 
   {
     	printf("请输入第%d个学生成绩:\n",i+1);
	    scanf("%d",&x[i]);
   }
   for(i=0;i<5;i++)     //输出五个整数 
   {
    printf("%d\n",x[i]);
   } 
   system("pause");
   return 0;
}
 
