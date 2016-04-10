var is_base_by_name=function(layer_name){
	var is_base=false;
	for(var kidx=0;kidx<window.app.BASE_LAYERS['keys'].length;kidx++){
		var key=window.app.BASE_LAYERS['keys'][kidx];
		if(key==layer_name){is_base=true;}
	}
	console.log(layer_name+" is_base= "+is_base);
	return is_base;
}
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
var ControlPanel=function(){
		
	var me={};
	
	me.foi=null;//feature of interest
	me.MAP_LAYERS={};
	me.MAP_LAYER_NAMES=[];

	me.layer_checkboxCB=function(e){
		
		console.log("controls.js: layer_checkboxCB "+e.target.id);
		
		var img=e.target;
		var layer_name=e.target.id.split("_")[0];
		layer_name=layer_name.replace("ZZZ"," ");
		if(get_basename(img.src)=="checkbox-0.png"){
			img.src="./static/ggmc/img/checkbox-1.png";
			
			if(is_base_by_name(layer_name)){
				window.map.getLayers().insertAt(0, window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=true;
			}
			else{
				window.map.addLayer(window.app.LAYERS[layer_name]['layer']);
				window.app.LAYERS[layer_name]['toggle']=true;
			}
		}
		else{
			img.src="./static/ggmc/img/checkbox-0.png";
			
			if(is_base_by_name(layer_name)){
				window.map.removeLayer(window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=false;
			}
			else{
				window.map.removeLayer(window.app.LAYERS[layer_name]['layer']);
				window.app.LAYERS[layer_name]['toggle']=false;
			}
			
		}
	}
	me.feature_checkboxCB=function(e){
		
		console.log("feature_checkboxCB: "+get_basename(e.target.id));
		
		var img=e.target;
		var layer_name=e.target.id.split("_")[0];
		var feature_name=e.target.id.split("_")[1];
		console.log(layer_name+"."+feature_name);
		
		var feature_objs=window.app.LAYERS[layer_name]['source'].getFeatures();
		var feature=null;
		for(var fidx=0;fidx<feature_objs.length;fidx++){
			console.log(feature_objs[fidx].get("Name"));
			if(feature_name==(feature_objs[fidx].get("Name") || feature_objs[fidx].get("NAME"))){
				feature=feature_objs[fidx];
				console.log("found feature_obj "+feature.get("Name")+feature.get("NAME"));
				break;
			}
		}
		
		
		if(get_basename(img.src)=="checkbox-0.png"){
			
			img.src="./static/ggmc/img/checkbox-1.png";
			console.log("adding "+feature);
			var fidx=0;
			for(fidx=0;fidx<window.app.LAYERS[layer_name]['features_off'].length;fidx++){
				if(feature_name==( window.app.LAYERS[layer_name]['features_off'][fidx].get("Name") || window.app.LAYERS[layer_name]['features_off'][fidx].get("NAME") )){
					break;
				}
			}
			var feature=window.app.LAYERS[layer_name]['features_off'][fidx];
			console.log('added feature ... still  need to remove from list');
			window.app.LAYERS[layer_name]['source'].addFeature(feature);
			
			//remove from features_off list
			for(var ridx=0;ridx<fidx;ridx++)
				window.app.LAYERS[layer_name]['features_off'].push(window.app.LAYERS[layer_name]['features_off'].shift());
			
			//toggle candidate=true
			window.app.LAYERS[layer_name]['features'][feature_name]['candidate']=true;
			
			var garbage=window.app.LAYERS[layer_name]['features_off'].shift();
			console.log("layer removed: "+window.app.LAYERS[layer_name]['features_off'].length);
		}
		else{
			
			img.src="./static/ggmc/img/checkbox-0.png";
			console.log("removing "+feature);
			window.app.LAYERS[layer_name]['features_off'].push(feature);
			console.log("layer saved");
			window.app.LAYERS[layer_name]['source'].removeFeature(feature);
			
			//toggle candidate=true
			window.app.LAYERS[layer_name]['features'][feature_name]['candidate']=false;

			
		}
	}
	
	me.make_persistent_content=function(){
		
		var opts={'parent_id':'control_panel','id':'Configuration','className':'roll_up_div','roll_up_class':'rollup','roll_up_name':'Configuration','roll_up_icon_src':null,};
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
			
			if(window.app.BASE_ENABLED)window.app.BASE_ENABLED=false;
			else window.app.BASE_ENABLED=true;
			
			//inspect checkbox states and reload if set
			//otherwise loading takes place in checkboxCB
			var keys=window.app.BASE_LAYERS['keys'];
			if(!state){
				for(var kidx=0;kidx<keys.length;kidx++){
					var key=keys[kidx];
					if(window.app.BASE_LAYERS[key]['toggle']==1){
						window.map.getLayers().insertAt(0, window.app.BASE_LAYERS[key]['layer']);
					}
				}
			}
			else{
				for(var kidx=0;kidx<keys.length;kidx++){
					var key=keys[kidx];
					if(window.app.BASE_LAYERS[key]['toggle']==1){
						window.map.removeLayer(window.app.BASE_LAYERS[key]['layer']);
					}
				}
			}
			
		});
	
	}
	me.make_feature_row=function(is_base,layer_name,feature_name){
			var tt_div=document.createElement("div");
//			tt_div.className="tt_div";
			
			var tt=document.createElement("table");
			tt.className="tt";
			var ttr=tt.insertRow(-1);
			//var ttc=ttr.insertCell(-1);
			
			var feature_label=document.createElement("div");
			feature_label.innerHTML=feature_name;
			feature_label.className="feature_label";
			var id=feature_name+parseInt(1E9*Math.random()).toString();
			feature_label.id=id;
			//console.log(id);
			//cat_features_div.appendChild(feature_label);
			var ttc=ttr.insertCell(-1);
			ttc.className="feature_cell";
			ttc.appendChild(feature_label);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn=layer_name+"_"+feature_name+"_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			
			var toggle=false;
			if(is_base)toggle=window.app.BASE_LAYERS[layer_name]['toggle'];
			else toggle=window.app.LAYERS[layer_name]['toggle'];
			console.log(layer_name+"."+feature_name+" "+toggle.toString());
			if(toggle)
				img.src="./static/ggmc/img/checkbox-1.png";
			else
				img.src="./static/ggmc/img/checkbox-0.png";
			
			ttc.appendChild(img);
			if(true)
				img.addEventListener("click",me.layer_checkboxCB,false);
			else
				img.addEventListener("click",me.feature_checkboxCB,false);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn=layer_name+"_hamburger_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			img.src="./static/ggmc/img/flaticon/interface-1.png";
			ttc.appendChild(img);
			img.addEventListener("click",me.popoutCB,false);
			
			tt_div.appendChild(tt);
			return tt_div;
	}
	me.rangeCB=function(e){
		console.log("rangeCB: "+e.target.id);
		
		var split_id=e.target.id.split("_");
		var layer_name=split_id[0].replace("ZZZ"," ");
		var attribute_name=split_id[1];
		
		console.log(layer_name+" "+attribute_name+" "+e.target.value);
		
		range=document.getElementById(e.target.id);
		if(is_base_by_name(layer_name)){
			console.log(window.app.BASE_LAYERS[layer_name]['layer'].getKeys());
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.BASE_LAYERS[layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.BASE_LAYERS['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
		else{
			console.log(window.app.LAYERS[layer_name]['layer'].getKeys());
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.LAYERS[layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.LAYERS['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
	}
	me.popoutCB = function(e) {
		
		console.log(e.target.id);
		var layer_name=e.target.id.split("_")[0].replace(" ","ZZZ");
		console.log(layer_name);
		
		var layer_name=e.target.id.split("_")[0];
		$(".popout_panel").css({"top":(e.clientY-100)+"px"});
		$(".popout_panel").html("");
		$(".popout_panel").html(layer_name);
		
		var t=document.createElement("table");
		t.align="center";
		
		var attribute_names=['Opacity'];//,'Brightness','Saturation','Contrast','Hue'
		for(var aidx=0;aidx<attribute_names.length;aidx++){
			var r=t.insertRow(-1);
			var c=r.insertCell(-1);
			var label=document.createElement("div");
			label.style.color="white";
			label.innerHTML=attribute_names[aidx];
			label.className="popout_label";
			c.appendChild(label);

			var w=document.createElement("input");
			w.type="range";
			w.id=layer_name+"_"+attribute_names[aidx];
			w.setAttribute("min",0);
			w.setAttribute("max",100);
			if(is_base_by_name(layer_name)){
				var val=window.app.BASE_LAYERS[layer_name]['layer'].getOpacity()*100;
				console.log(val);
				var cmd="window.app.BASE_LAYERS[layer_name]['layer'].get"+attribute_names[aidx]+"()*100";
				console.log(cmd);
				val=eval(cmd);
				console.log(val);
				w.setAttribute("value",val);
			}
			else{
				var val=window.app.LAYERS[layer_name]['layer'].getOpacity()*100;
				console.log(val);
				var cmd="window.app.LAYERS[layer_name]['layer'].get"+attribute_names[aidx]+"()*100";
				console.log(cmd);
				val=eval(cmd);
				console.log(val);
				w.setAttribute("value",val);
			}
			w.style.width="100px";
			c=r.insertCell(-1);
			c.appendChild(w);
			w.addEventListener("change",me.rangeCB,false);
		}
		$("#popout_panel").append(t);
		$(".popout_panel").toggleClass("show");
	};
	
	me.layer_block=function(layer_name,opts){
		
		var rollup=new RollUpDiv(opts);
		
		var cat_features_div=document.createElement("div");
		
		var solid_id=opts['roll_up_name'];//handles up to 10 spaces!
		for(var dummy=0;dummy<10;dummy++)
			solid_id=solid_id.replace(" ","ZZZ");//can't be _ b/c splitting on _ already

		cat_features_div.id=solid_id+"_cat_features_div";
		cat_features_div.className="cat_features_div";
		
		var features_table=document.createElement("table");
		features_table.className="features_table";
		
		cat_features_div.appendChild(features_table);
		rollup.rollup.appendChild(cat_features_div);
		
		var feature_names=[];
		
		var is_base=is_base_by_name(layer_name);
		if(true){
			feature_names=[layer_name];
		}
		else{
			feature_names=window.app.LAYERS[layer_name]['feature_names'];
		}
		for(var lidx=0;lidx<feature_names.length;lidx++){
			
			var r=features_table.insertRow(-1);
			r.className="feature_row";
			var c=r.insertCell(-1);
			
			var tt_div=me.make_feature_row(is_base,layer_name,feature_names[lidx]);
			
			c.appendChild(tt_div);
		}
		
	}
	
	
	me.make_layer_blocks=function(){
		
		
		var keys=window.app.LAYERS['keys'];
		
		for(var kidx=0;kidx<keys.length;kidx++){
			var key=keys[kidx];
			var checkboxSRC="./static/ggmc/img/checkbox-0.png";
			if(window.app.LAYERS[key]['toggle'])checkboxSRC="./static/ggmc/img/checkbox-1.png";
			/*
			opts={
				"checkboxCB":me.layer_checkboxCB,
				"checkboxSRC":checkboxSRC,
				'parent_id':'control_panel',
				'id':key,
				'className':'roll_up_div',
				'roll_up_class':'rollup_constrained_height',
				'roll_up_name':key,
				'roll_up_icon_src':"./static/ggmc/img/arrow.png",
			}
			
			me.layer_block(key,opts);
			$("#control_panel").append(make_hr("hr3"));
			*/
			opts={
				'parent_id':'control_panel',
				'id':key,
				'className':'roll_up_div',
				'roll_up_class':'rollup',
				'roll_up_name':key,
				'roll_up_icon_src':"./static/ggmc/img/arrow.png",
			};
			me.layer_block([key],opts);
			$("#control_panel").append(make_hr());
		
		}
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
