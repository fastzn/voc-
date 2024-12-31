var container = $("#content");

var visualWidth = container.width();
var visualHeight = container.height();

function BoyWalk(){

var $boy = $("#boy");
var boyHeight = $boy.height();

var instanceX;//


var swipe = Swipe( container );

var getValue = function( className ){
	var $elem = $('' + className + '');
	return {
		height : $elem.height(),
		top : $elem.position().top
	};
};

var pathY = function(){
	var data = getValue( '.a_background_middle' );
	return data.top + data.height / 2;
}();


//修正小男孩位置
$boy.css({
	top : pathY - boyHeight + 25
});

////////////////////////////////动画处理////////////////////////////

function slowWalk(){
	$boy.addClass('slowWalk');
}

function pauseWalk(){
	$boy.addClass('pauseWalk');
}

function restoreWalk(){
	$boy.removeClass('pauseWalk');
}

function calculateDist( direction , porperation){
	return(direction == 'x' ? visualWidth*porperation : visualHeight*porperation);
}

function startRun( options , runTime){
	//异步对象
	var dtdPlay = $.Deferred();
	//恢复走路
	restoreWalk();
	//运动属性
	$boy.transition(
		options,
		runTime,
		'linear',
		function(){
			return dtdPlay.resolve();	//动画完成
		}
	);
	return dtdPlay;
}

function walkRun(time , disX , disY){
	time = time || 3000;
	//脚动作
	slowWalk();
	//开始走路
	var d1 = startRun({
		'left' : disX + 'px',
		'top' : disY ? disY + 'px' : undefined
	}, time);
	return d1;
}


//走进商店
function walkToShop(runtime){
	var defer = $.Deferred();
	var doorObj = $(".door");
	var doorOffset = doorObj.offset();
	var doorLeft = doorOffset.left;
	var boyOffset = $boy.offset();
	var boyLeft = boyOffset.left;

	instanceX = ( doorLeft + doorObj.width()/2 ) - ( boyLeft + $boy.width()/2 );

	var walkPlay = startRun({
		transform : 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
		opacity : 0.1
	},runtime);

	walkPlay.done(function(){
		$boy.css('opacity' , 0);
		defer.resolve();
	});

	return defer;
}

//走出商店
function walkOutShop(runtime){
	var defer = $.Deferred();
	restoreWalk();
	var walkPlay = startRun({
		transform : 'translateX(' + instanceX + 'px),scale(1,1)',
		opacity : 	1
	},runtime);

	walkPlay.done(function(){
		defer.resolve();
	});
}

//拿到花
function boyTakeFlower(){
		var defer = $.Deferred();

			$boy.addClass("takeFlower");
			defer.resolve();

		return defer;
}

return {
	
	//停止走路
	stopWalk : function(){
		pauseWalk();
	},
	//开始走路
	walkTo : function(time ,porperationX ,porperationY){
		var distX = calculateDist('x', porperationX);
        var distY = calculateDist('y', porperationY);
        return walkRun(time, distX, distY);
	},

	setColor : function(value ){
		$boy.css('background-color' ,value);
	},

	//进入商店
	toShop : function(){
		return walkToShop.apply(null, arguments);
	},

	//离开商店
	outShop : function(){
		return walkOutShop.apply(null, arguments);
	},
	//拿花
	takeFlower : function(){
		return boyTakeFlower();
	},
	//还原boy
	resetOriginal : function(){
		this.stopWalk();
		$boy.removeClass("slowWalk takeFlower").addClass('boyOriginal');
	},
	//设置间隔
	interval : function( time ){
		var defer = $.Deferred();
		setTimeout(function(){
			defer.resolve();
		},time);
		return defer;
	},
	//男孩的宽度
	getWidth: function() {
                return $boy.width();
    },
    //转身
    rotate : function( callback ){
    	$boy.addClass('boyRotate');
    	if( callback ){
    		$boy.on( animationEnd , function(){
    			callback();
    			$(this).off();
    		})
    	}
    }
}


}

//操作门的位置
function doorAction(left ,right ,time ){
	var $doorLeft = $(".door-left");
	var $doorRight = $(".door-right");
	var count = 2;
	var defer = $.Deferred();
	var complete = function(){
		if(count == 1){
			defer.resolve();
			return;
		}
		count --;
	}

	$doorLeft.transition({
		'left' : left
	},time , complete);

	$doorRight.transition({
		'left' : right
	}, time , complete);
	
	return defer;

}

//开门
function openDoor(){
	return doorAction('-50%' ,'100%' ,2000);
}

//关门
function shutDoor(){
	return doorAction('0%', '50%' ,2000);
}

//控制灯的状态
var lamp = {
	elem : $(".b_background"),
	bright : function(){
		this.elem.addClass("lamp-bright");
	},
	dark : function(){
		this.elem.removeClass("lamp-bright");
	}
}

var bird = {
	elem : $('.bird'),
	fly : function(){
		this.elem.addClass('birdFly');
		this.elem.transition({
			right : container.width()
		},15000 ,'linear')
	}
};



var audioConfig = {
	enable : true ,
	playUrl : 'music/happy.wav',
	cycleUrl : 'music/circulation.wav'
}

function html5Audio( url , isloop ){
	var audio = new Audio( url );
	audio.autoPlay = true;
	audio.loop = isloop || false;
	audio.play();

	return {
		end : function( callback){
			audio.addEventListener( 'ended' , function(){
				callback();
			},false);
		}
	};
}

var snowflakeUrl = [
	"images/snowflake/snowflake1.png",
	'images/snowflake/snowflake2.png',
	'images/snowflake/snowflake3.png',
	'images/snowflake/snowflake4.png',
	'images/snowflake/snowflake5.png',
	'images/snowflake/snowflake6.png'
];

function snowflake(){
	//雪花容器
	var $flakeContainer = $('#snowflake');

	function getImages(){
		return snowflakeUrl[Math.floor( Math.random() * 6) ];
	}
	//创建雪花节点
	function createSnow(){
		var url = getImages();

		return $('<div class="snowbox"></div>').css({
			'width' : 41,
			'height' : 41,
			'position' : 'absolute',
			'top' : '-41px',
			'z-index' : 1000,
			'background-image' : 'url(' + url + ')'
		}).addClass('snowRoll');
	}
 
	//开始飘雪花
	setInterval(function(){
		 var startPositionLeft = Math.random() * visualWidth - 100,
             startOpacity    = 1,
			 endPositionTop  = visualHeight - 40,
			 endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
			 duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnow();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0
            }, duration, 'ease-in-out', function() {
                $(this).remove() //结束后删除
            });
	},200)
	}


	

 	
