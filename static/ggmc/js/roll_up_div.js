var RollUpDiv=function(opts){
	var me={};
	
	me.head=document.createElement("div");
	
	var solid_id=opts['id'];//handles up to 10 spaces!
	for(var dummy=0;dummy<10;dummy++)
		solid_id=solid_id.replace(" ","x");//can't be _ b/c splitting on _ already
	me.head.id=solid_id;
	
	me.head.className='roll_up_div';
	
	var t=document.createElement("table");
	t.style.width="100%";
	var tr=t.insertRow(-1);
	var td;
	td=tr.insertCell(-1);
	td.className="roll_up_icon_cell";
	
	td=tr.insertCell(-1);
	td.align="center";
	me.label=document.createElement("div");
	me.label.className="roll_up_label";
	me.label.innerHTML=opts['roll_up_name'];
	td.appendChild(me.label);
	
	td=tr.insertCell(-1);
	td.className="roll_up_icon_cell";
	var roll_up_icon=new Image();
	roll_up_icon.id=me.head.id+"_icon";
	roll_up_icon.className="roll_up_icon";
	roll_up_icon.src=opts["roll_up_icon_src"];
	td.appendChild(roll_up_icon);
	
	me.head.appendChild(t);
	$("#"+opts['parent_id']).append(me.head);
	
	me.rollup=document.createElement("div");
	me.rollup.id=me.head.id+"_rollup";
	//me.rollup.className=opts['roll_up_class'];
	//$("#"+opts['parent_id']).append(me.rollup);
	me.head.appendChild(me.rollup);
	
	$("#"+roll_up_icon.id).click(function(e){
		$(e.target).toggleClass("up");
		$("#"+e.target.id.split("_")[0]+"_rollup").animate({height:'toggle'},300,function(){});
	});
	
	me.set_name=function(val){
		me.label.innerHTML=val;
	}
	
	return me;
}


