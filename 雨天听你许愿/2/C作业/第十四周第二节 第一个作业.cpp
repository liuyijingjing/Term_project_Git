#include <stdio.h>
#include <stdlib.h>
float AVG(float a,float b,float c)  //����AVG 
{
	float s=a+b+c;    //��S���� 
	return s;    //�����������ܺ� 
}
int main()
{
	float x,y,z,avg;   //������� 
	printf("������������:\n");   //������ֵ 
	scanf("%f%f%f",&x,&y,&z);
	avg=(x+y+z)/3;   //����ƽ��ֵ 
	printf("%.2f,%.2f,%.2f��ƽ��ֵ��%.2f", x,y,z,avg);  //�����ֵ 
	printf("\n");
	system("pause");
	return 0;
	}
