# include<stdio.h>
# include<stdlib.h> 
enum weeked{    //����ö������Weeked 
	moondday,tuesday,wednesday,thursday,friday,saturday,sunday
};
int main( )
{
	enum weeked yesterday,thisday,nextday;  //����ö�ٱ��� 
	yesterday=wednesday;
	thisday=thursday;
	nextday=friday;
	printf("����������%d,����������%d,����������%d.\n",yesterday,thisday,nextday);
	system("pause");
 
}
     
