import { FluidGrid } from './modules/fluidGrid.js';

const w = 200;
const h = 200;
let view = null;
let ctx = null;
let grid = null;
let buf = null;
let data = null;
let c = 0;
let a = Math.round(Math.random()) * 100;

//interaction
let mPos = [0, 0];
let isMouseDown = false;


const testrender = () => {

}


window.onload = () => {
    init();
}

const initCanvas = () => {
    view = document.getElementById('view');
    view.width = w;
    view.height = h;
    view.off
    ctx = view.getContext('2d');
    data=ctx.getImageData(0,0,w,h);
    buf=new Uint32Array(data.data.buffer);
    const updateMouseStatus = (isDown, e) => {
        isMouseDown = isDown;
        mPos = [e.offsetX / view.offsetWidth * w, e.offsetY / view.offsetHeight * h];
    }
    view.onmousedown = (e) => {updateMouseStatus(true, e)};
    view.onmouseup = (e) => {updateMouseStatus(false, e)};
    view.onmousemove = (e) => {
        updateMouseStatus(e.buttons === 1, e)
    }



}

const init = () => {
    grid = new FluidGrid(w, h);
    grid.addDensity(50,50,100);
    grid.addDensity(40,50,100);
    grid.addDensity(50,40,10);
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            grid.addVelocity(x,y, [0.1,-0.1]);
        }
    }
    grid.initVelocity();
    
    grid.densityStep();
    initCanvas();
    renderGrid();
    startRenderLoop();
    
}

const onNewFrame = () => {
    c += 1;
    if (c > 10) {
        c = 0;
        a = Math.round(Math.random()) * 100;
    }
    if (isMouseDown) {
        grid.addDensity(Math.floor(mPos[0]), Math.floor(mPos[1]), a );
    }
    grid.densityStep();
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
            da[o] = v * 255;
            da[o+1] = v * 255;
            da[o+2] = v * 255;
            da[o+3] = 255;
        }
    }
    ctx.putImageData(data, 0, 0);
}


console.log("hello world");