#include<stdio.h>
#include<stdio.h>
#define r 0.1495
#define d 15.6559
 main()
{
    float c1,c2,c3;
	printf("请输入人民币： \n");
    scanf("%f",&c1);
    c2=c1*r;
    c3=c1*d;
    printf(" 美元： %.2f,日元: %.2f\n",c2,c3);
    return 0;
}

