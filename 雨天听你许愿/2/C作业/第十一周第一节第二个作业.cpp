#include<stdio.h>
#include<stdlib.h>
main()
{
	int i,j,k,sum;    //����һ�ǵ���������ǵ�������һԪ������ 
	printf("С����Ǯ����𰸣�\n");
	for(i=1;;i++)
	if((18*i)%15==0&&(18*i)%20==0)    //�����ϵ���ж����� 
	{
		j=(18*i)/15;
		k=(18*i)/20;
		sum=i+5*j+10*k;
		if(sum%100==0) 
		{
			printf("1�ǵ���%d��,5�ǵ���%d��,1Ԫ����%d��",i,j,k);   //����� 
			break;       //���� 
		}
	}
	printf("\n");
	system("pause");
}

























/*#include <stdio.h>
#include <stdlib.h>
int main()
{
	int i,j,k,sum; //I,J,K�ֱ�Ϊһ�ǣ���ǣ�һԪӲ�ҵ�����
	scanf("%d%d%d",i,j,k);
	printf("С����Ǯ����𰸣�\n");
	for(i=0;i<100;i++) 
	{ 
	for(j=0;j<100;j++)
	{ 
	for(k=0;k<100;k++)
	{ 
	sum=i+j*5+k*10;  //I,j,k�Ĺ�ϵ 
	if((sum>=100)&&(sum%100==10)&&(i*1.8==j*1.5)&&(k*2==j*1.5))   //�ж�����
	{
		printf("1����%d��,5����%d��,1Ԫ��%d����\n",i,j,k,sum/10);
		break;
	}
	system("pause");
	return 0;  
	}  
	} 
	}
} */ 
