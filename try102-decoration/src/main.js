(function(){
	var applyDecoration = function(elmId, style){
		var styleCls = "decoration-cls-" + style;
		var oldClasses = document.getElementById(elmId).className;
		oldClasses = oldClasses.split(" ");
		var newClasses = [styleCls];
		for(var i=0; i<oldClasses.length; i++){
			if (oldClasses[i] && oldClasses[i].indexOf("decoration-cls-")!=0){
				newClasses[newClasses.length] = oldClasses[i];
			}
		}
		document.getElementById(elmId).className = newClasses.join(" ");
	}
	exports.applyDecoration = applyDecoration;
})();
