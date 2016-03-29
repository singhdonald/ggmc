var compute_resolution=function(bbox,W,H){
	
	var xmax=bbox[2];
	var xmin=bbox[0];
	var ymin=bbox[1];
	var ymax=bbox[3];

	var p2=ol.proj.transform([xmax,ymax],"EPSG:4326","EPSG:3857");;
	var p1=ol.proj.transform([xmin,ymin],"EPSG:4326","EPSG:3857");;
	var dx=p2[0]-p1[0];
	var dy=p2[1]-p1[1];
	
	
	var AR_win=W/H;
	var AR_shp=dx/dy;
	
	var res;
	if(AR_win>1){
		if(AR_shp<1){
			res=dy/H;
		}
		else if(AR_shp>AR_win){
			res=dx/W;
		}
		else{
			res=dy/H;
		}
	}
	else{//AR_win<1
		if(AR_shp>1){
			res=dx/W;
		}
		else if(AR_shp<AR_win){
			res=dy/H;
		}
		else{
			res=dx/W;
		}
	}
	return res;
}
