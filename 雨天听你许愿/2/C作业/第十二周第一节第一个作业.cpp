#include <stdio.h>
#include <stdlib.h>
int main() 
{
	int a[5],i,j;   //����洢�ɼ���i���Ʊ��� ,jΪ����ʱ����ı��� 
		for(i=0;i<5;i++)
	{
		printf("�������%d���ɼ�:\n",i+1);   //����ɼ� 
		scanf("%d",&a[i]);
	}
	printf("������Ҫ���ҵ�����");       //����������ֵ 
	scanf("%d",&j);
  for(i=0;i<5;i++)
	{
	  if(a[i]==j)
     	{
	    printf("�ҵ��ˣ�λ����%d\n",i+1);    //���λ�ý�� 
		break;	
	    }
	}
  if(i>=5)         
	{
	    printf("δ�ҵ�!\n");
	} 
	system("pause");
	return 0;
}
