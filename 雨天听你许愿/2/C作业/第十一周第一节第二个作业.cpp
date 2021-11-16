#include<stdio.h>
#include<stdlib.h>
main()
{
	int i,j,k,sum;    //定义一角的数量，五角的数量，一元的数量 
	printf("小明存钱问题答案：\n");
	for(i=1;;i++)
	if((18*i)%15==0&&(18*i)%20==0)    //定义关系，判断条件 
	{
		j=(18*i)/15;
		k=(18*i)/20;
		sum=i+5*j+10*k;
		if(sum%100==0) 
		{
			printf("1角的有%d个,5角的有%d个,1元的有%d个",i,j,k);   //输出答案 
			break;       //结束 
		}
	}
	printf("\n");
	system("pause");
}

























/*#include <stdio.h>
#include <stdlib.h>
int main()
{
	int i,j,k,sum; //I,J,K分别为一角，五角，一元硬币的数量
	scanf("%d%d%d",i,j,k);
	printf("小明存钱问题答案：\n");
	for(i=0;i<100;i++) 
	{ 
	for(j=0;j<100;j++)
	{ 
	for(k=0;k<100;k++)
	{ 
	sum=i+j*5+k*10;  //I,j,k的关系 
	if((sum>=100)&&(sum%100==10)&&(i*1.8==j*1.5)&&(k*2==j*1.5))   //判断条件
	{
		printf("1角有%d个,5角有%d个,1元有%d个。\n",i,j,k,sum/10);
		break;
	}
	system("pause");
	return 0;  
	}  
	} 
	}
} */ 
