#include <stdio.h>
#include <stdlib.h>
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
	struct books stu1;   //定义结构体变量
	printf("请输入图书编号:\n");
	scanf("%s",stu1.id);
	printf("请输入图书名称:\n");
	scanf("%s",stu1.name);
	printf("请输入图书作者:\n");
	scanf("%s",stu1.author);
	printf("请输入图书的出版社:\n");
	scanf("%s",stu1.press);
	printf("请输入图书价格:\n");
	scanf("%f",&stu1.price);
	printf("你刚才输入的图书信息为:\n");  //输出学生信息
	printf("%s\t%s\t%s\t%s\t%.2f\t",stu1.id,stu1.name,stu1.author,stu1.press,stu1.price);
	printf("\n"); 
	system("pause");
	return 0; 
} 
