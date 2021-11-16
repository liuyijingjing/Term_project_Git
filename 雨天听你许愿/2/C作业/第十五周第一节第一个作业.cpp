#include <stdio.h>
#include <stdlib.h>
long lifang(int a)   //用于求一个数的立方 
{
	return a*a*a;
}
long sum(int x,int y,int z)   //用于求三个数的总和 
{
	int he;
	he=lifang(x)+lifang(y)+lifang(z);   
    return he;
}
main()
{
	int a,b,c;   //定义三个数值 
	int jg=0;    //初始化 
	printf("请输入三个整数:\n");   
	scanf("%d%d%d",&a,&b,&c);  //数据输入 
	jg=sum(a,b,c);      //调用函数 
	printf("%d,%d和%d的立方和是:%d",a,b,c,jg);  //数据输出 
	printf("\n");
	system("pause");
	return 0;
}
