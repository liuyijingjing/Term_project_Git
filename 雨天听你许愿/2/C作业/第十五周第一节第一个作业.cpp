#include <stdio.h>
#include <stdlib.h>
long lifang(int a)   //������һ���������� 
{
	return a*a*a;
}
long sum(int x,int y,int z)   //���������������ܺ� 
{
	int he;
	he=lifang(x)+lifang(y)+lifang(z);   
    return he;
}
main()
{
	int a,b,c;   //����������ֵ 
	int jg=0;    //��ʼ�� 
	printf("��������������:\n");   
	scanf("%d%d%d",&a,&b,&c);  //�������� 
	jg=sum(a,b,c);      //���ú��� 
	printf("%d,%d��%d����������:%d",a,b,c,jg);  //������� 
	printf("\n");
	system("pause");
	return 0;
}
