//页面滑动
function Swipe(container){

 var element = container.find(":first"); // ul

 var slides = element.find("li");		// li
 //滑动对象
 var swipe = new Object();
 
 var width = container.width();			//div width
 var height = container.height();		// div height

 element.css({							//设置ul的长宽
 	width : ( width * slides.length ) + 'px',
 	height: height +'px'
 });

$.each(slides , function(index){	//设置每个li的长宽
	var slide = slides.eq(index);
	slide.css({
		width : width + 'px',
		height: height +'px'
	});
});

//页面滚动
swipe.scrollTo = function( x , speed ){
	element.css({
	'transition-duration': speed + 'ms',
	'transition-timing-function': 'linear',
	'transform': 'translate3d(-' + x + 'px,0px,0px)'
});
	return this;
};
return swipe;
/*          另一种页面滚动的方式setTimeout
function moveMessage(){
	var elem = element[0];
	var xpos = parseInt(elem.offsetLeft);
	if(xpos > -2*width){
	xpos-=5;
	elem.style.left = xpos + 'px';
	console.log(elem);
	movement = setTimeout("moveMessage()" , 10 );
	}
};
$('button').click(moveMessage);
*/
}