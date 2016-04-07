var GGMC=function(div_id,control_panel_id){	
	
	var me={};
	me.popup=document.createElement("div");
	me.popup.id="popup";
	me.popup.className="popup";
	
	me.div_id = div_id;
	me.control_panel_id=control_panel_id;
	me.tour=true;
	me.last_timeout=null;
	
	me.current = INSTALLED["keys"][0];
	
	var BASE_LAYERS={};
	BASE_LAYERS['Satellite']=new ol.layer.Tile({minResolution:500,preload:14,opacity:0.5,title:'Satellite',source:new ol.source.MapQuest({layer:'sat'})});
	BASE_LAYERS['OpenStreetMap']=new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap',source:new ol.source.MapQuest({layer:'osm'})});
	BASE_LAYERS['OpenStreetMap2']=new ol.layer.Tile({title:'OpenStreetMap2',source:new ol.source.OSM()});
	
	me.polygon_layers=null;
	me.point_layers=null;
	me.line_layers=null;
	me.boundary_source=null;
	me.boundary_layer=null;
	me.all_layers=[];
	me.all_targets=[];
	me.all_features=[];
	me.all_sources=[];
	me.current_target_layer=null;
	
	me.debug=true;
	me.featureOverlay=null;
	me.HILIGHTS=[];
	me.DELAY=500.;
	me.RUNNING=false;

	me.resize=function(){
		var W=window.innerWidth;
		var H=window.innerHeight;
		var res=compute_resolution(INSTALLED[me.current]['bbox'],false,W,H);
		window.map.getView().setResolution(res);
	}
	me.change_areaCB=function(){
		
		//Get new selected area
		
		var selection=get_selected("area_select");
		//var selection="guyana";
		
		if(selection!=null){
			me.current=selection;
			console.log("selection="+selection);
		}
		else{
			console.log("failed to obtain selection");
			return;
		}
		
		//remove all layers from map
		for(var lidx=0;lidx<me.all_layers.length;lidx++)
			window.map.removeLayer(me.all_layers[lidx]);
		
		//refill layers lists
		me.prepare_layers();
		
		//re-add layers to map
		for(var lidx=0;lidx<me.all_layers.length;lidx++){
			//console.log("adding "+lidx+"/"+me.all_layers.length);
			window.map.addLayer(me.all_layers[lidx]);
		}
		
		window.map.getView().setCenter(ol.proj.transform(INSTALLED[me.current]["center"], 'EPSG:4326', 'EPSG:3857'));
		
		//resize (calls set res)
		me.resize();
		
		window.setTimeout(me.fill_all_features,2000,false);
	}
	me.fill_all_features=function(){
		//alert(me.polygon_layers[0].getSource().getFeatures());
		for(var aidx=0;aidx<me.all_targets.length;aidx++){
			var lyr=me.all_targets[aidx];
			var features=lyr.getSource().getFeatures();
			for(var fidx=0;fidx<features.length;fidx++){
				features[fidx].set("type",lyr.get("type"));
                features[fidx].set("layer_name",lyr.get("layer_name"));
				//console.log(window.app.all_features.length);
				var feature_name=null;
				feature_name=features[fidx].get("Name");
				if(!feature_name)feature_name=features[fidx].get("NAME");
				console.log(features[fidx].get("layer_name")+" "+feature_name);
				me.all_features.push(features[fidx]);
			}
		}
		console.log("all_features.length="+me.all_features.length.toString());
		
		
		window.control_panel.make_layer_blocks();
	}
//	
	me.prepare_layers=function(){
		
		console.log("me.prepare_layers: "+me.current);
		me.all_sources=[];
		me.all_targets=[];
		me.polygon_layers=[];
		me.all_layers=[];
		me.all_features=[];
		
		for(var pidx=0; pidx<INSTALLED[me.current]["polygon_sources"].length;pidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["polygon_sources"][pidx]["filename"];
			var polygon_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			
			var polygon_layer= new ol.layer.Vector({
				source: polygon_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["polygon_sources"][pidx]["color"],
						width: INSTALLED[me.current]["polygon_sources"][pidx]["width"]
					}),
					fill: new ol.style.Fill({
						color: INSTALLED[me.current]["polygon_sources"][pidx]["fill"],
					})
				}),
			});
			polygon_layer.set("type","Polygon");
            
            var layer_name=INSTALLED[me.current]["polygon_sources"][pidx]["layer_name"];
            polygon_layer.set("layer_name",layer_name);
            
			me.all_sources.push(polygon_source);
			me.polygon_layers.push(polygon_layer);
			me.all_targets.push(polygon_layer);
		
		}

		me.point_layers=[];
		for(var pidx=0;pidx<INSTALLED[me.current]["point_sources"].length;pidx++){
			
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["point_sources"][pidx]["filename"];
			var point_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			
			var point_layer= new ol.layer.Vector({
				source: point_source,
				style:new ol.style.Style({
					image:new ol.style.Circle({
						radius:INSTALLED[me.current]["point_sources"][pidx]["radius"],
						stroke: new ol.style.Stroke({
							color: INSTALLED[me.current]["point_sources"][pidx]["color"],
							width: INSTALLED[me.current]["point_sources"][pidx]["width"]
						}),				
						fill: new ol.style.Fill({
							color: INSTALLED[me.current]["point_sources"][pidx]["fill"],
						}),
					})
				}),
			});
			point_layer.set("type","Point");
            
            layer_name=INSTALLED[me.current]["point_sources"][pidx]["layer_name"];
			point_layer.set("layer_name",layer_name);
            
			me.all_sources.push(point_source);
			me.point_layers.push(point_layer);
			me.all_targets.push(point_layer);
			
		}


		me.line_layers=[];
		for(var lidx=0;lidx<INSTALLED[me.current]["line_sources"].length;lidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["line_sources"][lidx]["filename"];
			var line_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			
			var line_layer= new ol.layer.Vector({
				source: line_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["line_sources"][lidx]["color"],
						width: INSTALLED[me.current]["line_sources"][lidx]["width"]
					}),					
				})
			});
			line_layer.set("type","Line");
            
            layer_name=INSTALLED[me.current]["line_sources"][pidx]["layer_name"];
			line_layer.set("layer_name",layer_name);
            
			me.all_sources.push(line_source);
			me.line_layers.push(line_layer);
			me.all_targets.push(line_layer);
		}
		
		me.boundary_source=new ol.source.Vector({
			url: INSTALLED [me.current]["path"] + 'boundary.geojson',
			format: new ol.format.GeoJSON()
		});	
		me.boundary_layer = new ol.layer.Vector({
			source: me.boundary_source,
			style:new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: INSTALLED[me.current]["color"],
					width: INSTALLED[me.current]["width"]
				}),
				fill: new ol.style.Fill({
					color: INSTALLED[me.current]["fill"],
				}),
			}),
		});
		
		
		me.all_layers.push(BASE_LAYERS['OpenStreetMap']);
		me.all_layers.push(BASE_LAYERS['Satellite']);
		me.all_layers.push(me.boundary_layer);
		for(var pidx=0; pidx<me.polygon_layers.length; pidx++){
			me.all_layers.push(me.polygon_layers[pidx]);
		}
		for(var lidx=0; lidx<me.line_layers.length; lidx++){
			me.all_layers.push(me.line_layers[lidx]);
		}
		for(var pidx=0; pidx<me.point_layers.length; pidx++){
			me.all_layers.push(me.point_layers[pidx]);
		}

	}//END:me.prepare_layers
	
	
	//MAP
	me.playCB = function() {
			console.log("mapB.CB");
			//$(".control_panel").toggleClass("show");
			
			if(me.all_features.length==0){
				console.log("resetting game from CB");
				me.change_areaCB();
				document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/pause.png" class="icon"/>';
				me.RUNNING=true;
				window.setTimeout(me.start_move,4*me.DELAY);//necessary!
			}
			else if(me.RUNNING==true){
				me.RUNNING=false;
				document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/play.png" class="icon"/>';
			}
			else{
				me.RUNNING=true;
				me.start_move(null);
				document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/pause.png" class="icon"/>';
			}
			console.log("mapB.CB done");
		};

	me.controlsCB = function() {
		$(".control_panel").toggleClass("show");
		console.log("controlCB show off");
	};
	
	me.setup_map=function(){
		
		var play_opts={"CB":me.playCB,"title":"Start","innerHTML":'<img src="./static/ggmc/img/flaticon/play.png" class="icon"/>','id':'playB','className':'playB map_button'};
		var gear_opts={"CB":me.controlsCB,"title":"Configuration","innerHTML":'<img src="./static/ggmc/img/flaticon/gear.png" class="icon"/>','id':'gearB','className':'gearB map_button'};
		var playB=new MapButton(play_opts);
		var gearB=new MapButton(gear_opts);
		
		window.map = new ol.Map({
			layers: me.all_layers,
			target: me.div_id,
			view: new ol.View({
				center:ol.proj.transform(INSTALLED[me.current]["center"], 'EPSG:4326', 'EPSG:3857'),
				zoom: 7
			}),
//			interactions:[],
			controls: ol.control.defaults({
				attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
					collapsible: false
				})
			}).extend([
				gearB,playB,
			])
		});
		
		window.map.on('click',function(evt){
			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");
				if(String.toLowerCase(target_name)==me.current){;}
				console.log(target_name);
				me.check_feature(evt.pixel);
			});
		});
		
		window.map.on('pointermove',function(evt){
			if (evt.dragging) {
				return;
			}
			
			for(var hidx=0;hidx<me.HILIGHTS.length;hidx++){
				me.featureOverlay.removeFeature(me.HILIGHTS[hidx]);
			}
			
			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");
				
				if(String.toLowerCase(target_name)==me.current){
					//this skips printing boundary to console.log
				}
				else if(target_name==me.current){
					//this skips printing boundary to console.log
				}
				else if(target_feature){
					me.featureOverlay.addFeature(target_feature);
					me.HILIGHTS.push(target_feature);
					//console.log(target_name);
				}
			});
		});
		
		me.featureOverlay = new ol.FeatureOverlay({
		  map: window.map,
		  style: new ol.style.Style({
		  	stroke: new ol.style.Stroke({
		    	color: 'orange',
		    	width: 2
		    }),
		  }),
		});
		
	}//END:me.setup_map
	
	  	
	//GAME ORCHESTRATION:
	me.start_move=function(feature){
		
		if(me.RUNNING==false)return;
		
		console.log("all_features.length="+me.all_features.length.toString());

		try{window.clearTimeout(me.last_timeout);}
		catch(e){console.log(e);}
		
		if(!feature){
		
			if(me.all_features.length==0){
				console.log("returning me.end_game()");
				return me.end_game();
			}
			
			console.log("me.start_move no feature passed so selecting");
			
			var ridx=parseInt(Math.random()*me.all_features.length);
			console.log("cycling ridx="+ridx.toString()+"/"+me.all_features.length);
			
			for(var dummy=0;dummy<ridx;dummy++){
				//console.log(dummy+"/"+ridx);
				me.all_features.push(me.all_features.shift());
			}
			console.log("shifting me.current_feature");
			me.current_feature=me.all_features.shift();
			
		}
		else{
			console.log("me.start_move with feature passed");
		}
		
		var target_name=null;
		target_name=me.current_feature.get("NAME");
		if(!target_name)target_name=me.current_feature.get("Name");
		
		var target_layer_name=me.current_feature.get("layer_name");
		
		var xhtml="<center><h3>Next:</h3><h1>"+target_name+"</h1><h3>"+target_layer_name+"</h3></center>";
		console.log("me.start_move:"+target_name+" "+target_layer_name+" "+me.all_features.length.toString());
		popup(xhtml);
	}
	me.end_game=function(){
		try{document.body.removeChild(me.popup);}
		catch(e){console.log("me.end_game");}
		var xhtml='<center><h1>Congratulations!<br>You Finished!</h1></center>';
		console.log(xhtml);
		popup(xhtml);
		document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/play.png" class="icon"/>';
	}
	me.check_feature = function(pixel) {
		
		//ISSUE: GTownParks and GTown cannot coexist b/c lambda feature=function(....) only returns first found
		
		if(!me.current_feature)return;
		
		console.log("me.check_feature clearing last_timeout");
		window.clearTimeout(me.last_timeout);
		
		var feature;
		var features=[];
		var found=false;
		
		if(!pixel && me.tour){
			features.push(me.current_feature);
		}
		else{
			
			dummy=window.map.forEachFeatureAtPixel(pixel,function(feature,layer){
				var target_name=null;
				target_name=feature.get("NAME");
				if(!target_name)target_name=feature.get("Name");
				console.log("returning: "+target_name);
				features.push(feature);
			});
		}
		
		if(features.length>0 && !found){
			
			for(var fidx=0;fidx<features.length;fidx++){
			
				feature=features[fidx];
				var target_name=null;
				target_name=me.current_feature.get("NAME");
				if(!target_name)target_name=me.current_feature.get("Name");
				console.log(fidx.toString()+" "+target_name);
			
				if(feature==me.current_feature){
					
					console.log("***** Correct! *****");
					
					if(feature.get("type")=="Point"){
						feature.setStyle(point_correct_style);
					}
					else{
						feature.setStyle(correct_style);
					}
					
					found=true;
					delete(me.current_feature);
					me.current_feature=null;
					if(me.tour){
						console.log("check_feature setting timeout for pan_zoom_home");
						me.last_timeout=window.setTimeout(pan_zoom_home,3*me.DELAY);
					}
					else{
						window.setTimeout(me.start_move,1*me.DELAY);
					}
					return;
				}
			
			}
			
			console.log("starting move passing feature: "+target_name);
			me.start_move(feature);
		}
		else{
			console.log("game over");
		}
	}
	return me;
}
