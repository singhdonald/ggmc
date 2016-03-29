var GGMC = function (div_id){	
	
		var me ={};
		
		me.div_id = div_id;
		me.current = INSTALLED["keys"][0];
		
		var polygon_layers = [];
		
		for(var pidx=0; pidx<INSTALLED[me.current]["polygon_features"].length;pidx++){
		
			var polygon_source=new ol.source.Vector({
				url: INSTALLED[me.current]["path"] + INSTALLED[me.current]["polygon_features"][pidx]["filename"],
				format: new ol.format.GeoJSON()
			});
			
			var polygon_layer= new ol.layer.Vector({
				source: polygon_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["polygon_features"][pidx]["color"],
						width: INSTALLED[me.current]["polygon_features"][pidx]["width"]
						
					})
				}),
			});
			
			polygon_layers.push(polygon_layer);
		}
		
			
		var boundary_source=new ol.source.Vector({
			url: INSTALLED [me.current]["path"] + 'boundary.geojson',
			format: new ol.format.GeoJSON()
		});
		
		var boundary_layer = new ol.layer.Vector({
			source: boundary_source,
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
		
		var all_layers = [];
		
		all_layers.push(boundary_layer);
		
		for(var pidx=0; pidx<polygon_layers.length; pidx++){
			all_layers.push(polygon_layers[pidx]);
		}
		
		me.RotateNorthControl = function(opt_options) {
		
			var options = opt_options || {};
			
			var button = document.createElement('button');
			button.innerHTML = 'N';
			var this_ = this;
			var handleRotateNorth = function() {
				$(".control_panel").toggleClass("show");
			}
			
			$(".control_panel").click(function(e){
				$(".control_panel").toggleClass("show");
			});
			
			button.addEventListener('click', handleRotateNorth, false);
			button.addEventListener('touchstart', handleRotateNorth, false);
			
			var element = document.createElement('div');
			element.className = 'rotate-north ol-unselectable ol-control';
			element.appendChild(button);
			
			ol.control.Control.call(this, {
				element: element,
				target: options.target
			});
		
		};
		ol.inherits(me.RotateNorthControl, ol.control.Control);
		
		map = new ol.Map({
			layers: all_layers,
			target: me.div_id,
			view: new ol.View({
				center:ol.proj.transform(INSTALLED[me.current]["center"], 'EPSG:4326', 'EPSG:3857'),
				zoom: 7
			}),
			interactions:[],
			controls: ol.control.defaults({
				attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
				collapsible: false
				})
			}).extend([
				new me.RotateNorthControl()
			])
		});
		
		return me;
}
