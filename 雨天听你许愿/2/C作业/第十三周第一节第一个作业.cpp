#include <stdio.h>
#include <stdlib.h>
main()
{
	int i=0,j=0;    //初始化每个学生的成绩
	int a[5][3];   //输入每个学生成绩
	for(i=0;i<5;i++)
	{
		printf("请输入第%d个学生成绩:\n",i+1);	
		for(j=0;j<3;j++)
		{
		    scanf("%d",&a[i][j]);
		}	
	} 
	printf("\n");   //每输完一个学生成绩就换行
    for(i=0;i<5;i++)     //输出 
    {
    	printf("第%d的成绩:",i+1);
        for(j=0;j<3;j++)
        {
    	   printf("%3d",a[i][j]);
	    }
	    printf("\n");
	}
    system("pause");
	return 0; 
}
