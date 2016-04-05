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
		
		//var selection=get_selected("area_select");
		var selection="guyana";
		
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
		
		window.setTimeout(me.test,2000,false);
	}
	me.test=function(){
		//alert(me.polygon_layers[0].getSource().getFeatures());
		for(var aidx=0;aidx<me.all_targets.length;aidx++){
			var lyr=me.all_targets[aidx];
			var features=lyr.getSource().getFeatures();
			for(var fidx=0;fidx<features.length;fidx++){
				features[fidx].set("type",lyr.get("type"));
				me.all_features.push(features[fidx]);
				//console.log(window.app.all_features.length);
			}
		}
	}
//	
	me.prepare_layers=function(){
		console.log("me.prepare_layers: "+me.current);
		me.all_targets=[];
		me.polygon_layers=[];
		me.all_layers=[];
		me.all_features=[];
		
		for(var pidx=0; pidx<INSTALLED[me.current]["polygon_features"].length;pidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["polygon_features"][pidx]["filename"];
			var polygon_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			
			var polygon_layer= new ol.layer.Vector({
				source: polygon_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["polygon_features"][pidx]["color"],
						width: INSTALLED[me.current]["polygon_features"][pidx]["width"]
					}),
					fill: new ol.style.Fill({
						color: INSTALLED[me.current]["polygon_features"][pidx]["fill"],
					})
				}),
			});
			polygon_layer.set("type","Polygon");
			me.polygon_layers.push(polygon_layer);
			me.all_targets.push(polygon_layer);
			

		}

		me.point_layers=[];
		for(var pidx=0;pidx<INSTALLED[me.current]["point_features"].length;pidx++){
			
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["point_features"][pidx]["filename"];
			var point_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			var point_layer= new ol.layer.Vector({
				source: point_source,
				style:new ol.style.Style({
					image:new ol.style.Circle({
						radius:INSTALLED[me.current]["point_features"][pidx]["radius"],
						stroke: new ol.style.Stroke({
							color: INSTALLED[me.current]["point_features"][pidx]["color"],
							width: INSTALLED[me.current]["point_features"][pidx]["width"]
						}),				
						fill: new ol.style.Fill({
							color: INSTALLED[me.current]["point_features"][pidx]["fill"],
						}),
					})
				}),
			});
			point_layer.set("type","Point");
			me.point_layers.push(point_layer);
			me.all_targets.push(point_layer);
			
		}


		me.line_layers=[];
		for(var lidx=0;lidx<INSTALLED[me.current]["line_features"].length;lidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["line_features"][lidx]["filename"];
			var line_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});
			var line_layer= new ol.layer.Vector({
				source: line_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["line_features"][lidx]["color"],
						width: INSTALLED[me.current]["line_features"][lidx]["width"]
					}),					
				})
			});
			line_layer.set("type","Line");
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
	me.playB = function(opt_options) {
		
		//http://openlayers.org/en/v3.14.0/examples/custom-controls.html
		
		var options = opt_options || {};
		var button = document.createElement('button');
		button.id="playB";
		button.className="playB";
		button.innerHTML = '<img src="./static/ggmc/img/flaticon/play.png" class="icon"/>';
		button.title="Start";
		
		var playCB = function() {
			console.log("playCB");
			//$(".control_panel").toggleClass("show");
			
			if(me.all_targets.length==0){
				console.log("resetting game from playCB");
				me.change_areaCB();
				document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/pause.png" class="icon"/>';
				me.RUNNING=true;
				window.setTimeout(me.start_move,2*me.DELAY);//necessary!
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
			console.log("playCB done");
		};
		
		button.addEventListener('click', playCB, false);
		button.addEventListener('touchstart', playCB, false);
		
		var element = document.createElement('div');
		element.className = 'playB ol-unselectable ol-control';
		element.appendChild(button);
		
		ol.control.Control.call(this, {
			element: element,
			target: options.target
		});
	};
	ol.inherits(me.playB, ol.control.Control);
	
	me.setup_map=function(){
		
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
				new gearB(),new me.playB(),
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
		
		try{window.clearTimeout(me.last_timeout);}
		catch(e){console.log(e);}
		
		if(!feature){
		
			if(me.all_features.length==0){
				me.end_game();
				return;
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
		
		var xhtml="<center><h1>Next: "+target_name+"</h1></center>";
		console.log("me.start_move:"+target_name+" "+me.all_features.length.toString());
		popup(xhtml);
	}
	me.end_game=function(){
		try{document.body.removeChild(me.popup);}
		catch(e){console.log("me.end_game");}
		var xhtml='<center><h1>Congratulations!<br>You Finished!</h1></center>';
		console.log(xhtml);
		popup(xhtml);
		document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/play.png" class="icon"/>';
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
