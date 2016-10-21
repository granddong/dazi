function typegame(){
    //定义字母对象
    this.objletter={};
    //创建游戏函数
    this.creatGame();
    //一开始出现的字母数量
    this.num=3;
    //检查字母出现是否存在重叠
    this.check();
    //创建分数面板
    this.creatScore();
    //分数
    this.score=0;
    //第几关，默认第一关玩起
    this.stage=1;
    //开始游戏
    this.startGame();
    //暂停游戏
    this.stopGame();
}

//为函数添加属性
typegame.prototype={
    //创建游戏
    creatGame:function(){
        //获取窗口高度和宽度
        var height=$(window).height();
        var width1=$(window).width();
        //获取有class=screen1的标签，修改其css
        $(".screen1").css({
            width:width1,
            height:$(window).height()-10,
            overflow:"hidden"
        });
    },
    //创建字母
    creatletter:function(){
        var that=this;
        do{
            var randomnum=Math.floor(Math.random()*26+65);
            //将数字转化为字母
            var randomletter=String.fromCharCode(randomnum);
        }while(this.objletter[randomletter]);//如果出现过就继续
        //四舍五入0到100
        var top1=-Math.round(Math.random()*100);
        //选出字母之间左右不相互重叠在一起的位置
        do{
            var left1=Math.round(Math.random()*740);
        }while(this.check(left1));
        //获取时间
        var time=new Date().getTime();
        //动态创建一个div，然后放图片
        //(selector).animate({styles},speed,easing,callback)样式，速度，加速度是否变化，回调函数
        //这个游戏只要有一个字母落到最底部就会输
        var ele=$("<div data-time="+time+"></div>").css({
            width:"100px",height:"100px",
            background:"url(img/"+randomletter+".png) center no-repeat",backgroundSize:"contain"
            ,lineHeight:"60px",fontSize:"30px",color:"#fff",
            textAlign:"center",position:"absolute",left:left1,top:top1
        }).appendTo(".screen1").animate({top:$(window).height()},6000,"linear",function(){
            if($("div[data-time="+time+"]")[0]){
                //重新赋值
                that.num = 3;
                that.score=0;
                that.stage=1;
                //清空对象内的全部el对象
                $.each(that.objletter,function(index,value){
                    value.el.remove();
                });
                //改为空的对象
                that.objletter={};
                //创建失败的画面
                that.createFail();
            }
        });
        this.objletter[randomletter]={start:left1-60,end:left1+60,keycode:randomnum,el:ele}
    },
    //开始游戏，创建字母
    palyGame:function(){
        this.keydown();
        for(var i=0;i<this.num;++i){
            this.creatletter();
        }
    },
    //检查字母是否重叠一起
    check:function(left){
        var flag=false;
        $.each(this.objletter,function(index,value){
            if(left>value.start&&left<value.end){
                flag=true;
            }
        });
        return flag;
    },
    //按键函数
    keydown:function(){
        var that=this;
        //是否获取到按键
        $(document).keydown(function(e){
            var code=e.keyCode;
            $.each(that.objletter,function(index,value){
                //找到按下的字母
                if(code==value.keycode){
                    //删除这个字母的信息
                    value.el.remove();
                    delete that.objletter[index];
                    //创建一个新的字母
                    that.creatletter();
                    //分数加加
                    that.score++;
                    //更换class=score标签的文本值
                    $(".score").html(that.score);
                    //如果这个分数大于等级乘10，那么就出现闯关成功，去下一关
                    if(that.score>=that.stage*10){
                        that.score=0;
                        $(".score").html(0);
                        that.num++;
                        that.stage++;
                        $.each(that.objletter,function(index,value){
                            value.el.remove();
                        });
                        that.objletter={};
                        //创建闯关成功画面
                        that.creatStage();
                    }
                }
            });
        });
    },
    //创建分数的函数
    creatScore:function(){
        $("<div class='score'>0</div>").css({
            background:"url(fs.png) no-repeat",
            backgroundSize:"150px 180px",
            width:150,height:180,
            position:"absolute",right:25,bottom:60,color:"#522E1A",
            fontSize:"60px",lineHeight:"140px",textAlign:"center"
        }).appendTo("body");
    },
    //创建闯关成功的画面
    creatStage:function(){
        var that=this;
        //alert(this.stage);
        $("<div class='stage'></div>").css({
            position:"absolute",top:"-50%",bottom:0,right:0,left:0,
            background:"url(cg.png)",
            width:520,height:400,backgroundSize:"contain no-repeat",
            margin:"auto",
            borderRadius:"5%",
            animation:"cg 2s linear"
        }).appendTo("body");
        var btn=$("<div class='btn'></div>").css({
            position:"absolute",top:"235px",right:0,left:"65px",margin:"auto",
            background:"url(xy.png)",
            zIndex:9999,
            fontFamily:"幼圆",
            fontSize:"22px",
            width:100,height:40,margin:"0 auto",
            marginTop:"200",
            color:"#fff",
            lineHeight:"40px",
            backgroundSize:"240px 300px",
            cursor:"pointer"
        }).appendTo(".stage").click(function(){
            that.palyGame();
            $(this).parent().remove();
        });
    },
    //创建失败的画面
    createFail:function(){
        var that=this;
        if(this.failbord){
            this.failbord.remove();
        }
        var btn=$("<div></div>").css({
            width:160,height:35,textAlign:"center",lineHeight:"30px",
            margin:"0 auto",cursor:"pointer",
            position:"absolute",right:0,left:0,margin:"auto",bottom:"70px"
        }).click(function(){
            $(".scor").html(0);
            that.palyGame();
            $(this).parent().remove();
        });
        this.failbord=$("<div></div>").css({
            position:"absolute",top:"-50%",bottom:0,right:0,left:0,
            background:"url(sp1.png)",
            width:500,height:350,backgroundSize:"400px 340px",
            margin:"auto",
            borderRadius:"5%",
            backgroundSize:"contain no-repeat",
            animation:"cg 2s linear"
        }).appendTo("body").append(btn);
    },
    //开始游戏按钮函数
    startGame:function(){
        var that=this;
        $("<div class='start'>开始游戏</div>").css({
            width:130,height:50,textAlign:"center",lineHeight:"50px",
            margin:"0 auto",cursor:"pointer",
            background:"url(stop.png) no-repeat",
            backgroundSize:"130px 50px",
            color:"#392112",
            position:"absolute",
            left:"175px",bottom:0,
            fontWeight:"bold",
            marginTop:"55px"
        }).appendTo("body").click(function(){
            that.palyGame();
        })
    },
    //暂停游戏函数
    stopGame:function(){
        var that=this;
        $(".stop1").click(function(){
            $.each(that.objletter,function(index,value){
                value.el.stop();
            });
            if($(".stop1").html()=="暂停游戏"){
                 $(".stop1").html("继续游戏");
            }else if($(".stop1").html()=="继续游戏"){
                $(".stop1").html("暂停游戏");
                //全部元素重新添加一次动画，就能继续开始了
                $.each(that.objletter,function(index,value){
                    value.el.animate({top:$(window).height()},6000,"linear",function(){
                        that.num=3;
                        that.stage=1;
                        that.score=0;
                        $.each(that.objletter,function(index,value){
                            //value.el.stop();
                            value.el.remove();
                        });
                        that.objletter={};
                        that.createFail();
                    })
                })
            }
        })
    }
};