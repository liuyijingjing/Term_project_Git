#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[20];   //存储变量 
	int i=0;   //数据初始化 
	printf("请输入一个字符串:\n");	  //输入数值 
	gets(a);
	for(i=0;i<strlen(a);i++)     //定义条件 
	{
	printf("%c \n",a[i]);    //输出 
	printf("\n");	
	}
	system("pause");
	return 0;
 } 
