export class FluidGrid {
    #w = 0;
    #h = 0;
    #d = [];
    #dPrev = [];
    #v = { x: [], y: [] };
    #vPrev = { x: [], y: [] };
    #dt = 0.05;
    #diff = 0.001;
    
    constructor(w, h) {
        this.#w = w;
        this.#h = h;
        this.#init();
    }

    #init = () => {
        const nrOfEntry = this.#w * this.#h;
        for (let i = 0; i < nrOfEntry; i++) {
            this.#d.push(0);
            this.#dPrev.push(0);
            this.#v.x.push(0);
            this.#v.y.push(0);
            this.#vPrev.x.push(0);
            this.#vPrev.y.push(0);
        }
    }

    addDensity = (x, y, d) => {
        this.#dPrev[this.#i(x, y)] += d;
    }

    addVelocity = (x, y, v) => {
        this.#vPrev.x[this.#i(x, y)] += v[0];
        this.#vPrev.y[this.#i(x, y)] += v[1];
    }

    initVelocity = () => {
        this.#addDifferentialAmount(this.#v.x, this.#vPrev.x, 1.0);
        this.#addDifferentialAmount(this.#v.y, this.#vPrev.y, 1.0);
        this.#addDifferentialAmount(this.#d, this.#dPrev, 1);
    }

    #diffuse = (b, data, prevData, diff, dt) => {
        const a = dt * diff * this.#w * this.#h; // PLAY WITH THIS
        const d = data;
        const d0 = prevData;
        for (let k = 0; k < 20; k++) {
            for (let x = 1; x < this.#w - 1; x++) {
                for(let y = 1; y < this.#h - 1; y++) {
                    const i = this.#i(x, y);
                    d[i] = (d0[i] + a * (
                        d[this.#i(x-1, y)] + 
                        d[this.#i(x+1, y)] + 
                        d[this.#i(x, y+1)] + 
                        d[this.#i(x, y-1)]
                    )) / ( 1 + (4*a) );
                }
            }
            this.#setBoundaries(b, data);
        }
    }

    #advect = (b, data, prevData, dt) => {
        const dt0 = dt * this.#w; // WHAT IS THIS
        const vx = this.#v.x;
        const vy = this.#v.y;
        const d = data;
        const d0 = prevData;
        for (let x = 1; x < this.#w - 1; x++) {
            for (let y = 1; y < this.#h - 1; y++) {
                let xPrev = x - dt0*vx[this.#i(x, y)];
                let yPrev = y - dt0*vy[this.#i(x, y)];
                xPrev = xPrev < 0.5 ? 0.5 : (xPrev > this.#w - 2 ? this.#w - 1.5 : xPrev);
                yPrev = yPrev < 0.5 ? 0.5 : (yPrev > this.#h - 2 ? this.#h - 1.5 : yPrev);
                const i0=Math.floor(xPrev); const i1 = i0 + 1;
                const j0=Math.floor(yPrev); const j1 = j0 + 1;
                const s1 = xPrev - i0; const s0 = 1 - s1;
                const t1 = yPrev - j0; const t0 = 1 - t1;
                d[this.#i(x, y)] = 
                s0 * (t0 * d0[this.#i(i0, j0)] + t1 * d0[this.#i(i0, j1)]) +
                s1 * (t0 * d0[this.#i(i1, j0)] + t1 * d0[this.#i(i1, j1)])
            }
        }
        this.#setBoundaries(b, data);
    }

    #addDifferentialAmount = (dataA, dataB, dt) => {
        for (let i = 0; i < dataA.length; i++) {
            dataA[i] += dataB[i] * dt;
        }
    }

    densityStep = () => {
        // ORIGINAL CODE HAD AN ADDSOURCE HERE!!!
        [this.#d, this.#dPrev] = [this.#dPrev, this.#d];
        this.#diffuse(null, this.#d, this.#dPrev, this.#diff, this.#dt);
        [this.#d, this.#dPrev] = [this.#dPrev, this.#d];
        this.#advect(null, this.#d, this.#dPrev, this.#dt);
        
        // [this.#d, this.#dPrev] = [this.#dPrev, this.#d];
        // this.#advect(null, this.#d, this.#dPrev, this.#dt);
    }



    #setBoundaries(b, data) {

    }

    #i = (x, y) => x + (y * this.#w)

    get density() {
        return this.#d;
    }
}