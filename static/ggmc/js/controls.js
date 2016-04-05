var make_hr=function(){
	var hr=document.createElement("hr");
	hr.className="hr";
	return hr;
}
var switchCB=function(e,s){
	console.log("lkdflkjs");
}
var ControlPanel=function(){
		
	var me={};
	me.panels=[
		document.getElementById("config_panel"),
		document.getElementById("drag_panel")
	];
	me.resize=function(){
		
		for(var pidx=0;pidx<me.panels.length;pidx++){
			var p=me.panels[pidx];
			var head_bcr=document.getElementById("head_div").getBoundingClientRect();
			p.style.height=(window.innerHeight-head_bcr.height)+"px";
			p.style.top=head_bcr.height+"px";
		}
	}
	//Create2Panels
	var head_div=document.createElement("div");
	head_div.id="head_div";
	head_div.className="head_div";
	head_div.appendChild(make_hr());


	var switchB=document.createElement("input");
	switchB.type="checkbox";
	switchB.checked=window.app.tour;
	switchB.id="switchB";
	switchB.className="switchB";
	var switch_div=document.createElement("div");
	switch_div.className="switch_div";
	switch_div.appendChild(switchB);
	
	head_div.appendChild(switch_div);
	$("#control_panel").append(head_div);
	
	
	$.fn.bootstrapSwitch.defaults.size = 'mini';
	$.fn.bootstrapSwitch.defaults.offColor="success";//'primary', 'info', 'success', 'warning', 'danger', 'default'
	$.fn.bootstrapSwitch.defaults.onText="<img class='switch_icon' src='./static/ggmc/img/flaticon/gear.png'/>";
	$.fn.bootstrapSwitch.defaults.offText="<img class='switch_icon' src='./static/ggmc/img/layers.png'/>";//http://www.bootstrap-switch.org/options.html
	$.fn.bootstrapSwitch.defaults.labelText="<b>Panel</b>";
	$(".switchB").bootstrapSwitch();
	
	$(".switchB").on('switchChange.bootstrapSwitch', function(event, state) {
		console.log(this); // DOM element
		console.log(event); // jQuery event
		console.log(state); // true | false
		$(".drag_panel").toggleClass("show");
	});
	
	
	head_div.appendChild(make_hr());
	
	
	//PanelSelect
	
	
	//AreaSelect, TourSwitch, BaseLayersSwitch (enables entire widget+children), DelaySlider, 
	
	//BaseLayers, OtherCategories
	
	//DragableActiveLayers
	
	return me;
	
}
