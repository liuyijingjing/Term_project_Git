#include <stdio.h> 
#include <stdlib.h>
//���ͼ��������
void printS() 
{
    printf("   *\n"); 
    printf("  * *\n");
	printf(" *   *\n");
	printf("* * * *\n"); 
}
//���ͼ�������� 
void printZ()
{
	printf("* * * *\n"); 
	printf("*     *\n"); 
	printf("*     *\n"); 
	printf("* * * *\n"); 
}
//���ͼ����Բ��
void printT()
{
	printf(" * *\n");
	printf("*   *\n");
	printf("*   *\n");
	printf(" * *\n");
 }
 main()
{
	printS();  //���ú������ͼ�������� 
	printZ();  //���ú������ͼ��������
	printf("\n");	
	printS();  //���ú������ͼ�������� 
	printT();  //���ú������ͼ����Բ 
	printf("\n");	
	printT();  //���ú������ͼ����Բ 
	printZ();  //���ú������ͼ�������� 
	printf("\n");
	system("pause");
	return 0;		
 } 
