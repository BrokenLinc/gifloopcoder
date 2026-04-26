/* eslint-disable */
/*
 * NeuQuant Neural-Net Quantization Algorithm
 * Original by Anthony Dekker (1994); JS port via jsgif (Kevin Kwok).
 */

let netsize = 256;
const prime1 = 499;
const prime2 = 491;
const prime3 = 487;
const prime4 = 503;
const minpicturebytes = 3 * prime4;
let maxnetpos = netsize - 1;
const netbiasshift = 4;
const ncycles = 100;
const intbiasshift = 16;
const intbias = 1 << intbiasshift;
const gammashift = 10;
const betashift = 10;
const beta = intbias >> betashift;
const betagamma = intbias << (gammashift - betashift);
let initrad = netsize >> 3;
const radiusbiasshift = 6;
const radiusbias = 1 << radiusbiasshift;
let initradius = initrad * radiusbias;
const radiusdec = 30;
const alphabiasshift = 10;
const initalpha = 1 << alphabiasshift;
let alphadec: number;
const radbiasshift = 8;
const radbias = 1 << radbiasshift;
const alpharadbshift = alphabiasshift + radbiasshift;
const alpharadbias = 1 << alpharadbshift;

export class NeuQuant {
  private thepicture: any;
  private lengthcount: number;
  private samplefac: number;
  private network: number[][];
  private netindex: number[] = [];
  private bias: number[] = [];
  private freq: number[] = [];
  private radpower: number[] = [];

  constructor(thepic: any, len: number, sample: number) {
    this.thepicture = thepic;
    this.lengthcount = len;
    this.samplefac = sample;
    this.network = new Array(netsize);
    for (let i = 0; i < netsize; i++) {
      this.network[i] = new Array(4);
      const p = this.network[i];
      p[0] = p[1] = p[2] = (i << (netbiasshift + 8)) / netsize;
      this.freq[i] = intbias / netsize;
      this.bias[i] = 0;
    }
  }

  setMaxColors(maxColors: number) {
    netsize = maxColors;
    maxnetpos = netsize - 1;
    initrad = netsize >> 3;
    initradius = initrad * radiusbias;
  }

  process() {
    this.learn();
    this.unbiasnet();
    this.inxbuild();
    return this.colorMap();
  }

  private colorMap() {
    const map: number[] = [];
    const index = new Array(netsize);
    for (let i = 0; i < netsize; i++) index[this.network[i][3]] = i;
    let k = 0;
    for (let l = 0; l < netsize; l++) {
      const j = index[l];
      map[k++] = this.network[j][0];
      map[k++] = this.network[j][1];
      map[k++] = this.network[j][2];
    }
    return map;
  }

  private inxbuild() {
    let previouscol = 0;
    let startpos = 0;
    for (let i = 0; i < netsize; i++) {
      let p = this.network[i];
      let smallpos = i;
      let smallval = p[1];
      for (let j = i + 1; j < netsize; j++) {
        const q = this.network[j];
        if (q[1] < smallval) {
          smallpos = j;
          smallval = q[1];
        }
      }
      const q = this.network[smallpos];
      if (i != smallpos) {
        let j = q[0];
        q[0] = p[0];
        p[0] = j;
        j = q[1];
        q[1] = p[1];
        p[1] = j;
        j = q[2];
        q[2] = p[2];
        p[2] = j;
        j = q[3];
        q[3] = p[3];
        p[3] = j;
      }
      if (smallval != previouscol) {
        this.netindex[previouscol] = (startpos + i) >> 1;
        for (let j = previouscol + 1; j < smallval; j++) this.netindex[j] = i;
        previouscol = smallval;
        startpos = i;
      }
    }
    this.netindex[previouscol] = (startpos + maxnetpos) >> 1;
    for (let j = previouscol + 1; j < 256; j++) this.netindex[j] = maxnetpos;
  }

  private learn() {
    if (this.lengthcount < minpicturebytes) this.samplefac = 1;
    alphadec = 30 + (this.samplefac - 1) / 3;
    const p = this.thepicture;
    let pix = 0;
    const lim = this.lengthcount;
    const samplepixels = this.lengthcount / (3 * this.samplefac);
    let delta = (samplepixels / ncycles) | 0;
    let alpha = initalpha;
    let radius = initradius;
    let rad = radius >> radiusbiasshift;
    if (rad <= 1) rad = 0;
    for (let i = 0; i < rad; i++)
      this.radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));

    let step: number;
    if (this.lengthcount < minpicturebytes) step = 3;
    else if (this.lengthcount % prime1 !== 0) step = 3 * prime1;
    else if (this.lengthcount % prime2 !== 0) step = 3 * prime2;
    else if (this.lengthcount % prime3 !== 0) step = 3 * prime3;
    else step = 3 * prime4;

    let i = 0;
    while (i < samplepixels) {
      const b = (p[pix + 0] & 0xff) << netbiasshift;
      const g = (p[pix + 1] & 0xff) << netbiasshift;
      const r = (p[pix + 2] & 0xff) << netbiasshift;
      const j = this.contest(b, g, r);
      this.altersingle(alpha, j, b, g, r);
      if (rad !== 0) this.alterneigh(rad, j, b, g, r);
      pix += step;
      if (pix >= lim) pix -= this.lengthcount;
      i++;
      if (delta === 0) delta = 1;
      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;
        if (rad <= 1) rad = 0;
        for (let j = 0; j < rad; j++)
          this.radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
      }
    }
  }

  map(b: number, g: number, r: number): number {
    let bestd = 1000;
    let best = -1;
    let i = this.netindex[g];
    let j = i - 1;
    while (i < netsize || j >= 0) {
      if (i < netsize) {
        const p = this.network[i];
        let dist = p[1] - g;
        if (dist >= bestd) i = netsize;
        else {
          i++;
          if (dist < 0) dist = -dist;
          let a = p[0] - b;
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
      if (j >= 0) {
        const p = this.network[j];
        let dist = g - p[1];
        if (dist >= bestd) j = -1;
        else {
          j--;
          if (dist < 0) dist = -dist;
          let a = p[0] - b;
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
    }
    return best;
  }

  private unbiasnet() {
    for (let i = 0; i < netsize; i++) {
      this.network[i][0] >>= netbiasshift;
      this.network[i][1] >>= netbiasshift;
      this.network[i][2] >>= netbiasshift;
      this.network[i][3] = i;
    }
  }

  private alterneigh(rad: number, i: number, b: number, g: number, r: number) {
    let lo = i - rad;
    if (lo < -1) lo = -1;
    let hi = i + rad;
    if (hi > netsize) hi = netsize;
    let j = i + 1;
    let k = i - 1;
    let m = 1;
    while (j < hi || k > lo) {
      const a = this.radpower[m++];
      if (j < hi) {
        const p = this.network[j++];
        try {
          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;
        } catch (_e) {}
      }
      if (k > lo) {
        const p = this.network[k--];
        try {
          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;
        } catch (_e) {}
      }
    }
  }

  private altersingle(alpha: number, i: number, b: number, g: number, r: number) {
    const n = this.network[i];
    n[0] -= (alpha * (n[0] - b)) / initalpha;
    n[1] -= (alpha * (n[1] - g)) / initalpha;
    n[2] -= (alpha * (n[2] - r)) / initalpha;
  }

  private contest(b: number, g: number, r: number): number {
    let bestd = ~(1 << 31);
    let bestbiasd = bestd;
    let bestpos = -1;
    let bestbiaspos = bestpos;
    for (let i = 0; i < netsize; i++) {
      const n = this.network[i];
      let dist = n[0] - b;
      if (dist < 0) dist = -dist;
      let a = n[1] - g;
      if (a < 0) a = -a;
      dist += a;
      a = n[2] - r;
      if (a < 0) a = -a;
      dist += a;
      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }
      const biasdist = dist - (this.bias[i] >> (intbiasshift - netbiasshift));
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }
      const betafreq = this.freq[i] >> betashift;
      this.freq[i] -= betafreq;
      this.bias[i] += betafreq << gammashift;
    }
    this.freq[bestpos] += beta;
    this.bias[bestpos] -= betagamma;
    return bestbiaspos;
  }
}
