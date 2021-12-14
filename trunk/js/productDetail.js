/*详情页面*/
$(function () {
   //调用插件函数
   magnifier({
      magnifier : "#magnifier1",//最外层的大容器
		width : 340,//承载容器宽
		height : 470,//承载容器高
		zoom : 2//缩放比例
   })
   //按钮点击切换
  $('.right-box .kind').click(function(){

  })

   //数量的加和减
   $('.right-box .switch .add').on('click',function(){
	  //下一个input节点
	  var $nextInput=$(this).next();
	  //获取输入框的值
	  var oldVal =parseInt($nextInput.val());
	  //自增
	  oldVal++;
	  //重新赋值给这个输入框
	  $nextInput.val(oldVal);
  })
  //减少
    $('.right-box .switch .reduce').on('click',function(){
	  //上一个input节点
	  var $prevInput=$(this).prev();
	  //获取输入框的值
	  var oldVal =parseInt( $prevInput.val());
	  //自增
	  oldVal--;

	
	  oldVal =oldVal <1 ?1:oldVal//如果小于1就等于1 否则就等于自己

	  //重新赋值给这个输入框
	  $prevInput.val(oldVal);
  })
})