#include <stdio.h>
#include <stdlib.h>
int main()
{
     int id;   
	 float i,j,k,avg;     //定义成绩1，成绩2，成绩三，平均分 
	while(1)
	{
		printf("请输入学号：\n");     //输入学号 
		scanf("%d",&id);
		printf("请输入成绩一：\n");   //输入成绩1 
		scanf("%f",&i);
		printf("请输入成绩二：\n");    //输入成绩2 
		scanf("%f",&j);
		printf("请输入成绩三：\n");     //输入成绩3 
		scanf("%f",&k);
		avg=(i+j+k)/3;                  //定义关系 
		printf("平均分是%f\n",avg);     
		printf("是否继续输入下一个同学？（y/n）\n");    //判断是否继续输入 
		fflush(stdin);
		 if(getchar()=='n')
		 {
		 	break;     //结束循环 
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
	int i,j,k,b,p;    //定义成绩一，成绩二，成绩三 ,学号 
    	while(1)
	{
	printf("请输入学号：%d\n",b);
	scanf("%d",id);
	printf("请输入成绩一：&d",i);
	scanf("%d",i);
	printf("请输入成绩二：&d",j);
	scanf("%d",j);
	printf("请输入成绩三：&d",k);
	scanf("%d",k);

	p=(i+j+k)%3;    //定义关系 
	} 
	printf("%d同学的平均成绩是:%d",id,p); 
	printf("是否继续输入下一个同学？（y/n):");
	fflush(stdin);   // 清除文件缓冲区
	if(getchar()=='n')   //输入一个字符
	{
	break; 
	} 
}*/
