/**
 * 乐购商城首页js
 * 2021-10-25 
 */
//当页面加载成功
$(function() {
    /*首页大图轮播*/
    $("#bannerInner").tyslide({
        boxh: 460, //盒子的高度
        w: 1000, //盒子的宽度
        h: 390, //图片的高度
        isShow: true, //是否显示控制器
        isShowBtn: true, //是否显示左右按钮
        controltop: 40, //控制按钮上下偏移的位置,要将按钮向下移动   首先保证boxh 高度>图片 
        controlsW: 20, //控制按钮宽度
        controlsH: 20, //控制按钮高度
        radius: 10, //控制按钮圆角度数
        controlsColor: "#d7d7d7", //普通控制按钮的颜色
        controlsCurrentColor: "#ff6600", //当前控制按钮的颜色
        isShowNum: true //是否显示数字
    });
    /*图书电子书小轮播图*/
    $("#ebooks-banner").tyslide({
        boxh:223,//盒子的高度
        w:332,//盒子的宽度
        h:223,//图片的高度
        isShow:true,//是否显示控制器
        isShowBtn:true,//是否显示左右按钮
        controltop:5,//控制按钮上下偏移的位置,要将按钮向下移动   首先保证boxh 高度>图片 h
        controlsW:20,//控制按钮宽度
        controlsH:2,//控制按钮高度
        controlsColor:"#d7d7d7",//普通控制按钮的颜色
        controlsCurrentColor:"green",//当前控制按钮的颜色
    });

    /*新书列表手风琴效果*/
    $('.ebooks .right-box ul>li').mouseenter(function() {
        //所有兄弟：隐藏详情，显示标题
        $(this).siblings().find('.desc').hide();
        $(this).siblings().find('.ebooks-title').show();
        //当前:隐藏标题，显示详情
        $(this).find('.ebooks-title').hide(); //隐藏标题
        $(this).find('.desc').show(); //显示详情
    });
    /*服装轮播图*/
    $("#clothes-banner").tyslide({
        boxh:340,//盒子的高度
        w:427,//盒子的宽度
        h:340,//图片的高度
        isShow:true,//是否显示控制器
        isShowBtn:true,//是否显示左右按钮
        controltop:165,//控制按钮上下偏移的位置,要将按钮向下移动   首先保证boxh 高度>图片 h
        controlsW:20,//控制按钮宽度
        controlsH:2,//控制按钮高度
        controlsColor:"#d7d7d7",//普通控制按钮的颜色
        controlsCurrentColor:"green",//当前控制按钮的颜色
    });
    /*户外运动轮播*/
    $("#sport-banner").tyslide({
        boxh:340,//盒子的高度
        w:427,//盒子的宽度
        h:340,//图片的高度
        isShow:true,//是否显示控制器
        isShowBtn:true,//是否显示左右按钮
        controltop:165,//控制按钮上下偏移的位置,要将按钮向下移动   首先保证boxh 高度>图片 h
        controlsW:20,//控制按钮宽度
        controlsH:2,//控制按钮高度
        controlsColor:"#d7d7d7",//普通控制按钮的颜色
        controlsCurrentColor:"green",//当前控制按钮的颜色
    });
    /*童装轮播*/
    $("#children-clothes-banner").tyslide({
        boxh:340,//盒子的高度
        w:427,//盒子的宽度
        h:340,//图片的高度
        isShow:true,//是否显示控制器
        isShowBtn:true,//是否显示左右按钮
        controltop:165,//控制按钮上下偏移的位置,要将按钮向下移动   首先保证boxh 高度>图片 h
        controlsW:20,//控制按钮宽度
        controlsH:2,//控制按钮高度
        controlsColor:"#d7d7d7",//普通控制按钮的颜色
        controlsCurrentColor:"green",//当前控制按钮的颜色
    });
    /*电子书 table切换*/
    var $lis = $('.ebooks .ebooks-nav >li');
    $lis.mouseover(function() {
        //给自己添加激活类active 把兄弟的都干掉
        $(this).addClass('active').siblings().removeClass('active');
        //获取index
        var index = $(this).index();
        //选中内容
        var $ebooksList = $('.ebooks-list');
        //显示索引等于当前index
        $ebooksList.eq(index).show().siblings('.ebooks-list').hide();
    });
    /*推广商品切换 */
    $('.promotion title ul li').mouseover(function() {
        //导航激活类
        $(this).addClass('active').siblings().removeClass('active')
            //内容切换

    });
})