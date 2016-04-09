var make_hr=function(idn){
	var hr=document.createElement("hr");
	hr.className="hr";
	if(idn!=null)hr.id=idn;
	return hr;
}
var make_vspace10=function(){
	var vspace10=document.createElement("div");
	vspace10.className="vspace10";
	return vspace10;
}
var make_hspace10=function(){
	var hspace10=document.createElement("div");
	hspace10.className="hspace10";
	return hspace10;
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
	
	me.foi=null;//feature of interest
	
	me.layer_checkboxCB=function(e){
		console.log("controls.js: layer_checkboxCB");
		var img=e.target;
		if(get_basename(img.src)=="checkbox-0.png")
			img.src="./static/ggmc/img/checkbox-1.png";
		else
			img.src="./static/ggmc/img/checkbox-0.png";
	}
	
	me.make_persistent_content=function(){
		
		var opts={'parent_id':'control_panel','id':'Configuration','className':'roll_up_div','roll_up_class':'rollup','roll_up_name':'Configuration','roll_up_icon_src':"./static/ggmc/img/arrow.png",};
		var rollup=new RollUpDiv(opts);
		
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
//		$("#control_panel").append(area_select);
		area_select.addEventListener("change",window.app.change_areaCB,false);
		
		
		//
		var tourB=document.createElement("input");
		tourB.type="checkbox";
		tourB.id="tourB";
		tourB.className="switchB";
		var tour_div=document.createElement("div");
		tour_div.className="switch_div";
		tour_div.appendChild(tourB);
		
		var baseB=document.createElement("input");
		baseB.type="checkbox";
		baseB.id="baseB";
		baseB.className="switchB";
		var base_div=document.createElement("div");
		base_div.className="switch_div";
		base_div.appendChild(baseB);
		
		var switchT=document.createElement("table");
		switchT.align="center";
		var r=switchT.insertRow(-1);
		var tour_cell=r.insertCell(-1);
		tour_cell.appendChild(tour_div);
		var hspace_cell=r.insertCell(-1);
		hspace_cell.appendChild(make_hspace10());
		var base_cell=r.insertCell(-1);
		base_cell.appendChild(base_div);
		
		var switch_container=document.createElement("div");
		switch_container.className="centered w100";
		switch_container.appendChild(switchT);
		
		rollup.rollup.appendChild(area_select);
		rollup.rollup.appendChild(make_vspace10());
		rollup.rollup.appendChild(switch_container);
		rollup.rollup.appendChild(make_vspace10());
		
		rollup.head.appendChild(make_hr("hr0"));
		$("#control_panel").append(rollup);
		
		var bcr_rollup=rollup.head.getBoundingClientRect();
		$(".base_cover_panel").css({"top":bcr_rollup.height+"px"});
		
		var opts={'parent_id':'control_panel','id':"Satellite",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"Satellite",'roll_up_icon_src':"./static/ggmc/img/arrow.png",};
		me.layer_block(["Satellite"],opts);
		$("#control_panel").append(make_hr());
		
		var opts={'parent_id':'control_panel','id':"OpenStreetMap",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"OpenStreetMap",'roll_up_icon_src':"./static/ggmc/img/arrow.png",};
		me.layer_block(["OpenStreetMap"],opts);
		$("#control_panel").append(make_hr());
		
		var opts={'parent_id':'control_panel','id':"OpenStreetMap2",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"OpenStreetMap2",'roll_up_icon_src':"./static/ggmc/img/arrow.png",};
		me.layer_block(["OpenStreetMap2"],opts);
		$("#control_panel").append(make_hr("hr3"));
		

		
		$.fn.bootstrapSwitch.defaults.labelWidth="50px";

		$("#tourB").bootstrapSwitch();
		$("#tourB").bootstrapSwitch("state",window.app.tour);
		$("#tourB").bootstrapSwitch("size","mini");
		$("#tourB").bootstrapSwitch("onColor","info");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#tourB").bootstrapSwitch("offColor","success");//'primary', 'info', 'success', 'warning', 'danger', 'default'
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
		$("#baseB").bootstrapSwitch("state",true);
		$("#baseB").bootstrapSwitch("size","mini");
		$("#baseB").bootstrapSwitch("offColor","success");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#baseB").bootstrapSwitch("onColor","danger");//'primary', 'info', 'success', 'warning', 'danger', 'default'
		$("#baseB").bootstrapSwitch("onText","<img class='switch_icon' src='./static/ggmc/img/layers.png'/>");//http://www.bootstrap-switch.org/options.html
		$("#baseB").bootstrapSwitch("offText","<img class='switch_icon' src='./static/ggmc/img/layers.png'/>");
		$("#baseB").bootstrapSwitch("labelText","<b> Base </b> ");
		$("#baseB").on('switchChange.bootstrapSwitch', function(event, state) {
			console.log(this); // DOM element
			console.log(event); // jQuery event
			console.log(state); // true | false
			
			var hr0_bcr=document.getElementById("hr0").getBoundingClientRect();
			var hr3_bcr=document.getElementById("hr3").getBoundingClientRect();
			var h=hr3_bcr.top-hr0_bcr.bottom;
			console.log("h="+h);
			$(".base_cover_panel").css({"height":h});
			$(".base_cover_panel").toggleClass("show");
		});
		
	
	}
	me.checkboxCB=function(e){
		console.log("checkboxCB: "+get_basename(e.target.src));
		var img=e.target;
		if(get_basename(img.src)=="checkbox-0.png")
			img.src="./static/ggmc/img/checkbox-1.png";
		else
			img.src="./static/ggmc/img/checkbox-0.png";
/*
		var draggable_div=me.make_layer_row("testing");	
//		$("#drag_panel").append(draggable_div);
		
		if(window.app.all_sources.length==0)return;
		var source=window.app.all_sources[0];
		if(!me.foi){
			var N=source.getFeatures().length;
			var fidx=parseInt(N*Math.random());
			console.log("NumFeatures: "+N);
			me.foi=source.getFeatures()[fidx];
			source.removeFeature(me.foi);
			console.log(source.getFeatures().length+" "+me.foi.get("NAME"));
		}
		else{
			source.addFeature(me.foi);
			me.foi=null;
		}
*/
	}
	me.make_layer_row=function(layer_name){
			var tt_div=document.createElement("div");
//			tt_div.className="tt_div";
			
			var tt=document.createElement("table");
			tt.className="tt";
			var ttr=tt.insertRow(-1);
			//var ttc=ttr.insertCell(-1);
			
			var layer_label=document.createElement("div");
			layer_label.innerHTML=layer_name;
			layer_label.className="layer_label";
			var id=parseInt(1E9*Math.random()).toString();
			layer_label.id=id;
			//console.log(id);
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
			img.addEventListener("click",me.popoutCB,false);
			
			tt_div.appendChild(tt);
			return tt_div;
	}
	
	me.popoutCB = function(e) {
		console.log(e.clientY+"px");
		//document.getElementById("popout_panel").style.top=e.clientY+"px";
		$(".popout_panel").css({"top":(e.clientY-100)+"px"});
		$(".popout_panel").toggleClass("show");
		console.log("popoutCB show off");
	};
	
	me.layer_block=function(layers,opts){
		var rollup=new RollUpDiv(opts);
		
		var cat_lyrs_div=document.createElement("div");
		
		var solid_id=opts['roll_up_name'];//handles up to 10 spaces!
		for(var dummy=0;dummy<10;dummy++)
			solid_id=solid_id.replace(" ","x");//can't be _ b/c splitting on _ already

		cat_lyrs_div.id=solid_id+"_cat_lyrs_div";
		cat_lyrs_div.className="cat_lyrs_div";
		
		var lyrs_table=document.createElement("table");
		lyrs_table.className="lyrs_table";
		
		cat_lyrs_div.appendChild(lyrs_table);
		rollup.rollup.appendChild(cat_lyrs_div);
		
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
	
	
	me.make_layer_blocks=function(){
		
		if(window.app.all_features.length==0)return;
		
		
		var current_layer_name=window.app.all_features[0].get("layer_name");
		var current_features=[];
		
		for(var fidx=0;fidx<window.app.all_features.length;fidx++){
			
			var f=window.app.all_features[fidx];
			var feature_name=null;
			feature_name=f.get("NAME");
			if(!feature_name)feature_name=f.get("Name");
			
			if(f.get("layer_name")!=current_layer_name){
				
				var opts={"checkboxCB":me.layer_checkboxCB,'parent_id':'control_panel','id':current_layer_name,'className':'roll_up_div','roll_up_class':'rollup_constrained_height','roll_up_name':current_layer_name,'roll_up_icon_src':"./static/ggmc/img/arrow.png",};
				me.layer_block(current_features,opts);
				$("#control_panel").append(make_hr());
				
				current_layer_name=f.get("layer_name");
				current_features=[];
			
			}
			current_features.push(feature_name);
			console.log("control.js: "+current_layer_name+" "+feature_name);
		}
		
		if(current_features.length>0)
			var opts={"checkboxCB":me.layer_checkboxCB,'parent_id':'control_panel','id':current_layer_name,'className':'roll_up_div','roll_up_class':'rollup_constrained_height','roll_up_name':current_layer_name,'roll_up_icon_src':"./static/ggmc/img/arrow.png",};
			me.layer_block(current_features,opts);
	}
	me.rebuild=function(){
		var control_panel=document.getElementById("control_panel");
		var children=control_panel.childNodes;
		for(var cidx=children.length-1;cidx>9;cidx--){
			console.log("removing: "+children[cidx].id);
			control_panel.removeChild(children[cidx]);
		}
		
		me.make_layer_blocks();
	}
	
	me.make_persistent_content();
	
	return me;
	
}
