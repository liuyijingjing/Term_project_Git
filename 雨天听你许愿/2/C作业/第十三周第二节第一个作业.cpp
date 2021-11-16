#include <stdio.h> 
#include <stdlib.h>
#include <string.h> 
main()
{
	char a[5][5];
	char b[5];
	int i;
	//输入 
	printf("请输入学生的学号:\n");
	for(i=0;i<5;i++)
	{
		scanf("%s",a[i]);
	}
	//查找 
    printf("请输入你要查找人的学号:");
    scanf("%s",b);
for(i=0;i<5;i++)
		{
			if(strcmp(a[i],b)==0)  //比较             
			{
				printf("找到了，位置是%d",i+1);   //输出 
				printf("\n");
				break;
			}	
		}
		if(i>=5)
			{
				printf("查无此人!");      //输出 
			    printf("\n"); 
			}

	system("pause");
	return 0; 
}
