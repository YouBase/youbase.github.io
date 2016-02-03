module.exports = function(){ "use strict";
	var queue = []
	this.add = function(func){
		queue.push(func);
	}
	TweenLite.ticker.addEventListener("tick", function (){
		if(queue.length > 0) (queue.pop())();
	});
};