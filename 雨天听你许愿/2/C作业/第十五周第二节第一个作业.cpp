#include<stdio.h>
#include<stdlib.h>
int s(int n)   //定义递归函数n; 
{
	if(n==1||n==2) 
	  return 1;
	else if(n>2)
	  return s(n-1)+s(n-2);
}
int main()
{
	int n,f;    //n代表输入数值，f代表数值位置 
	printf("输入n:");    //输入数值 
	scanf("%d",&n);
	f=s(n);    //调用递归函数 
	printf("Fibaonacci数列的第%d个数是%d",n,f);  //输出 
	printf("\n");
	system("pause");
	return 0;
	}
