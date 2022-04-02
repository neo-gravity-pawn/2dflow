var ctx=cnv.getContext("2d");
var data=ctx.getImageData(0,0,600,600); //createImageData(600,600);
var buf=new Uint32Array(data.data.buffer);

function draw(x1,y1,x2,y2){
  var i=0;
  for(var y=0;y<600;y++)
    for(var x=0;x<600;x++){
      var d1=(Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))/10) & 1;
      var d2=(Math.sqrt((x-x2)*(x-x2)+(y-y2)*(y-y2))/10) & 1;
      buf[i++]=d1==d2?0xFF000000:0xFFFFFFFF;
    }
  ctx.putImageData(data,0,0);
}

function draw2(x1,y1,x2,y2){
    var i=0;
    for(var y=0;y<600;y++)
      for(var x=0;x<600;x++){
        var d1=(Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))/10) & 1;
        var d2=(Math.sqrt((x-x2)*(x-x2)+(y-y2)*(y-y2))/10) & 1;
        var d = data.data;
        var o = 4*(y * 600 + x);
        const c = d1==d2?0:255
        d[o] = c;
        d[o+1] = c;
        d[o+2] = c;
        d[o+3] = 255;
      }
    ctx.putImageData(data,0,0);
  }

var cnt=0;
setInterval(function(){
  cnt++;
  var start=Date.now();
  draw2(300+300*Math.sin(cnt*Math.PI/180),
       300+300*Math.cos(cnt*Math.PI/180),
       500+100*Math.sin(cnt*Math.PI/100),
       500+100*Math.cos(cnt*Math.PI/100));
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
},0);