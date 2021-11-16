#include<stdio.h> 
int main()
{
	float a,b,l,s;
	printf("请输入长和宽：（用空格间隔）\n");
	scanf("%f %f",&a,&b);
	l=2*(a+b);
	s=a*b;
	printf("周长=%.2f,面积=%.2f\n",l,s);
	return 0;
}
