/*购物车JS文件*/ 
$(function () {
   //全选
   /*
     1.点击表头的全选框  获取表头全选框的选中状态
     2.表格中选择框状态需要一致
     3.结算中的全选按钮状态一致
   */
  //定义三个变量
    var $theadInput = $('table thead input[type=checkbox]');
    var $bodyInput = $('table tbody input[type=checkbox]');
    var $allPriceInput = $('.totalPrice .totalPrice-left input[type=checkbox]');


    $theadInput.change(function () {
        //获取选中吧状态
        var state = $(this).prop('checked');
        //让表格中的选择框状态保持一致
        $bodyInput.prop('checked',state);
        //结算中的选择框状态保持一致
        $allPriceInput.prop('checked',state);

        //调用计算总价函数
        calcTotalPrice();
    })
   //2.结算中的选择框，也需要有相同的功能
   $allPriceInput.change(function () {
    //获取选中吧状态
    var state = $(this).prop('checked');
    //让表格中的选择框状态保持一致
    $bodyInput.prop('checked',state);
    //结算中的选择框状态保持一致
    $theadInput.prop('checked',state);

    //调用计算总价函数
    calcTotalPrice();
   })
    //3.选中所有表格中的选择框 表头和结算的选择状态保持一致
    $bodyInput.change(function () {
        //定一个标杆
        var flag = true;
        //总价
        var totalPrice = 0;
         //循环表格中所有选择框的选中状态
         $bodyInput .each(function (i, input) {
             if (!$(input).prop('checked')){
                 flag = false;
             }
         })
         //把状态用来改变全选框
         $theadInput.prop('checked',flag)
         $allPriceInput.prop('checked',flag)

         //调用计算总价函数
          calcTotalPrice();
          
        
    })
    //数量的加减功能
    //加
    $('.add').on('click', function () {
        //下一个input节点
         var $nextInput = $(this).next();
        //获取输入框的值
        var oldVal = parseInt($(this).next().val());
        //自增
        oldVal++;
        //重新赋值给这个输入框
        $nextInput.val(oldVal);
        //小计
        subTotalPrice(oldVal, $(this));

        //调用计算总价函数
        calcTotalPrice();
    })
    //减
    $('.reduce').on('click', function () {
        //上一个input节点
        var $prevInput = $(this).prev();
        //获取输入框的值
        var oldVal = parseInt($prevInput.val());
        //自减
        oldVal--;
        //如果小于1就等于1否则就等于自己
        oldVal = oldVal < 1 ? 1 : oldVal;
        //重新赋值给这个输入框
        $prevInput.val(oldVal);
        //小计
        subTotalPrice(oldVal, $(this));

        //调用计算总价函数
        calcTotalPrice();
    })
    //抽取一个小计的函数
    function subTotalPrice(val,dom) {
        var subtotal = val * parseFloat( dom.closest('tr').find('.price').text() );
        //把小计的结果放到 对应的位置
        dom.closest('tr').find('.subprice').text(subtotal.toFixed(2));
    }
    //删除
    $('.del').on('click', function () {
        //删除整行
        $(this).closest('tr').remove();
        calcgoodsCount() //调用商品总数量
    })
    
    //计算总价的函数
    function calcTotalPrice() {
        //定一个数量
        var count = 0;
        //定义变量 保持总价格
        var totalPrice = 0;
        //循环表格中所有的选择框   如果选中的 那么就要计算总价
        $bodyInput.each(function (i, input) {
           //判断选中状态  如果选中的 那么就要计算总价
           if($(input).prop('checked')) {
               count++;
               //累加价格
               totalPrice += parseFloat( $(input).closest('tr').find('.subprice').text());
           }

        })
        //把总价渲染到对应的位置
        $('.totalPrice .totalPrice-right ul li:nth-child(2) span').text( totalPrice.toFixed(2) )
        //把数量渲染到对应的位置
        $('.totalPrice .totalPrice-right ul li:nth-child(1) span').text(count)
    }
    //全部商品
    function calcgoodsCount() {
         $('.goodsCount').text( $('table tbody tr').length )
         calcgoodsCount;//一进入页面就自动调用一次
    }
    
    
})