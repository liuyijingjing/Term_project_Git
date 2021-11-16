# include<stdio.h>
# include<stdlib.h> 
enum weeked{    //定义枚举类型Weeked 
	moondday,tuesday,wednesday,thursday,friday,saturday,sunday
};
int main( )
{
	enum weeked yesterday,thisday,nextday;  //定义枚举变量 
	yesterday=wednesday;
	thisday=thursday;
	nextday=friday;
	printf("昨天是星期%d,今天是星期%d,明天是星期%d.\n",yesterday,thisday,nextday);
	system("pause");
 
}
     
