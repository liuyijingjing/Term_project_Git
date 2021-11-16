//整数交换
#include <stdio.h>
int main()
{
	int x,y;
	printf("请输入两个数(用逗号隔开):\n");
	scanf("%d,%d",&x,&y);
	printf("交换前x=%d,y=%d\n交换后x=%d,y=%d",x,y,y,x);
	return 0;
}
