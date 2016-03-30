//CONSTANTS
var correct_style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,255,0,0.25)"
  }),
  stroke: new ol.style.Stroke({
    color: "gold",
    width: 2
  }),
});
var point_correct_style=new ol.style.Style({
	image:new ol.style.Circle({
		radius:10,
		stroke: new ol.style.Stroke({
			color: "rgba(255,0,0,1)",
			width: 5
		}),				
		fill: new ol.style.Fill({
			color: "rgba(255,255,0,1)",
		}),
	})
});
controlB = function(opt_options) {
	
	//http://openlayers.org/en/v3.14.0/examples/custom-controls.html
	
	var options = opt_options || {};
	var button = document.createElement('button');
	button.id="gearB";
	button.innerHTML = '<img src="./static/ggmc/img/gear-white.png"/>';
	button.title="Configuration";
	
	var controlCB = function() {
		console.log("controlCB");
		$(".control_panel").toggleClass("show");
		console.log("controlCB show off");
	};
	
	button.addEventListener('click', controlCB, false);
	button.addEventListener('touchstart', controlCB, false);
	
	var element = document.createElement('div');
	element.className = 'controlB ol-unselectable ol-control';
	element.appendChild(button);
	
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
};
ol.inherits(controlB, ol.control.Control);

var popup=function(xhtml){
	while(window.app.popup.childNodes.length>0){
		try{window.app.popup.removeChild(window.app.popup.childNodes[0]);}
		catch(e){console.log(e);}
	}
	window.app.popup.innerHTML="";
			
	var info_div=document.createElement("div");
	info_div.innerHTML=xhtml;
	info_div.style.position="absolute";
	info_div.style.top="0px";
	info_div.style.width="100%";
	
	window.app.popup.appendChild(info_div);
	
	//these need to go into ggmc.css
	window.app.popup.style.left=(window.innerWidth/2-300/2)+"px";
	window.app.popup.style.top=(window.innerHeight/2-200/2)+"px";
	window.app.popup.style.width=(300)+"px";
	window.app.popup.style.height=(200)+"px";
	window.app.popup.style.opacity=0.0;
	document.body.appendChild(window.app.popup);
	$("#popup").animate(
		{opacity:1.0},
		window.app.DELAY,
		function(){
			window.app.last_timeout=window.setTimeout(popdown,1*window.app.DELAY);
		}
	);
}
var popdown=function(e){
	
	console.log("popdown");
	try{window.clearTimeout(window.app.last_timeout);}
	catch(e){}
	
	$("#popup").animate(
		{opacity:0.0},
		window.app.DELAY,
		function(){
			
			try{document.body.removeChild(window.app.popup);}
			catch(e){;}
			
			if(window.app.tour && window.app.current_target_layer!=null){
				var bbox=window.app.current_target_layer.getSource().getFeatures()[0].getGeometry().getExtent();
				var center_of_feature=[(bbox[0]+bbox[2])/2.,(bbox[1]+bbox[3])/2.];
				pan_zoom(center_of_feature);
			}
		}
	);
}
