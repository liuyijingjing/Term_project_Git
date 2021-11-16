#include <stdio.h> 
#include <stdlib.h>
//输出图形三角形
void printS() 
{
    printf("   *\n"); 
    printf("  * *\n");
	printf(" *   *\n");
	printf("* * * *\n"); 
}
//输出图形正方形 
void printZ()
{
	printf("* * * *\n"); 
	printf("*     *\n"); 
	printf("*     *\n"); 
	printf("* * * *\n"); 
}
//输出图形椭圆形
void printT()
{
	printf(" * *\n");
	printf("*   *\n");
	printf("*   *\n");
	printf(" * *\n");
 }
 main()
{
	printS();  //调用函数输出图形三角形 
	printZ();  //调用函数输出图形正方形
	printf("\n");	
	printS();  //调用函数输出图形三角形 
	printT();  //调用函数输出图形椭圆 
	printf("\n");	
	printT();  //调用函数输出图形椭圆 
	printZ();  //调用函数输出图形正方形 
	printf("\n");
	system("pause");
	return 0;		
 } 
