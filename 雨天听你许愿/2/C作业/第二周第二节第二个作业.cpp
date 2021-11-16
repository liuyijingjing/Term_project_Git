#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[20];     //定义字符长度 
	printf("请输入一个字符串：\n");    //输入字符串 
	gets(a);
	printf("修改前的字符串如下：%s\n",a); //输出修改前 
	strupr(a);                         //把小写字母变成 大写字母 
	printf("修改后的字符串如下：%s \n",a);   //输出字符串 
   system("pause");
   return 0;
}
