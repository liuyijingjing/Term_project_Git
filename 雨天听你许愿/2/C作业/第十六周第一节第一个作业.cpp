//��N��ͬѧ����߷�
#include<stdio.h>
#include<stdlib.h>
//float max(float array[],int n);   //��������
int main()
{
	float score1[5]={98.5,97,91,94,96};
	float score2[10]={88.5,87.5,68,99,98,88,77,66,55,88};
	int max=0,m=0;
	int i;
	max=score1[0];
	for(i=0;i<5;i++)
	{
		if(score1[i]>max)
		max=score1[i];
	}
    printf("5��ͬѧ����߷���:%d\n",max);
    m=score2[0];
    for(i=0;i<10;i++)
	{
	   	if(score2[i]>m)
	   	m=score2[i];
	} 
	printf("10��ͬѧ����߷���:%d\n",m);
	system("pause");
	return 0;
 }
