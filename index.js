import { FluidGrid } from './modules/fluidGrid.js';

const w = 10;
const h = 10;
let view = null;
let ctx = null;
let grid = null;
let buf = null;
let data = null;


const testrender = () => {

}


window.onload = () => {
    init();
}

const initCanvas = () => {
    view = document.getElementById('view');
    view.width = w;
    view.height = h;
    ctx = view.getContext('2d');
    data=ctx.getImageData(0,0,w,h);
    buf=new Uint32Array(data.data.buffer);

}

const init = () => {
    grid = new FluidGrid(w, h);
    initCanvas();
    startRenderLoop();
    
}

const onNewFrame = () => {
    grid.addDensity(Math.floor(Math.random() * w),Math.floor(Math.random() * h),Math.floor(Math.random() * 255));
    renderGrid();
}


function startRenderLoop() {
    window.requestAnimationFrame(renderStep);
}

function renderStep() {
    var start=Date.now();
    onNewFrame();
    t.innerText="Frame time:"+(Date.now()-start)+"ms";
    window.requestAnimationFrame(renderStep);
}

const renderGrid = () => {
    const d = grid.density;
    const da = data.data;
    for (let x = 0; x < w; x++) {
        for(let y = 0; y < w; y ++) {
            const v = d[x + (y * w)];
            const o = 4 * (y * w + x);
            da[o] = v;
            da[o+1] = v;
            da[o+2] = v;
            da[o+3] = 255;
        }
    }
    ctx.putImageData(data, 0, 0);
}


console.log("hello world");