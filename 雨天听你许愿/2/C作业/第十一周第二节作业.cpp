#include <stdio.h>
#include <stdlib.h>
int main() {
	int x[5],i,max,j,k,temp;//x����洢�ɼ���i��ѭ������// 
	float sum=0;
	for(i=0;i<5;i++)
	{
		printf("�������%d���ɼ�:\n",i+1);
		scanf("%d",&x[i]);
	}
	for(i=0;i<5;i++)
	sum=sum+x[i];
		printf("ƽ���ɼ���%.1f\n",sum/5);
		   max=x[0];
	    for(i=1;i<5;i++)
	    {
	    	if(max<x[i])     //�����ж�// 
	    	max=x[i];       //��ֵ//
		} 
		printf("��߷���:%d\n",max);
    for(i=0;i<4;i++)
	{
		k=i;
		for(j=i+1;j<5;j++)
		   if(x[j]<x[k])
		   k=j;
		   if(i!=k)
		   {
		   temp=x[i];
		   x[i]=x[k];
		   x[k]=temp;
		   }
	}
	printf("�����ĳɼ���:\n");
	for(i=0;i<5;i++)
	{
		printf("%d ",x[i]);
	}
	return 0;
}
