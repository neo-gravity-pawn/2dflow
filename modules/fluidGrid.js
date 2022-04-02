export class FluidGrid {
    #w = 0;
    #h = 0;
    #d = [];
    #dPrev = [];
    #v = { x: [], y: [] };
    #vPrev = { x: [], y: [] };
    
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
        this.#d[this.#i(x, y)] += d;
    }

    addVelocity = (x, y, v) => {
        this.#d[this.#i(x, y)].v += v;
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
        }
    }

    #advert = (b, data, prevData, dt) => {
        const dt0 = dt * this.#w; // WHAT IS THIS
        const vx = this.#v.x;
        const vy = this.#v.y;
        for (let x = 1; x < this.#w - 1; x++) {
            for (let y = 1; y < this.#h - 1; y++) {
                let xPrev = x - dt0*vx[this.#i(x, y)];
                let yPrev = y - dt0*vy[this.#i(x, y)];
                xPrev = xPrev < 0.5


            }
        }
    }

    #setBoundaries(b, data) {

    }

    #i = (x, y) => x + (y * this.#w)

    get density() {
        return this.#d;
    }
}