/*购物车功能重写JS文件*/ 
$(function () {

     //定义三个变量
     var $theadInput = $('table thead input[type=checkbox]');
     var $tbodyInputs = $('table tbody input[type=checkbox]');
     var $allPriceInput = $('.totalPrice .totalPrice-left input[type=checkbox]');
 
     //全选
    /*
      1给表头中的全选按钮 绑定单击事件 单击的时候 获取到它的选中状态（TRUE / FALSE）
      2.给表格中的每一行的数据的input选择框，赋值为表头的选中状态（TRUE / FALSE）
      3.给计算总价中的全选框，也赋值为表头的选中状态（TRUE / FALSE） 
    */
   //表头的全选
   $theadInput.change(function () {
      var checkState = $(this).prop('checked');  //获取全选框的选中状态
      $tbodyInputs.prop('checked',checkState);   //把状态给表格中的选择框
      $allPriceInput.prop('checked',checkState);  //把状态给计算总价中的全选框
      allTotal();  //总计
   })   
   //计算总价的全选
   /*
       1.给计算总价的全选按钮 绑定单击事件，获取选择状态 （TRUE / FALSE）
       2.把状态给表头的全选
       3.把状态给表格中的选择框
   */
   $allPriceInput.change(function () {
      var checkState = $(this).prop('checked');  //获取计算总价中的全选状态
      $tbodyInputs.prop('checked',checkState);   //把状态给表格中的选择框
      $theadInput.prop('checked',checkState);  //把状态给表头中的选择框

      allTotal();  //总计

   })   
   /*
    表格中的选择框 反过来影响两个选择框
      1.给表格中的选择框绑定单击事件
      2.定一个标杆 flag = true;
      3.循环表格中的选择框
      4.获取每一个选择框的选中状态
        判断：如果有一个是false ，那么就不是全选 flag = false
      5.把flag的值赋值给两个全选框 (因为flag就是对应选中状态)
    */
   $tbodyInputs.change(function () {  //给表格中的选择框绑定单击事件
       var flag = true ;   //定一个标杆
       $tbodyInputs.each(function (index , input) {  //循环表格中的选择框
          var checkState = $(this).prop('checked');  //获取每一个选择框的选中状态
          if(checkState === false) {                //判断：如果有一个是false ，那么就不是全选 flag = false
              flag = false;                         //标杆变为false
          }
       })
       $theadInput.prop('checked',flag);     //把状态赋值给头部全选框
       $allPriceInput.prop('checked',flag);  //把状态赋值给计算总价全选框

       allTotal();  //总计
       
   })  
   /*
     加法功能：
       1.获取+按钮，绑定单击事件
       2.点击的时候，获取后面输入框的值
       3.输入框的值自增
       4.把自增后的值，重新赋值给后面的输入框
    */
   $('.add').click(function () { //给add增加绑定事件
       var count = parseInt($(this).next().val());  //取后面输入框的值
       count++; //自增
       $(this).next().val(count); //把自增的值 赋值给后面的输入框

       //小计
       subTotal($(this), count);

       allTotal();  //总计
   })
   /*
       1.获取-按钮 ，绑定单击事件
       2.获取前面输入框的值
       3.输入框的值自减,边界判断，如果小于1，那么等于1，否则等于自己
       4.把减少后的值 重新赋值给前面的输入框
   */
   $('.reduce').click(function () {   //绑定单击事件
       var count = parseInt($(this).prev().val());  //获取前面输入框的值
       count--;   //自减
       count = count < 1 ? 1 : count; //边界判断，如果小于1，那么等于1，否则等于自己 
       $(this).prev().val(count);  //把减少后的值 重新赋值给前面的输入框


       //小计
       subTotal($(this), count);

       allTotal();  //总计
   })
   /*
      封装一个小计函数：（点击 + 或 - 的时候 需要调用小计功能）
   */
   
  function subTotal(dom, count) {
      /*找单价*/
      var singlePrice = parseFloat(dom.closest('tr').find('.price').text()); //找单价
      var subTotalPrice = singlePrice * count; //单价*数量=小计
      dom.closest('tr').find('.subprice').text(subTotalPrice.toFixed(2))
   }

   /*
      总计功能实现：(头部全选 计算总价全选 表格的选择框 + - 删除 留个地方调用总计)
        1.定义一个变量 用于保存总价 定义一个变量 用于保存已选商品 数量
        2.获取表格中所有的选择框 循环 获取选中状态 判断
        3.如果选中，那么就要累加这一行的小计 
   */
   function allTotal() {  
       var allPrice = 0;    //  定义一个变量 用于保存总价
       var selectedCount = 0;  //定义一个变量 用于保存已选商品 数量   

       $('table tbody input[type=checkbox]').each(function () {  //获取表格中所有的选择框 循环 获取选中状态 判断
          var checkState = $(this).prop('checked');   //获取选中状态
          if (checkState) {    //如果是true
              allPrice += parseFloat($(this).closest('tr').find('.subprice').text());
              selectedCount++;  //数量+1
          }

          //渲染
          $('.total').text(allPrice.toFixed(2));  //渲染总价
          $('.count').text(selectedCount);    //渲染数量
       })
   }
   /*
       关于下面的删除功能：模拟，并不是真正意义上的删除，是‘伪’删除
   */
  //删除
  $('.del').click(function () {
      //删除整行
      $(this).closest('tr').remove();
      getGoodsCount(); //重新计算商品数量
      allTotal(); //计算总价
  })

  //删除选中
  $('.deleteChecked').click(function () {  //获取表格中所有的选择框 循环 获取选中状态 判断
      $('table tbody input[type=checkbox]').each(function () {
          var checkState = $(this).prop('checked');   //获取选中状态
          if (checkState) {    //如果是true
            $(this).closest('tr').remove();
        } 
      })
      getGoodsCount();  //重新计算页面商品数量
      allTotal(); //计算总价
    })

    //封装一个获取全部商品的函数
    function getGoodsCount () {
         //获取数量
         var goodsCount = $('table tbody tr').length;
         //渲染
         $('.goodsCount').text(goodsCount);
     }
     getGoodsCount(); //页面加载调用一次
   
})