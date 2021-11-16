#include<stdio.h>
#include<stdlib.h>
#include<string.h>
 main()
{
    char a[20];        //用户名 
    char b[20];        
    char c[20]={"admin"};  //储存正确的密码
	char d[20]={"admin"};    
    int i=0;
	printf("登陆\n");
    printf("请输入用户名:\n");   //输入用户名a 
    gets(a);
    printf("请输入密码:\n");     //输入密码 
    gets(b);
    strcmp(b,c);             //比较用户名和密码 
    if(strcmp(b,c)>0||strcmp(b,c)<0||strcmp(a,d)>0||strcmp(a,d)<0)   //定义关系条件 
    {
        printf("登陆失败,请检查用户名或密码是否正确输入.\n");       //错误则输出 
    }
    else
    {
        printf("用户%s登陆成功!\n",a);                            //正确则输出 
    }
    system("pause");
    return 0;
}
