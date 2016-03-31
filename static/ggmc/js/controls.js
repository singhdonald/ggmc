var layers={
	'keys':['Base Layers','Geographic Data','National Data',],
	'Base Layers':['Satellite','OpenStreetMap','OpenStreetMap2'],
	'Geographic Data':['Main Rivers','Main Roads'],
	'National Data':['Admin Regions','Towns'],
};

var ControlPanel=function(){
		
//	$("#map_div").click(function(){$("#control_panel").toggleClass("show")});

	//takes no div id, just assumes existence of #control_panel
	var me={};
		
	me.mode_toggleCB=function(){
		if(window.app.tour==true){
			window.app.tour=false;
			document.getElementById("mode_toggleB").checked=false;
		}
		else{
			window.app.tour=true;
			document.getElementById("mode_toggleB").checked=true;
		}
	}
	me.change_areaCB=function(){
		
		//get new selected area
		var selection=get_selected("area_select");
		if(selection!=null){
			window.app.current=selection;
			console.log("selection="+selection);
		}
		else{
			console.log("failed to obtain selection");
			return;
		}
		
		//remove all layers from map
		for(var lidx=0;lidx<window.app.all_layers.length;lidx++)
			window.map.removeLayer(window.app.all_layers[lidx]);
		
		//refill layers lists
		window.app.prepare_layers();
		
		//re-add layers to map
		for(var lidx=0;lidx<window.app.all_layers.length;lidx++){
			console.log("adding "+lidx+"/"+window.app.all_layers.length);
			window.map.addLayer(window.app.all_layers[lidx]);
		}
		
		window.map.getView().setCenter(ol.proj.transform(INSTALLED[window.app.current]["center"], 'EPSG:4326', 'EPSG:3857'));
		
		//resize (calls set res)
		window.app.resize();
		
		window.setTimeout(me.test,2000,false);
	}

	me.test=function(){
		//alert(window.app.polygon_layers[0].getSource().getFeatures());
		for(var aidx=0;aidx<window.app.all_targets.length;aidx++){
			var lyr=window.app.all_targets[aidx];
			var features=lyr.getSource().getFeatures();
			for(var fidx=0;fidx<features.length;fidx++){
				window.app.all_features.push(features[fidx]);
				console.log(window.app.all_features.length);
			}
		}
	}
	//
	var area_select=document.createElement("select");
	area_select.id="area_select";
	area_select.className="styled-select blue semi-square";
	for(var sidx=0;sidx<INSTALLED["keys"].length;sidx++){
		var opt=document.createElement("option");
		opt.text=INSTALLED["keys"][sidx];
		opt.selected=false;
		if(sidx==0)opt.selected=true;
		area_select.appendChild(opt);
	}
//	$("#control_panel").append(area_select);
	area_select.addEventListener("change",me.change_areaCB,false);
	
	//mode toggle
	var mode_toggleB=document.createElement("input");
	mode_toggleB.type="radio";
	mode_toggleB.checked=window.app.tour;
	mode_toggleB.id="mode_toggleB";
//	$("#control_panel").append(mode_toggleB);
	mode_toggleB.addEventListener("click",me.mode_toggleCB,false);

		
	var closeB=new Image();
	closeB.src="./static/ggmc/img/close.png";
	closeB.id="closeB";		
	
	var close_div=document.createElement("div");
	close_div.className="close_div";
	close_div.appendChild(closeB);
//	$("#control_panel").append(close_div);


		var d=document.createElement("hr");
		$("#control_panel").append(d);
		
		var category=layers.keys[kidx];
		
		var h=document.createElement("div");
		h.className='layer_category';
		h.id=parseInt(100000*Math.random());
		
		var t=document.createElement("table");
		t.style.width="100%";
		var tr=t.insertRow(-1);
		var td;
		
		td=tr.insertCell(-1);
		td.className="arrow_cell";
		td.appendChild(mode_toggleB);
		
		td=tr.insertCell(-1);
		td.align="center";
		var asd=document.createElement("div");
		asd.className="asd";
		asd.appendChild(area_select);
		td.appendChild(asd);
		
		td=tr.insertCell(-1);
		td.className="arrow_cell";
		td.appendChild(close_div);
		
		h.appendChild(t);
		
		$("#control_panel").append(h);

	
	$("#closeB").click(function(){
		$(".control_panel").toggleClass("show");
	});

	$(".close_div").mouseover(function(){
		$(".close_div").toggleClass("hilighted");
	});
	$(".close_div").mouseout(function(){
		$(".close_div").toggleClass("hilighted");
	});
		
	for(var kidx=0;kidx<layers.keys.length;kidx++){
		
		var d=document.createElement("hr");
		$("#control_panel").append(d);
		
		var category=layers.keys[kidx];
		
		var h=document.createElement("div");
		h.className='layer_category';
		h.id=parseInt(100000*Math.random());
		
		var t=document.createElement("table");
		t.style.width="100%";
		var tr=t.insertRow(-1);
		var td;
		
		td=tr.insertCell(-1);
		td.className="arrow_cell";
		
		td=tr.insertCell(-1);
		td.className="category_cell";
		var label=document.createElement("div");
		label.className="label";
		label.innerHTML=category;
		td.appendChild(label);
		
		td=tr.insertCell(-1);
		td.className="arrow_cell";
		var arrow=new Image();
		arrow.id=h.id+"_arrow";
		arrow.className="arrow";
		arrow.src="./static/ggmc/img/arrow.png";
		td.appendChild(arrow);
		
		h.appendChild(t);
		
		$("#control_panel").append(h);
		
		var cat_lyrs_div=document.createElement("div");
		cat_lyrs_div.id=h.id+"_cat_lyrs_div";
		cat_lyrs_div.className="cat_lyrs_div";
		
		for(var lidx=0;lidx<layers[category].length;lidx++){
			var d=document.createElement("div");
			d.innerHTML=layers[category][lidx];
			d.className="layer_label";
			cat_lyrs_div.appendChild(d);
		}
		$("#control_panel").append(cat_lyrs_div);
		
	}
	
	var d=document.createElement("hr");
	$("#control_panel").append(d);
	
	for(var dummy=0;dummy<$(".arrow").length;dummy++){
		$($(".arrow")[dummy]).click(function(e){
			$(e.target).toggleClass("up");
			$("#"+e.target.id.split("_")[0]+"_cat_lyrs_div").animate({height:'toggle'},300,function(){});
		});
	}
	
	return me;

}
var controlB=function(opt_options) {
	
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
