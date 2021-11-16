#include <stdio.h>
#include <stdlib.h>
float AVG(float a,float b,float c)  //定义AVG 
{
	float s=a+b+c;    //对S声明 
	return s;    //返回三个数总和 
}
int main()
{
	float x,y,z,avg;   //定义变量 
	printf("请输入三个数:\n");   //输入数值 
	scanf("%f%f%f",&x,&y,&z);
	avg=(x+y+z)/3;   //计算平均值 
	printf("%.2f,%.2f,%.2f的平均值是%.2f", x,y,z,avg);  //输出数值 
	printf("\n");
	system("pause");
	return 0;
	}
