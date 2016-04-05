var INSTALLED={
	"keys":["guyana","greenland","iceland"],
	"guyana":{
		"path":"./static/ggmc/data/guyana/",
		"bbox":[-61.5,1.1,-56.3,8.7],
		"center":[-58.9,4.9],
		"color":"rgba(255,255,0,1)",
		"fill":"rgba(0,100,40,.1)",
		"width":2,
		"polygon_features":[
			{"filename":"pacs.geojson","color":"rgba(0,255,0,1)","fill":'rgba(0,255,0,0.25)','width':1},
//			{"filename":"gy_rivers.geojson","color":"rgba(0,0,255,1)","fill":'rgba(0,0,255,1)','width':1},
		],
		"point_features":[
			{"filename":"gy_towns.geojson","color":"rgba(255,0,0,1)","fill":'rgba(255,255,255,1)','width':5,'radius':10},
		],
		"line_features":[
//			{"filename":"test_segment.geojson","color":"rgba(155,255,0,1)",'width':5},
		]
	},
	"iceland":{
		"path":"./static/ggmc/data/iceland/",
		"bbox":[-24.542, 63.39,-13.499,66.536],
		"center":[(-24.542+-13.499)/2.,65.],
		"color":"#ff0",
		"fill":"rgba(0,100,0,0.5)",
		"width":2,
		"polygon_features":[],
		"point_features":[],
		"line_features":[]
	},
	"greenland":{
		"path":"./static/ggmc/data/greenland/",
		"bbox":[-73.054, 59.79,-12.155,83.624],
		"center":[(-73.054-12.155)/2.,76.],
		"color":"#ff0",
		"fill":"rgba(100,100,0,0.5)",
		"width":2,
		"polygon_features":[],
		"point_features":[],
		"line_features":[]
	},
}
		
