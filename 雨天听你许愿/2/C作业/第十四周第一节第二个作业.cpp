#include <stdio.h>
#include <stdlib.h>
#define N 100
//定义结构体类型
struct  books
{
	char id[20];   //图书编号 
	char name[20];  //图书名称
	char author[10]; //作者姓名
	char press[20]; //图书的出版社 
	float price; //图书价格 
};
 main()
{
	struct books stu[N];   //定义结构体变量
	int i,n=0; 
	while(1)
 {
	printf("请输入图书编号:\n");
	scanf("%s",stu[n].id);
	printf("请输入图书名称:\n");
	scanf("%s",stu[n].name);
	printf("请输入图书作者:\n");
	scanf("%s",stu[n].author);
	printf("请输入图书的出版社:\n");
	scanf("%s",stu[n].press);
	printf("请输入图书价格:\n");
	scanf("%f",&stu[n].price);
	n++;
    printf("请问还要输入吗？(y/n)");
	fflush(stdin);     //询问是否继续输入 
	if(getchar()=='n')   
	 {
		break;   //结束循环 
	 }
 }
	printf("图书编号\t书名\t作者\t出版社\t价格\n");  
  for(i=0;i<n;i++)    //输出学生信息
	{
	 printf("%s\t%s\t%s\t%s\t%.2f \n",stu[i].id,stu[i].name,stu[i].author,stu[i].press,stu[i].price);
	}
	printf("\n");
	system("pause");
	return 0; 
} 
