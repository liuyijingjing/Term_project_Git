#include<stdio.h>
#include<stdlib.h>
int s(int n)   //����ݹ麯��n; 
{
	if(n==1||n==2) 
	  return 1;
	else if(n>2)
	  return s(n-1)+s(n-2);
}
int main()
{
	int n,f;    //n����������ֵ��f������ֵλ�� 
	printf("����n:");    //������ֵ 
	scanf("%d",&n);
	f=s(n);    //���õݹ麯�� 
	printf("Fibaonacci���еĵ�%d������%d",n,f);  //��� 
	printf("\n");
	system("pause");
	return 0;
	}
