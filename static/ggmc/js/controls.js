var make_hr=function(){
	var hr=document.createElement("hr");
	hr.className="hr";
	return hr;
}
var make_vspace10=function(){
	var vspace10=document.createElement("div");
	vspace10.className="vspace10";
	return vspace10;
}
var make_layer_switch=function(idn){
	var _switch=document.createElement("input");
	_switch.type="checkbox";
//	tourB.checked=window.app.tour;
	_switch.id=idn;
	_switch.className="switchB";
	var switch_div=document.createElement("div");
	switch_div.className="switch_div";
	switch_div.appendChild(_switch);
	return switch_div;
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
	
	me.make_head_div=function(){
		//PanelSelect
		var head_div=document.createElement("div");
		head_div.id="head_div";
		head_div.className="head_div";
		head_div.appendChild(make_hr());

		var tourB=document.createElement("input");
		tourB.type="checkbox";
//		tourB.checked=window.app.tour;
		tourB.id="tourB";
		tourB.className="switchB";
		var tour_div=document.createElement("div");
		tour_div.className="switch_div";
		tour_div.appendChild(tourB);

		var baseB=document.createElement("input");
		baseB.type="checkbox";
//		baseB.checked=window.app.tour;
		baseB.id="baseB";
		baseB.className="switchB";
		var base_div=document.createElement("div");
		base_div.className="switch_div";
		base_div.appendChild(baseB);
		
		var switchB=document.createElement("input");
		switchB.type="checkbox";
//		switchB.checked=window.app.tour;
		switchB.id="switchB";
		switchB.className="switchB";
		var switch_div=document.createElement("div");
		switch_div.className="switch_div";
		switch_div.appendChild(switchB);
		
		head_div.appendChild(tour_div);
		head_div.appendChild(new make_vspace10());
		head_div.appendChild(base_div);
		head_div.appendChild(new make_vspace10());
		head_div.appendChild(switch_div);
		$("#control_panel").append(head_div);
		
		$.fn.bootstrapSwitch.defaults.labelWidth="50px";

		$("#tourB").bootstrapSwitch();
		$("#tourB").bootstrapSwitch("state",window.app.tour);
		$("#tourB").bootstrapSwitch("size","mini");
		$("#tourB").bootstrapSwitch("onColor","success");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#tourB").bootstrapSwitch("offColor","danger");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#tourB").bootstrapSwitch("onText","<img class='switch_icon' src='./static/ggmc/img/globe.png'/>");//http://www.bootstrap-switch.org/options.html
		$("#tourB").bootstrapSwitch("offText","<img class='switch_icon' src='./static/ggmc/img/flaticon/search.png'/>");
		$("#tourB").bootstrapSwitch("labelText","<b> Tour </b> ");
		$("#tourB").on('switchChange.bootstrapSwitch', function(event, state) {
			console.log(this); // DOM element
			console.log(event); // jQuery event
			console.log(state); // true | false
			window.app.tour=state;
		});
		
		$("#baseB").bootstrapSwitch();
		$("#baseB").bootstrapSwitch("state",false);
		$("#baseB").bootstrapSwitch("size","mini");
		$("#baseB").bootstrapSwitch("onColor","success");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#baseB").bootstrapSwitch("offColor","danger");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#baseB").bootstrapSwitch("onText","<img class='switch_icon' src='./static/ggmc/img/layers.png'/>");//http://www.bootstrap-switch.org/options.html
		$("#baseB").bootstrapSwitch("offText","<img class='switch_icon' src='./static/ggmc/img/layers.png'/>");
		$("#baseB").bootstrapSwitch("labelText","<b> Base </b> ");
		$("#baseB").on('switchChange.bootstrapSwitch', function(event, state) {
			console.log(this); // DOM element
			console.log(event); // jQuery event
			console.log(state); // true | false
			
		});
		
		$("#switchB").bootstrapSwitch();
		$("#switchB").bootstrapSwitch("state",false);
		$("#switchB").bootstrapSwitch("size","mini");
		$("#switchB").bootstrapSwitch("onColor","success");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#switchB").bootstrapSwitch("offColor","warning");
		$("#switchB").bootstrapSwitch("onText","<img class='switch_icon' src='./static/ggmc/img/flaticon/gear.png'/>");//http://www.bootstrap-switch.org/options.html
		$("#switchB").bootstrapSwitch("offText","<img class='switch_icon' src='./static/ggmc/img/flaticon/gear.png'/>");
		$("#switchB").bootstrapSwitch("labelText","<b>Panel</b>");
		$("#switchB").on('switchChange.bootstrapSwitch', function(event, state) {
			console.log(this); // DOM element
			console.log(event); // jQuery event
			console.log(state); // true | false
			$(".drag_panel").toggleClass("show");
		});
		
		
		head_div.appendChild(make_hr());
	
	}
	me.basename=function(path){
		return path.split('/').reverse()[0];
	}
	me.checkboxCB=function(e){
		console.log("checkboxCB: "+me.basename(e.target.src));
		var img=e.target;
		if(me.basename(img.src)=="checkbox-0.png")
			img.src="./static/ggmc/img/checkbox-1.png";
		else
			img.src="./static/ggmc/img/checkbox-0.png";
			
		var draggable_div=me.make_layer_row("testing");	
		$("#drag_panel").append(draggable_div);
		
	}
	me.make_layer_row=function(layer_name){
			var tt_div=document.createElement("div");
			tt_div.className="tt_div";
			
			var tt=document.createElement("table");
			tt.className="tt";
			var ttr=tt.insertRow(-1);
			var ttc=ttr.insertCell(-1);
			
			var layer_label=document.createElement("div");
			layer_label.innerHTML=layer_name;
			layer_label.className="layer_label";
			var id=parseInt(1E9*Math.random()).toString();
			layer_label.id=id;
			console.log(id);
			//cat_lyrs_div.appendChild(layer_label);
			var ttc=ttr.insertCell(-1);
			ttc.className="lyr_cell";
			ttc.appendChild(layer_label);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn=layer_name+"_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			img.src="./static/ggmc/img/checkbox-0.png";
			ttc.appendChild(img);
			img.addEventListener("click",me.checkboxCB,false);
			

			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn="hamburger_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			img.src="./static/ggmc/img/flaticon/interface-1.png";
			ttc.appendChild(img);
			tt_div.appendChild(tt);
			
			return tt_div;
	}
	me.category_block=function(category,layers,disabled){
		var h=document.createElement("div");
		h.className='layer_category';
		h.id=parseInt(100000*Math.random());
		
		var t=document.createElement("table");
		t.style.width="100%";
		var tr=t.insertRow(-1);
		var td;
		
		td=tr.insertCell(-1);
		td.className="category_cell";
		var label=document.createElement("div");
		label.className="label";
		label.innerHTML=category;
		td.appendChild(label);
		
		td=tr.insertCell(-1);
		td.className="icon_cell";
		var arrow=new Image();
		arrow.id=h.id+"_arrow";
		arrow.className="arrow";
		arrow.src="./static/ggmc/img/arrow.png";
		td.appendChild(arrow);
		
		h.appendChild(t);
		
		$("#config_panel").append(h);
		
		var cat_lyrs_div=document.createElement("div");
		cat_lyrs_div.id=h.id+"_cat_lyrs_div";
		cat_lyrs_div.className="cat_lyrs_div";
		
		var lyrs_table=document.createElement("table");
		lyrs_table.className="lyrs_table";
		
		cat_lyrs_div.appendChild(lyrs_table);
		$("#config_panel").append(cat_lyrs_div);
		
		for(var lidx=0;lidx<layers.length;lidx++){
			
			var r=lyrs_table.insertRow(-1);
			r.className="lyr_row";
			var c=r.insertCell(-1);
			
			//Candidate for Dragable object
			var tt_div=me.make_layer_row(layers[lidx]);
			
			//
			
			c.appendChild(tt_div);
		}
	}
	
	me.make_head_div();
	me.category_block("Base Layers",['Satellite','OpenStreetMap','OpenStreetMap2'],true);
	$("#config_panel").append(make_hr());
	me.category_block("Main Rivers",['Cuyuni','Berbice','Essequibo','Potaro','Rupununi'],false);
	$("#config_panel").append(make_hr());
	me.category_block("Towns",['Georgetown','Bartica','Charity','New Amsterdam','Lethem','Annai','Mahdia'],false);
	
	
	for(var dummy=0;dummy<$(".arrow").length;dummy++){
		$($(".arrow")[dummy]).click(function(e){
			$(e.target).toggleClass("up");
			$("#"+e.target.id.split("_")[0]+"_cat_lyrs_div").animate({height:'toggle'},300,function(){});
		});
	}
	for(var dummy=0;dummy<$(".layer_label").length;dummy++){
		$($(".layer_label")[dummy]).mouseover(function(e){
			$(e.target).toggleClass("hilighted");
		});
		$($(".layer_label")[dummy]).mouseout(function(e){
			$(e.target).toggleClass("hilighted");
		});
	}
	
	return me;
	
}
