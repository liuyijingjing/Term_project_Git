#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int main()
{
	int a[4][3],i,j,max;
    int sum=0;
	for(i=0;i<4;i++)
	{
		printf("�������%d��ѧ���ĳɼ�:",i+1); //�������� 
		for(j=0;j<3;j++)
		{
			scanf("%d",&a[i][j]);
		}
    }
	for(i=0;i<4;i++)   //�� 
    {
		sum=0;
		for(j=0;j<3;j++)  //�� 
    	{
    		sum+=a[i][j];    //�����ųɼ����ܺ� 
		}
		printf("��%d��ѧ����ƽ����:%d",i+1,sum/3);  //���ƽ���� 
		max=a[i][0];
	    for(j=0;j<3;j++)
       {	
		  if(max<a[i][j])   //�������� 
			{
				max=a[i][j];
			}
		} 
	printf("��߷�:%d\n",max);	   //�����߷� 
	}
	system("pause");
	return 0;
}     
