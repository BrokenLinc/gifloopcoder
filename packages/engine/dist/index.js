function lt(e) {
  let t = 0, i = 2, r = 30, s = !1, n = !1, a = !1;
  const l = typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(globalThis) : (m) => setTimeout(() => m(performance.now()), 16);
  function o() {
    s && !n ? (e.onRender(t), u(), setTimeout(h, 1e3 / r)) : (s = !1, a = !1, n = !1, e.onComplete());
  }
  function h() {
    l(o);
  }
  function u() {
    const g = 1 / (i * r);
    t += g, Math.round(t * 1e4) / 1e4 >= 1 && (a ? t -= 1 : (t = 0, f()));
  }
  function d() {
    s || (e.onStart(), t = 0, n = !1, a = !0, s = !0, o());
  }
  function f() {
    s && (n = !0, t = 0);
  }
  function c() {
    s || (e.onStart(), t = 0, a = !1, s = !0, o());
  }
  return {
    loop: d,
    playOnce: c,
    stop: f,
    isRunning: () => s,
    setDuration: (m) => {
      i = m;
    },
    getDuration: () => i,
    setFPS: (m) => {
      r = m;
    },
    getFPS: () => r
  };
}
const W = -1, P = 12, M = 5003, ht = [
  0,
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255,
  511,
  1023,
  2047,
  4095,
  8191,
  16383,
  32767,
  65535
];
class ut {
  width;
  height;
  pixels;
  initCodeSize;
  accum = new Uint8Array(256);
  htab = new Int32Array(M);
  codetab = new Int32Array(M);
  cur_accum = 0;
  cur_bits = 0;
  a_count = 0;
  free_ent = 0;
  maxcode = 0;
  clear_flg = !1;
  g_init_bits = 0;
  ClearCode = 0;
  EOFCode = 0;
  n_bits = 0;
  remaining = 0;
  curPixel = 0;
  constructor(t, i, r, s) {
    this.width = t, this.height = i, this.pixels = r, this.initCodeSize = Math.max(2, s);
  }
  encode(t) {
    t.writeByte(this.initCodeSize), this.remaining = this.width * this.height, this.curPixel = 0, this.compress(this.initCodeSize + 1, t), t.writeByte(0);
  }
  MAXCODE(t) {
    return (1 << t) - 1;
  }
  nextPixel() {
    return this.remaining === 0 ? W : (--this.remaining, this.pixels[this.curPixel++] & 255);
  }
  char_out(t, i) {
    this.accum[this.a_count++] = t, this.a_count >= 254 && this.flush_char(i);
  }
  flush_char(t) {
    this.a_count > 0 && (t.writeByte(this.a_count), t.writeBytes(this.accum, 0, this.a_count), this.a_count = 0);
  }
  cl_block(t) {
    this.cl_hash(M), this.free_ent = this.ClearCode + 2, this.clear_flg = !0, this.output(this.ClearCode, t);
  }
  cl_hash(t) {
    for (let i = 0; i < t; ++i) this.htab[i] = -1;
  }
  compress(t, i) {
    let r, s, n, a, l, o, h;
    for (this.g_init_bits = t, this.clear_flg = !1, this.n_bits = this.g_init_bits, this.maxcode = this.MAXCODE(this.n_bits), this.ClearCode = 1 << t - 1, this.EOFCode = this.ClearCode + 1, this.free_ent = this.ClearCode + 2, this.a_count = 0, a = this.nextPixel(), h = 0, r = M; r < 65536; r *= 2) ++h;
    h = 8 - h, o = M, this.cl_hash(o), this.output(this.ClearCode, i);
    t: for (; (s = this.nextPixel()) != W; ) {
      if (r = (s << P) + a, n = s << h ^ a, this.htab[n] === r) {
        a = this.codetab[n];
        continue;
      } else if (this.htab[n] >= 0) {
        l = o - n, n === 0 && (l = 1);
        do
          if ((n -= l) < 0 && (n += o), this.htab[n] === r) {
            a = this.codetab[n];
            continue t;
          }
        while (this.htab[n] >= 0);
      }
      this.output(a, i), a = s, this.free_ent < 1 << P ? (this.codetab[n] = this.free_ent++, this.htab[n] = r) : this.cl_block(i);
    }
    this.output(a, i), this.output(this.EOFCode, i);
  }
  output(t, i) {
    for (this.cur_accum &= ht[this.cur_bits], this.cur_bits > 0 ? this.cur_accum |= t << this.cur_bits : this.cur_accum = t, this.cur_bits += this.n_bits; this.cur_bits >= 8; )
      this.char_out(this.cur_accum & 255, i), this.cur_accum >>= 8, this.cur_bits -= 8;
    if ((this.free_ent > this.maxcode || this.clear_flg) && (this.clear_flg ? (this.maxcode = this.MAXCODE(this.n_bits = this.g_init_bits), this.clear_flg = !1) : (++this.n_bits, this.n_bits == P ? this.maxcode = 1 << P : this.maxcode = this.MAXCODE(this.n_bits))), t == this.EOFCode) {
      for (; this.cur_bits > 0; )
        this.char_out(this.cur_accum & 255, i), this.cur_accum >>= 8, this.cur_bits -= 8;
      this.flush_char(i);
    }
  }
}
let y = 256;
const j = 499, X = 491, $ = 487, K = 503, H = 3 * K;
let E = y - 1;
const S = 4, ct = 100, V = 16, O = 1 << V, tt = 10, L = 10, ft = O >> L, dt = O << tt - L;
let R = y >> 3;
const D = 6, et = 1 << D;
let U = R * et;
const gt = 30, st = 10, F = 1 << st;
let Y;
const it = 8, Q = 1 << it, mt = st + it, T = 1 << mt;
class bt {
  thepicture;
  lengthcount;
  samplefac;
  network;
  netindex = [];
  bias = [];
  freq = [];
  radpower = [];
  constructor(t, i, r) {
    this.thepicture = t, this.lengthcount = i, this.samplefac = r, this.network = new Array(y);
    for (let s = 0; s < y; s++) {
      this.network[s] = new Array(4);
      const n = this.network[s];
      n[0] = n[1] = n[2] = (s << S + 8) / y, this.freq[s] = O / y, this.bias[s] = 0;
    }
  }
  setMaxColors(t) {
    y = t, E = y - 1, R = y >> 3, U = R * et;
  }
  process() {
    return this.learn(), this.unbiasnet(), this.inxbuild(), this.colorMap();
  }
  colorMap() {
    const t = [], i = new Array(y);
    for (let s = 0; s < y; s++) i[this.network[s][3]] = s;
    let r = 0;
    for (let s = 0; s < y; s++) {
      const n = i[s];
      t[r++] = this.network[n][0], t[r++] = this.network[n][1], t[r++] = this.network[n][2];
    }
    return t;
  }
  inxbuild() {
    let t = 0, i = 0;
    for (let r = 0; r < y; r++) {
      let s = this.network[r], n = r, a = s[1];
      for (let o = r + 1; o < y; o++) {
        const h = this.network[o];
        h[1] < a && (n = o, a = h[1]);
      }
      const l = this.network[n];
      if (r != n) {
        let o = l[0];
        l[0] = s[0], s[0] = o, o = l[1], l[1] = s[1], s[1] = o, o = l[2], l[2] = s[2], s[2] = o, o = l[3], l[3] = s[3], s[3] = o;
      }
      if (a != t) {
        this.netindex[t] = i + r >> 1;
        for (let o = t + 1; o < a; o++) this.netindex[o] = r;
        t = a, i = r;
      }
    }
    this.netindex[t] = i + E >> 1;
    for (let r = t + 1; r < 256; r++) this.netindex[r] = E;
  }
  learn() {
    this.lengthcount < H && (this.samplefac = 1), Y = 30 + (this.samplefac - 1) / 3;
    const t = this.thepicture;
    let i = 0;
    const r = this.lengthcount, s = this.lengthcount / (3 * this.samplefac);
    let n = s / ct | 0, a = F, l = U, o = l >> D;
    o <= 1 && (o = 0);
    for (let d = 0; d < o; d++)
      this.radpower[d] = a * ((o * o - d * d) * Q / (o * o));
    let h;
    this.lengthcount < H ? h = 3 : this.lengthcount % j !== 0 ? h = 3 * j : this.lengthcount % X !== 0 ? h = 3 * X : this.lengthcount % $ !== 0 ? h = 3 * $ : h = 3 * K;
    let u = 0;
    for (; u < s; ) {
      const d = (t[i + 0] & 255) << S, f = (t[i + 1] & 255) << S, c = (t[i + 2] & 255) << S, m = this.contest(d, f, c);
      if (this.altersingle(a, m, d, f, c), o !== 0 && this.alterneigh(o, m, d, f, c), i += h, i >= r && (i -= this.lengthcount), u++, n === 0 && (n = 1), u % n === 0) {
        a -= a / Y, l -= l / gt, o = l >> D, o <= 1 && (o = 0);
        for (let g = 0; g < o; g++)
          this.radpower[g] = a * ((o * o - g * g) * Q / (o * o));
      }
    }
  }
  map(t, i, r) {
    let s = 1e3, n = -1, a = this.netindex[i], l = a - 1;
    for (; a < y || l >= 0; ) {
      if (a < y) {
        const o = this.network[a];
        let h = o[1] - i;
        if (h >= s) a = y;
        else {
          a++, h < 0 && (h = -h);
          let u = o[0] - t;
          u < 0 && (u = -u), h += u, h < s && (u = o[2] - r, u < 0 && (u = -u), h += u, h < s && (s = h, n = o[3]));
        }
      }
      if (l >= 0) {
        const o = this.network[l];
        let h = i - o[1];
        if (h >= s) l = -1;
        else {
          l--, h < 0 && (h = -h);
          let u = o[0] - t;
          u < 0 && (u = -u), h += u, h < s && (u = o[2] - r, u < 0 && (u = -u), h += u, h < s && (s = h, n = o[3]));
        }
      }
    }
    return n;
  }
  unbiasnet() {
    for (let t = 0; t < y; t++)
      this.network[t][0] >>= S, this.network[t][1] >>= S, this.network[t][2] >>= S, this.network[t][3] = t;
  }
  alterneigh(t, i, r, s, n) {
    let a = i - t;
    a < -1 && (a = -1);
    let l = i + t;
    l > y && (l = y);
    let o = i + 1, h = i - 1, u = 1;
    for (; o < l || h > a; ) {
      const d = this.radpower[u++];
      if (o < l) {
        const f = this.network[o++];
        try {
          f[0] -= d * (f[0] - r) / T, f[1] -= d * (f[1] - s) / T, f[2] -= d * (f[2] - n) / T;
        } catch {
        }
      }
      if (h > a) {
        const f = this.network[h--];
        try {
          f[0] -= d * (f[0] - r) / T, f[1] -= d * (f[1] - s) / T, f[2] -= d * (f[2] - n) / T;
        } catch {
        }
      }
    }
  }
  altersingle(t, i, r, s, n) {
    const a = this.network[i];
    a[0] -= t * (a[0] - r) / F, a[1] -= t * (a[1] - s) / F, a[2] -= t * (a[2] - n) / F;
  }
  contest(t, i, r) {
    let s = 2147483647, n = s, a = -1, l = a;
    for (let o = 0; o < y; o++) {
      const h = this.network[o];
      let u = h[0] - t;
      u < 0 && (u = -u);
      let d = h[1] - i;
      d < 0 && (d = -d), u += d, d = h[2] - r, d < 0 && (d = -d), u += d, u < s && (s = u, a = o);
      const f = u - (this.bias[o] >> V - S);
      f < n && (n = f, l = o);
      const c = this.freq[o] >> L;
      this.freq[o] -= c, this.bias[o] += c << tt;
    }
    return this.freq[a] += ft, this.bias[a] -= dt, l;
  }
}
const rt = {};
for (let e = 0; e < 256; e++) rt[e] = String.fromCharCode(e);
class yt {
  bin = [];
  getData() {
    let t = "";
    for (let i = 0; i < this.bin.length; i++) t += rt[this.bin[i]];
    return t;
  }
  writeByte(t) {
    this.bin.push(t);
  }
  writeUTFBytes(t) {
    for (let i = 0; i < t.length; i++) this.writeByte(t.charCodeAt(i));
  }
  writeBytes(t, i, r) {
    const s = r ?? t.length;
    for (let n = i ?? 0; n < s; n++) this.writeByte(t[n]);
  }
}
class wt {
  width = 0;
  height = 0;
  transparent = null;
  transIndex = 0;
  repeat = -1;
  delay = 0;
  started = !1;
  out;
  image = null;
  pixels = null;
  indexedPixels = null;
  colorDepth = 0;
  colorTab = null;
  usedEntry = [];
  palSize = 7;
  dispose = -1;
  firstFrame = !0;
  sizeSet = !1;
  sample = 10;
  comment = "Generated by gifloopcoder";
  maxColors = 256;
  setDelay(t) {
    this.delay = Math.round(t / 10);
  }
  setDispose(t) {
    t >= 0 && (this.dispose = t);
  }
  setRepeat(t) {
    t >= 0 && (this.repeat = t);
  }
  setTransparent(t) {
    this.transparent = t;
  }
  setComment(t) {
    this.comment = t;
  }
  setFrameRate(t) {
    t != 15 && (this.delay = Math.round(100 / t));
  }
  setQuality(t) {
    t < 1 && (t = 1), this.sample = t;
  }
  setSize(t, i) {
    this.started && !this.firstFrame || (this.width = t < 1 ? 320 : t, this.height = i < 1 ? 240 : i, this.sizeSet = !0);
  }
  setMaxColors(t) {
    this.maxColors = t;
  }
  start() {
    this.reset(), this.out = new yt();
    let t = !0;
    try {
      this.out.writeUTFBytes("GIF89a");
    } catch {
      t = !1;
    }
    return this.started = t;
  }
  addFrame(t, i = !1) {
    if (t === null || !this.started || this.out === null)
      throw new Error("Please call start method before calling addFrame");
    let r = !0;
    try {
      if (i)
        this.image = t;
      else {
        const s = t;
        this.image = s.getImageData(0, 0, s.canvas.width, s.canvas.height).data, this.sizeSet || this.setSize(s.canvas.width, s.canvas.height);
      }
      this.getImagePixels(), this.analyzePixels(), this.firstFrame && (this.writeLSD(), this.writePalette(), this.repeat >= 0 && this.writeNetscapeExt()), this.writeGraphicCtrlExt(), this.comment !== "" && this.writeCommentExt(), this.writeImageDesc(), this.firstFrame || this.writePalette(), this.writePixels(), this.firstFrame = !1;
    } catch {
      r = !1;
    }
    return r;
  }
  finish() {
    if (!this.started) return !1;
    let t = !0;
    this.started = !1;
    try {
      this.out.writeByte(59);
    } catch {
      t = !1;
    }
    return t;
  }
  stream() {
    return this.out;
  }
  reset() {
    this.transIndex = 0, this.image = null, this.pixels = null, this.indexedPixels = null, this.colorTab = null, this.firstFrame = !0;
  }
  analyzePixels() {
    const t = this.pixels, i = t.length, r = i / 3;
    this.indexedPixels = [];
    const s = new bt(t, i, this.sample);
    s.setMaxColors(this.maxColors), this.colorTab = s.process();
    let n = 0;
    for (let a = 0; a < r; a++) {
      const l = s.map(t[n++] & 255, t[n++] & 255, t[n++] & 255);
      this.usedEntry[l] = !0, this.indexedPixels[a] = l;
    }
    this.pixels = null, this.colorDepth = 8, this.palSize = 7, this.transparent !== null && (this.transIndex = this.findClosest(this.transparent));
  }
  findClosest(t) {
    if (this.colorTab === null) return -1;
    const i = (t & 16711680) >> 16, r = (t & 65280) >> 8, s = t & 255;
    let n = 0, a = 256 * 256 * 256;
    const l = this.colorTab.length;
    for (let o = 0; o < l; ) {
      const h = i - (this.colorTab[o++] & 255), u = r - (this.colorTab[o++] & 255), d = s - (this.colorTab[o] & 255), f = h * h + u * u + d * d, c = o / 3;
      this.usedEntry[c] && f < a && (a = f, n = c), o++;
    }
    return n;
  }
  getImagePixels() {
    const t = this.width, i = this.height, r = [], s = this.image;
    let n = 0;
    for (let a = 0; a < i; a++)
      for (let l = 0; l < t; l++) {
        const o = a * t * 4 + l * 4;
        r[n++] = s[o], r[n++] = s[o + 1], r[n++] = s[o + 2];
      }
    this.pixels = r;
  }
  writeGraphicCtrlExt() {
    this.out.writeByte(33), this.out.writeByte(249), this.out.writeByte(4);
    let t, i;
    this.transparent === null ? (t = 0, i = 0) : (t = 1, i = 2), this.dispose >= 0 && (i = this.dispose & 7), i <<= 2, this.out.writeByte(0 | i | 0 | t), this.WriteShort(this.delay), this.out.writeByte(this.transIndex), this.out.writeByte(0);
  }
  writeCommentExt() {
    this.out.writeByte(33), this.out.writeByte(254), this.out.writeByte(this.comment.length), this.out.writeUTFBytes(this.comment), this.out.writeByte(0);
  }
  writeImageDesc() {
    this.out.writeByte(44), this.WriteShort(0), this.WriteShort(0), this.WriteShort(this.width), this.WriteShort(this.height), this.firstFrame ? this.out.writeByte(0) : this.out.writeByte(128 | this.palSize);
  }
  writeLSD() {
    this.WriteShort(this.width), this.WriteShort(this.height), this.out.writeByte(240 | this.palSize), this.out.writeByte(0), this.out.writeByte(0);
  }
  writeNetscapeExt() {
    this.out.writeByte(33), this.out.writeByte(255), this.out.writeByte(11), this.out.writeUTFBytes("NETSCAPE2.0"), this.out.writeByte(3), this.out.writeByte(1), this.WriteShort(this.repeat), this.out.writeByte(0);
  }
  writePalette() {
    this.out.writeBytes(this.colorTab);
    const t = 3 * 256 - this.colorTab.length;
    for (let i = 0; i < t; i++) this.out.writeByte(0);
  }
  WriteShort(t) {
    this.out.writeByte(t & 255), this.out.writeByte(t >> 8 & 255);
  }
  writePixels() {
    new ut(this.width, this.height, this.indexedPixels, this.colorDepth).encode(this.out);
  }
}
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function St(e) {
  let t = "", i = 0;
  const r = e.length;
  for (; i < r; ) {
    const s = e.charCodeAt(i++), n = e.charCodeAt(i++), a = e.charCodeAt(i++), l = s >> 2, o = (s & 3) << 4 | n >> 4;
    let h = (n & 15) << 2 | a >> 6, u = a & 63;
    isNaN(n) ? h = u = 64 : isNaN(a) && (u = 64), t += A.charAt(l) + A.charAt(o) + A.charAt(h) + A.charAt(u);
  }
  return t;
}
function pt() {
  let e = !1, t = 256, i = 30, r = 10, s = null, n = 400, a = 400;
  const l = new wt();
  return {
    start() {
      l.setSize(n, a), l.setMaxColors(t), l.setRepeat(0), l.setDelay(1e3 / i), l.setQuality(r), l.start(), e = !0;
    },
    addFrame(o) {
      l.addFrame(o);
    },
    complete() {
      l.finish();
      const o = l.stream().getData();
      s = "data:image/gif;base64," + St(o), e = !1;
    },
    isEncoding: () => e,
    getDataURL: () => s,
    setSize(o, h) {
      n = o, a = h;
    },
    setMaxColors(o) {
      t = o;
    },
    setFPS(o) {
      i = o;
    },
    setQuality(o) {
      r = o;
    }
  };
}
function Nt() {
  if (typeof document > "u")
    throw new Error("createSpriteSheet requires a DOM environment");
  const e = document.createElement("canvas"), t = e.getContext("2d");
  let i = 0, r = 0, s = 0, n = 0, a = 0, l = !1;
  return {
    addFrame(o) {
      t.drawImage(o, r, s), r += n, r + n > i && (r = 0, s += a);
    },
    getDataURL: () => e.toDataURL(),
    start(o, h, u, d, f) {
      const c = o * h;
      n = u, a = d;
      let m = n * c, g = a, b = 1;
      for (; g <= m; )
        b++, m = n * Math.ceil(c / b), g = a * b;
      b--, i = n * Math.ceil(c / b), !(i > 2048 && f && !f(i)) && (e.width = e.height = i, t.clearRect(0, 0, i, i), r = 0, s = 0, l = !0);
    },
    complete() {
      l = !1;
    },
    getSpriteSheetSize: () => i,
    isEncoding: () => l
  };
}
const Tt = {
  r: 255,
  g: 255,
  b: 255,
  a: 1,
  setRGBA(e, t, i, r) {
    return this.r = e, this.g = t, this.b = i, this.a = r, this;
  },
  toString() {
    return `rgba(${Math.floor(this.r)},${Math.floor(this.g)},${Math.floor(this.b)},${this.a})`;
  }
};
function G(e, t, i, r) {
  const s = Object.create(Tt);
  return s.setRGBA(e, t, i, r), s.toString();
}
function z(e, t, i) {
  return G(e, t, i, 1);
}
function Ct(e = 0, t = 256) {
  return z(
    Math.floor(e + Math.random() * (t - e)),
    Math.floor(e + Math.random() * (t - e)),
    Math.floor(e + Math.random() * (t - e))
  );
}
function nt(e) {
  return z(e, e, e);
}
function kt(e = 0, t = 256) {
  return nt(Math.floor(e + Math.random() * (t - e)));
}
function Mt(e) {
  const t = e >> 16, i = e >> 8 & 255, r = e & 255;
  return z(t, i, r);
}
function x(e, t, i, r) {
  let s = 0, n = 0, a = 0;
  const l = Math.floor(e / 60), o = e / 60 - l, h = i * (1 - t), u = i * (1 - o * t), d = i * (1 - (1 - o) * t);
  switch ((l % 6 + 6) % 6) {
    case 0:
      s = i, n = d, a = h;
      break;
    case 1:
      s = u, n = i, a = h;
      break;
    case 2:
      s = h, n = i, a = d;
      break;
    case 3:
      s = h, n = u, a = i;
      break;
    case 4:
      s = d, n = h, a = i;
      break;
    case 5:
      s = i, n = h, a = u;
      break;
  }
  return G(Math.floor(s * 255), Math.floor(n * 255), Math.floor(a * 255), r);
}
function ot(e, t, i) {
  return x(e, t, i, 1);
}
function Pt(e, t, i, r, s, n) {
  const a = e + Math.random() * (t - e), l = i + Math.random() * (r - i), o = s + Math.random() * (n - s);
  return ot(a, l, o);
}
function at(e, t, i, r, s, n, a, l) {
  return (o) => {
    const h = e + o * (t - e), u = i + o * (r - i), d = s + o * (n - s), f = a + o * (l - a);
    return x(h, u, d, f);
  };
}
function Ft(e, t, i, r, s, n) {
  return at(e, t, i, r, s, n, 1, 1);
}
function At(e, t, i, r) {
  return {
    type: "linearGradient",
    x0: e,
    y0: t,
    x1: i,
    y1: r,
    colorStops: [],
    addColorStop(n, a) {
      this.colorStops.push({ position: n, color: a });
    }
  };
}
function vt(e, t, i, r, s, n) {
  return {
    type: "radialGradient",
    x0: e,
    y0: t,
    r0: i,
    x1: r,
    y1: s,
    r1: n,
    colorStops: [],
    addColorStop(l, o) {
      this.colorStops.push({ position: l, color: o });
    }
  };
}
const Bt = {
  rgb: z,
  rgba: G,
  randomRGB: Ct,
  randomGray: kt,
  gray: nt,
  num: Mt,
  hsv: ot,
  hsva: x,
  animHSV: Ft,
  animHSVA: at,
  randomHSV: Pt,
  createLinearGradient: At,
  createRadialGradient: vt
};
function It() {
  let e = "bounce", t = !0;
  function i(r) {
    switch (e) {
      case "bounce": {
        if (t) {
          const n = r * Math.PI * 2;
          return 0.5 - Math.cos(n) * 0.5;
        }
        const s = r % 1;
        return s < 0.5 ? s * 2 : (1 - s) * 2;
      }
      case "single":
      default: {
        let s = r;
        if (s > 1 && (s %= 1), t) {
          const n = s * Math.PI;
          return 0.5 - Math.cos(n) * 0.5;
        }
        return s;
      }
    }
  }
  return {
    interpolate: i,
    setMode(r) {
      e = String(r).toLowerCase();
    },
    setEasing(r) {
      t = r;
    },
    getMode() {
      return e;
    },
    getEasing() {
      return t;
    }
  };
}
const J = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370d8",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#d87093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
let v = null;
function _() {
  return v || (typeof document > "u" ? null : (v = document.createElement("canvas").getContext("2d"), v));
}
function _t(e) {
  return `rgba(${e.r},${e.g},${e.b},${e.a / 255})`;
}
function p(e) {
  if (e.charAt(0) === "#") {
    if (e.length === 7)
      return {
        a: 255,
        r: parseInt(e.substring(1, 3), 16),
        g: parseInt(e.substring(3, 5), 16),
        b: parseInt(e.substring(5, 7), 16)
      };
    if (e.length === 9)
      return {
        a: parseInt(e.substring(1, 3), 16),
        r: parseInt(e.substring(3, 5), 16),
        g: parseInt(e.substring(5, 7), 16),
        b: parseInt(e.substring(7, 9), 16)
      };
    const i = e.charAt(1), r = e.charAt(2), s = e.charAt(3);
    return {
      a: 255,
      r: parseInt(i + i, 16),
      g: parseInt(r + r, 16),
      b: parseInt(s + s, 16)
    };
  }
  if (e.substring(0, 4) === "rgb(") {
    const i = e.indexOf("(") + 1, r = e.indexOf(")"), s = e.substring(i, r).split(",");
    return {
      a: 255,
      r: parseInt(s[0], 10),
      g: parseInt(s[1], 10),
      b: parseInt(s[2], 10)
    };
  }
  if (e.substring(0, 4) === "rgba") {
    const i = e.indexOf("(") + 1, r = e.indexOf(")"), s = e.substring(i, r).split(",");
    return {
      a: parseFloat(s[3]) * 255,
      r: parseInt(s[0], 10),
      g: parseInt(s[1], 10),
      b: parseInt(s[2], 10)
    };
  }
  const t = e.toLowerCase();
  return J[t] != null ? p(J[t]) : { r: 0, g: 0, b: 0, a: 255 };
}
function q(e, t) {
  const i = e[0], r = e[1], s = i.a + (r.a - i.a) * t, n = Math.round(i.r + (r.r - i.r) * t), a = Math.round(i.g + (r.g - i.g) * t), l = Math.round(i.b + (r.b - i.b) * t);
  return `rgba(${n},${a},${l},${s / 255})`;
}
function zt(e) {
  return e[0]?.type === "linearGradient" && e[1]?.type === "linearGradient";
}
function Et(e, t) {
  const i = _();
  if (!i) return "#000000";
  const r = e[0], s = e[1], n = r.x0 + (s.x0 - r.x0) * t, a = r.y0 + (s.y0 - r.y0) * t, l = r.x1 + (s.x1 - r.x1) * t, o = r.y1 + (s.y1 - r.y1) * t, h = i.createLinearGradient(n, a, l, o);
  for (let u = 0; u < r.colorStops.length; u++) {
    const d = r.colorStops[u], f = s.colorStops[u], c = d.position + (f.position - d.position) * t, m = p(d.color), g = p(f.color), b = q([m, g], t);
    h.addColorStop(c, b);
  }
  return h;
}
function Rt(e) {
  return e[0]?.type === "radialGradient" && e[1]?.type === "radialGradient";
}
function Dt(e, t) {
  const i = _();
  if (!i) return "#000000";
  const r = e[0], s = e[1], n = r.x0 + (s.x0 - r.x0) * t, a = r.y0 + (s.y0 - r.y0) * t, l = r.r0 + (s.r0 - r.r0) * t, o = r.x1 + (s.x1 - r.x1) * t, h = r.y1 + (s.y1 - r.y1) * t, u = r.r1 + (s.r1 - r.r1) * t, d = i.createRadialGradient(n, a, l, o, h, u);
  for (let f = 0; f < r.colorStops.length; f++) {
    const c = r.colorStops[f], m = s.colorStops[f], g = c.position + (m.position - c.position) * t, b = p(c.color), w = p(m.color), k = q([b, w], t);
    d.addColorStop(g, k);
  }
  return d;
}
const Ot = {
  getColor(e, t, i) {
    if (e === void 0)
      return i;
    if (typeof e == "string") {
      if (e.charAt(0) === "#" && e.length > 7) {
        const r = p(e);
        return _t(r);
      }
      return e;
    }
    if (typeof e == "function")
      return e(t);
    if (e && e.length === 2) {
      if (zt(e))
        return Et(e, t);
      if (Rt(e))
        return Dt(e, t);
      const r = p(e[0]), s = p(e[1]);
      return q([r, s], t);
    }
    if (e && e.length)
      return e[Math.round(t * (e.length - 1))];
    if (e?.type === "linearGradient") {
      const r = _();
      if (!r) return i;
      const s = r.createLinearGradient(e.x0, e.y0, e.x1, e.y1);
      for (const n of e.colorStops)
        s.addColorStop(n.position, n.color);
      return s;
    }
    if (e?.type === "radialGradient") {
      const r = _();
      if (!r) return i;
      const s = r.createRadialGradient(e.x0, e.y0, e.r0, e.x1, e.y1, e.r1);
      for (const n of e.colorStops)
        s.addColorStop(n.position, n.color);
      return s;
    }
    return i;
  }
}, N = {
  getNumber(e, t, i) {
    if (typeof e == "number")
      return e;
    if (typeof e == "function")
      return e(t);
    if (e && e.length === 2) {
      const r = e[0], s = e[1];
      return r + (s - r) * t;
    }
    return e && e.length ? e[Math.round(t * (e.length - 1))] : i;
  },
  getString(e, t, i) {
    return e === void 0 ? i : typeof e == "string" ? e : typeof e == "function" ? e(t) : e && e.length ? e[Math.round(t * (e.length - 1))] : e;
  },
  getBool(e, t, i) {
    return e === void 0 ? i : typeof e == "function" ? e(t) : e && e.length ? e[Math.round(t * (e.length - 1))] : e;
  },
  getArray(e, t, i) {
    if (typeof e == "string")
      return i;
    if (typeof e == "function")
      return e(t);
    if (e && e.length === 2 && e[0]?.length && e[1]?.length) {
      const r = e[0], s = e[1], n = Math.min(r.length, s.length), a = [];
      for (let l = 0; l < n; l++) {
        const o = r[l], h = s[l];
        a.push(o + (h - o) * t);
      }
      return a;
    }
    return e && e.length > 1 ? e : i;
  },
  getObject(e, t, i) {
    return e === void 0 ? i : typeof e == "function" ? e(t) : e && e.length ? e[Math.round(t * (e.length - 1))] : e;
  },
  getPosition(e, t, i) {
    return N.getObject(e, t, i);
  }
};
function Lt() {
  return {
    styles: null,
    interpolation: null,
    create(t, i) {
      const r = Object.create(this);
      return r.init(t, i || {}), r;
    },
    init(t, i) {
      this.props = i;
      for (const r in i) {
        const s = i[r];
        typeof s == "function" && (i[r] = s.bind(i));
      }
      this.draw = t.draw, this.list = [];
    },
    add(t) {
      return this.list.push(t), t;
    },
    clear() {
      this.list.length = 0;
    },
    render(t, i) {
      const r = i;
      let s = i;
      s *= this.props.speedMult || 1, s += this.props.phase || 0, s = this.interpolation.interpolate(s), this.startDraw(t, s), this.draw(t, s);
      for (let n = 0; n < this.list.length; n++)
        this.list[n].render(t, r);
      this.endDraw(t);
    },
    startDraw(t, i) {
      const r = this.styles;
      t.save(), t.lineWidth = this.getNumber("lineWidth", i, r.lineWidth), t.strokeStyle = this.getColor("strokeStyle", i, r.strokeStyle), t.fillStyle = this.getColor("fillStyle", i, r.fillStyle), t.lineCap = this.getString("lineCap", i, r.lineCap), t.lineJoin = this.getString("lineJoin", i, r.lineJoin), t.miterLimit = Number(this.getString("miterLimit", i, String(r.miterLimit))), t.globalAlpha = this.getNumber("globalAlpha", i, r.globalAlpha), t.translate(
        this.getNumber("translationX", i, r.translationX),
        this.getNumber("translationY", i, r.translationY)
      ), t.globalCompositeOperation = this.getString(
        "blendMode",
        i,
        r.blendMode
      );
      const s = this.getNumber("shake", i, r.shake);
      t.translate(Math.random() * s - s / 2, Math.random() * s - s / 2);
      const n = this.getArray("lineDash", i, r.lineDash);
      n && t.setLineDash(n), t.beginPath();
    },
    drawFillAndStroke(t, i, r, s) {
      const n = this.getBool("fill", i, r), a = this.getBool("stroke", i, s);
      t.save(), n && (this.setShadowParams(t, i), t.fill()), t.restore(), a && (n || this.setShadowParams(t, i), t.stroke());
    },
    setShadowParams(t, i) {
      const r = this.styles;
      t.shadowColor = this.getColor("shadowColor", i, r.shadowColor || "transparent"), t.shadowOffsetX = this.getNumber("shadowOffsetX", i, r.shadowOffsetX), t.shadowOffsetY = this.getNumber("shadowOffsetY", i, r.shadowOffsetY), t.shadowBlur = this.getNumber("shadowBlur", i, r.shadowBlur);
    },
    endDraw(t) {
      t.restore();
    },
    getNumber(t, i, r) {
      return N.getNumber(this.props[t], i, r);
    },
    getColor(t, i, r) {
      return Ot.getColor(this.props[t], i, r);
    },
    getString(t, i, r) {
      return N.getString(this.props[t], i, r);
    },
    getBool(t, i, r) {
      return N.getBool(this.props[t], i, r);
    },
    getArray(t, i, r) {
      return N.getArray(this.props[t], i, r);
    },
    getObject(t, i, r) {
      return N.getObject(this.props[t], i, r);
    },
    getPosition(t, i, r) {
      return N.getPosition(this.props[t], i, r);
    }
  };
}
const Gt = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("radius", t, 50);
    let n = this.getNumber("startAngle", t, 0), a = this.getNumber("endAngle", t, 360);
    n > a && ([n, a] = [a, n]);
    const l = this.getNumber("arc", t, 20);
    let o = n - 1, h = n + t * (a - n + l);
    h > n + l && (o = h - l), h > a && (h = a + 1), e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), e.arc(0, 0, s, o * Math.PI / 180, h * Math.PI / 180), this.drawFillAndStroke(e, t, !1, !0);
  }
}, xt = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("w", t, 100), n = this.getNumber("h", t, 100), a = this.getNumber("pointPercent", t, 0.5), l = this.getNumber("shaftPercent", t, 0.5);
    e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), e.moveTo(-s / 2, -n * l * 0.5), e.lineTo(s / 2 - s * a, -n * l * 0.5), e.lineTo(s / 2 - s * a, -n * 0.5), e.lineTo(s / 2, 0), e.lineTo(s / 2 - s * a, n * 0.5), e.lineTo(s / 2 - s * a, n * l * 0.5), e.lineTo(-s / 2, n * l * 0.5), e.lineTo(-s / 2, -n * l * 0.5), this.drawFillAndStroke(e, t, !0, !1);
  }
}, qt = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 50), r = this.getNumber("y0", t, 10), s = this.getNumber("x1", t, 200), n = this.getNumber("y1", t, 100), a = this.getNumber("x2", t, 0), l = this.getNumber("y2", t, 100), o = this.getNumber("x3", t, 150), h = this.getNumber("y3", t, 10), u = this.getBool("showPoints", t, !1);
    e.moveTo(i, r), e.bezierCurveTo(s, n, a, l, o, h), this.drawFillAndStroke(e, t, !1, !0), u && (e.fillStyle = "black", e.fillRect(i - 2, r - 2, 4, 4), e.fillRect(s - 2, n - 2, 4, 4), e.fillRect(a - 2, l - 2, 4, 4), e.fillRect(o - 2, h - 2, 4, 4));
  }
};
function B(e, t, i, r, s) {
  return (1 - e) * (1 - e) * (1 - e) * t + 3 * (1 - e) * (1 - e) * e * i + 3 * (1 - e) * e * e * r + e * e * e * s;
}
const Wt = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 50), r = this.getNumber("y0", t, 10), s = this.getNumber("x1", t, 200), n = this.getNumber("y1", t, 100), a = this.getNumber("x2", t, 0), l = this.getNumber("y2", t, 100), o = this.getNumber("x3", t, 150), h = this.getNumber("y3", t, 10), u = this.getNumber("percent", t, 0.1), d = this.getBool("showPoints", t, !1);
    let f = t * (1 + u), c = f - u;
    const m = 0.01;
    f = Math.min(f, 1.001), c = Math.max(c, -1e-3);
    let g = 0, b = 0;
    for (let w = c; w < f; w += m)
      g = B(w, i, s, a, o), b = B(w, r, n, l, h), w === c ? e.moveTo(g, b) : e.lineTo(g, b);
    g = B(f, i, s, a, o), b = B(f, r, n, l, h), e.lineTo(g, b), this.drawFillAndStroke(e, t, !1, !0), d && (e.fillStyle = "black", e.fillRect(i - 2, r - 2, 4, 4), e.fillRect(s - 2, n - 2, 4, 4), e.fillRect(a - 2, l - 2, 4, 4), e.fillRect(o - 2, h - 2, 4, 4));
  }
}, jt = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100);
    let s = this.getNumber("radius", t, 50);
    const n = this.getNumber("startAngle", t, 0), a = this.getNumber("endAngle", t, 360), l = this.getBool("drawFromCenter", t, !1);
    s = Math.abs(s), e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), l && e.moveTo(0, 0), e.arc(0, 0, s, n * Math.PI / 180, a * Math.PI / 180), l && e.closePath(), this.drawFillAndStroke(e, t, !0, !1);
  }
}, Xt = {
  draw(e, t) {
    const i = this.getNumber("x", t, 0), r = this.getNumber("y", t, 0);
    e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180);
  }
};
function $t() {
  return [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 }
  ];
}
function Ht(e, t) {
  for (const i of e)
    i.x *= t, i.y *= t, i.z *= t;
}
function Ut(e, t) {
  const i = Math.cos(t), r = Math.sin(t);
  for (const s of e) {
    const n = s.y * i - s.z * r, a = s.z * i + s.y * r;
    s.y = n, s.z = a;
  }
}
function Yt(e, t) {
  const i = Math.cos(t), r = Math.sin(t);
  for (const s of e) {
    const n = s.x * i - s.z * r, a = s.z * i + s.x * r;
    s.x = n, s.z = a;
  }
}
function Qt(e, t) {
  const i = Math.cos(t), r = Math.sin(t);
  for (const s of e) {
    const n = s.x * i - s.y * r, a = s.y * i + s.x * r;
    s.x = n, s.y = a;
  }
}
function Jt(e, t) {
  for (const r of e) {
    const s = 300 / (300 + r.z + t);
    r.sx = r.x * s, r.sy = r.y * s;
  }
}
const Zt = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("z", t, 0), n = this.getNumber("size", t, 100), a = this.getNumber("rotationX", t, 0) * Math.PI / 180, l = this.getNumber("rotationY", t, 0) * Math.PI / 180, o = this.getNumber("rotationZ", t, 0) * Math.PI / 180, h = $t();
    Ht(h, n / 2), Ut(h, a), Yt(h, l), Qt(h, o), Jt(h, s), e.lineJoin = this.getString("lineJoin", t, "round"), e.lineWidth = this.getNumber("lineWidth", t, 1), e.translate(i, r), e.moveTo(h[0].sx, h[0].sy), e.lineTo(h[1].sx, h[1].sy), e.lineTo(h[2].sx, h[2].sy), e.lineTo(h[3].sx, h[3].sy), e.lineTo(h[0].sx, h[0].sy), e.moveTo(h[4].sx, h[4].sy), e.lineTo(h[5].sx, h[5].sy), e.lineTo(h[6].sx, h[6].sy), e.lineTo(h[7].sx, h[7].sy), e.lineTo(h[4].sx, h[4].sy), e.moveTo(h[0].sx, h[0].sy), e.lineTo(h[4].sx, h[4].sy), e.moveTo(h[1].sx, h[1].sy), e.lineTo(h[5].sx, h[5].sy), e.moveTo(h[2].sx, h[2].sy), e.lineTo(h[6].sx, h[6].sy), e.moveTo(h[3].sx, h[3].sy), e.lineTo(h[7].sx, h[7].sy), this.setShadowParams(e, t), e.stroke();
  }
}, Kt = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 20), r = this.getNumber("y0", t, 10), s = this.getNumber("x1", t, 100), n = this.getNumber("y1", t, 200), a = this.getNumber("x2", t, 180), l = this.getNumber("y2", t, 10), o = this.getBool("showPoints", t, !1);
    e.moveTo(i, r), e.quadraticCurveTo(s, n, a, l), this.drawFillAndStroke(e, t, !1, !0), o && (e.fillStyle = "black", e.fillRect(i - 2, r - 2, 4, 4), e.fillRect(s - 2, n - 2, 4, 4), e.fillRect(a - 2, l - 2, 4, 4));
  }
};
function I(e, t, i, r) {
  return (1 - e) * (1 - e) * t + 2 * (1 - e) * e * i + e * e * r;
}
const Vt = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 20), r = this.getNumber("y0", t, 20), s = this.getNumber("x1", t, 100), n = this.getNumber("y1", t, 200), a = this.getNumber("x2", t, 180), l = this.getNumber("y2", t, 20), o = this.getNumber("percent", t, 0.1), h = this.getBool("showPoints", t, !1);
    let u = t * (1 + o), d = u - o;
    const f = 0.01;
    let c = 0, m = 0;
    u = Math.min(u, 1), d = Math.max(d, 0);
    for (let g = d; g < u; g += f)
      c = I(g, i, s, a), m = I(g, r, n, l), g === d ? e.moveTo(c, m) : e.lineTo(c, m);
    c = I(u, i, s, a), m = I(u, r, n, l), e.lineTo(c, m), this.drawFillAndStroke(e, t, !1, !0), h && (e.fillStyle = "black", e.fillRect(i - 2, r - 2, 4, 4), e.fillRect(s - 2, n - 2, 4, 4), e.fillRect(a - 2, l - 2, 4, 4));
  }
}, te = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("radius", t, 50), n = this.getNumber("toothHeight", t, 10), a = this.getNumber("hub", t, 10), l = this.getNumber("rotation", t, 0) * Math.PI / 180, o = this.getNumber("teeth", t, 10), u = 0.5 - this.getNumber("toothAngle", t, 0.3) / 2, d = 0.5 - u, f = s - n;
    e.translate(i, r), e.rotate(l), e.save(), e.moveTo(s, 0);
    const c = Math.PI * 2 / o;
    for (let m = 0; m < o; m++)
      e.rotate(c * u), e.lineTo(s, 0), e.rotate(c * d), e.lineTo(f, 0), e.rotate(c * u), e.lineTo(f, 0), e.rotate(c * d), e.lineTo(s, 0);
    e.lineTo(s, 0), e.restore(), e.moveTo(a, 0), e.arc(0, 0, a, 0, Math.PI * 2, !0), this.drawFillAndStroke(e, t, !0, !1);
  }
}, ee = {
  draw(e, t) {
    const i = this.getNumber("x", t, 0), r = this.getNumber("y", t, 0), s = this.getNumber("w", t, 100), n = this.getNumber("h", t, 100), a = this.getNumber("gridSize", t, 20);
    for (let l = r; l <= r + n; l += a)
      e.moveTo(i, l), e.lineTo(i + s, l);
    for (let l = i; l <= i + s; l += a)
      e.moveTo(l, r), e.lineTo(l, r + n);
    this.drawFillAndStroke(e, t, !1, !0);
  }
}, se = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("w", t, 50), n = this.getNumber("h", t, 50), a = 0, l = -0.25, o = 0.2, h = -0.8, u = 1.1, d = -0.2, f = 0, c = 0.5;
    e.save(), e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), e.save(), e.scale(s, n), e.moveTo(a, l), e.bezierCurveTo(o, h, u, d, f, c), e.bezierCurveTo(-u, d, -o, h, -a, l), e.restore(), this.drawFillAndStroke(e, t, !0, !1), e.restore();
  }
}, ie = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("size", t, 60), n = this.getNumber("h", t, 40), a = this.getColor("colorLeft", t, "#999999"), l = this.getColor("colorRight", t, "#cccccc"), o = this.getColor("colorTop", t, "#eeeeee");
    e.translate(i, r), n >= 0 ? (e.fillStyle = o, e.beginPath(), e.moveTo(-s / 2, -n), e.lineTo(0, -s / 4 - n), e.lineTo(s / 2, -n), e.lineTo(s / 2, -1), e.lineTo(0, s / 4 - 1), e.lineTo(-s / 2, -1), e.lineTo(-s / 2, -n), this.drawFillAndStroke(e, t, !0, !1), e.fillStyle = a, e.beginPath(), e.moveTo(-s / 2, 0), e.lineTo(0, s / 4), e.lineTo(0, s / 4 - n), e.lineTo(-s / 2, -n), e.lineTo(-s / 2, 0), this.drawFillAndStroke(e, t, !0, !1), e.fillStyle = l, e.beginPath(), e.moveTo(s / 2, 0), e.lineTo(0, s / 4), e.lineTo(0, s / 4 - n), e.lineTo(s / 2, -n), e.lineTo(s / 2, 0), this.drawFillAndStroke(e, t, !0, !1)) : (e.beginPath(), e.moveTo(-s / 2, 0), e.lineTo(0, -s / 4), e.lineTo(s / 2, 0), e.lineTo(0, s / 4), e.lineTo(-s / 2, 0), e.clip(), e.fillStyle = l, e.beginPath(), e.moveTo(-s / 2, 0), e.lineTo(0, -s / 4), e.lineTo(0, -s / 4 - n), e.lineTo(-s / 2, -n), e.lineTo(-s / 2, 0), this.drawFillAndStroke(e, t, !0, !1), e.fillStyle = a, e.beginPath(), e.moveTo(s / 2, 0), e.lineTo(0, -s / 4), e.lineTo(0, -s / 4 - n), e.lineTo(s / 2, -n), e.lineTo(s / 2, 0), this.drawFillAndStroke(e, t, !0, !1), e.fillStyle = o, e.beginPath(), e.moveTo(-s / 2, -n), e.lineTo(0, -s / 4 - n), e.lineTo(s / 2, -n), e.lineTo(0, s / 4 - n), e.lineTo(-s / 2, -n), this.drawFillAndStroke(e, t, !0, !1));
  }
}, re = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 0), r = this.getNumber("y0", t, 0), s = this.getNumber("x1", t, 100), n = this.getNumber("y1", t, 100);
    e.moveTo(i, r), e.lineTo(s, n), this.drawFillAndStroke(e, t, !1, !0);
  }
}, ne = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100);
    let s = this.getNumber("rx", t, 50), n = this.getNumber("ry", t, 50);
    const a = this.getNumber("startAngle", t, 0), l = this.getNumber("endAngle", t, 360), o = this.getBool("drawFromCenter", t, !1);
    s = Math.abs(s), n = Math.abs(n), e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), e.save(), e.scale(s / 100, n / 100), o && e.moveTo(0, 0), e.arc(0, 0, 100, a * Math.PI / 180, l * Math.PI / 180), o && e.closePath(), e.restore(), this.drawFillAndStroke(e, t, !0, !1);
  }
}, oe = {
  draw(e, t) {
    const i = this.getArray("path", t, []), r = this.getNumber("startPercent", t, 0), s = this.getNumber("endPercent", t, 1), n = Math.floor(i.length / 2 * r), a = Math.floor(i.length / 2 * s);
    let l = n * 2, o = a * 2;
    l > o && ([l, o] = [o, l]), e.moveTo(i[l], i[l + 1]);
    for (let h = l + 2; h < o - 1; h += 2)
      e.lineTo(i[h], i[h + 1]);
    this.drawFillAndStroke(e, t, !1, !0);
  }
}, ae = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("radius", t, 50), n = this.getNumber("rotation", t, 0) * Math.PI / 180, a = this.getNumber("sides", t, 5);
    e.translate(i, r), e.rotate(n), e.moveTo(s, 0);
    for (let l = 1; l < a; l++) {
      const o = Math.PI * 2 / a * l;
      e.lineTo(Math.cos(o) * s, Math.sin(o) * s);
    }
    e.closePath(), this.drawFillAndStroke(e, t, !0, !1);
  }
}, le = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("angle", t, 0) * Math.PI / 180, n = this.getNumber("length", t, 100);
    e.translate(i, r), e.rotate(s), e.moveTo(0, 0), e.lineTo(n, 0), this.drawFillAndStroke(e, t, !1, !0);
  }
}, he = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("angle", t, 0) * Math.PI / 180, n = this.getNumber("length", t, 100), a = this.getNumber("segmentLength", t, 50);
    let l = -0.01, o = (n + a) * t;
    o > a && (l = o - a), o > n && (o = n + 0.01), e.translate(i, r), e.rotate(s), e.moveTo(l, 0), e.lineTo(o, 0), this.drawFillAndStroke(e, t, !1, !0);
  }
}, ue = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("w", t, 100), n = this.getNumber("h", t, 100);
    e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), this.getBool("drawFromCenter", t, !0) ? e.rect(-s * 0.5, -n * 0.5, s, n) : e.rect(0, 0, s, n), this.drawFillAndStroke(e, t, !0, !1);
  }
}, ce = {
  draw(e, t) {
    const i = this.getNumber("x0", t, 0), r = this.getNumber("y0", t, 0), s = this.getNumber("x1", t, 100), n = this.getNumber("y1", t, 100), a = this.getNumber("segmentLength", t, 50), l = s - i, o = n - r, h = Math.atan2(o, l), u = Math.sqrt(l * l + o * o);
    let d = -0.01, f = (u + a) * t;
    f > a && (d = f - a), f > u && (f = u + 0.01), e.translate(i, r), e.rotate(h), e.moveTo(d, 0), e.lineTo(f, 0), this.drawFillAndStroke(e, t, !1, !0);
  }
}, fe = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("innerRadius", t, 10), n = this.getNumber("outerRadius", t, 90), a = this.getNumber("turns", t, 6), l = this.getNumber("res", t, 1) * Math.PI / 180, o = Math.PI * 2 * a;
    if (e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180), o > 0)
      for (let h = 0; h < o; h += l) {
        const u = s + (n - s) * h / o;
        e.lineTo(Math.cos(h) * u, Math.sin(h) * u);
      }
    else
      for (let h = 0; h > o; h -= l) {
        const u = s + (n - s) * h / o;
        e.lineTo(Math.cos(h) * u, Math.sin(h) * u);
      }
    this.drawFillAndStroke(e, t, !1, !0);
  }
}, de = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getNumber("innerRadius", t, 25), n = this.getNumber("outerRadius", t, 50), a = this.getNumber("rotation", t, 0) * Math.PI / 180, l = this.getNumber("points", t, 5);
    e.translate(i, r), e.rotate(a), e.moveTo(n, 0);
    for (let o = 1; o < l * 2; o++) {
      const h = Math.PI * 2 / l / 2 * o, u = o % 2 ? s : n;
      e.lineTo(Math.cos(h) * u, Math.sin(h) * u);
    }
    e.closePath(), this.drawFillAndStroke(e, t, !0, !1);
  }
}, ge = {
  draw(e, t) {
    const i = this.getNumber("x", t, 100), r = this.getNumber("y", t, 100), s = this.getString("text", t, "hello"), n = this.getNumber("fontSize", t, 20), a = this.getString("fontWeight", t, "normal"), l = this.getString("fontFamily", t, "sans-serif"), o = this.getString("fontStyle", t, "normal");
    e.font = `${a} ${o} ${n}px ${l}`;
    const h = e.measureText(s).width;
    e.translate(i, r), e.rotate(this.getNumber("rotation", t, 0) * Math.PI / 180);
    let u = !1;
    e.save(), this.getBool("fill", t, !0) && (this.setShadowParams(e, t), u = !0, e.fillText(s, -h / 2, n * 0.4)), e.restore(), this.getBool("stroke", t, !1) && (u || this.setShadowParams(e, t), e.strokeText(s, -h / 2, n * 0.4));
  }
};
function me(e) {
  const { canvas: t, styles: i, interpolation: r, hooks: s } = e, n = t.getContext("2d");
  let a = e.width, l = e.height;
  const o = [], h = Lt();
  h.styles = i, h.interpolation = r;
  let u = null;
  function d(b) {
    return b.props.parent ? b.props.parent.add(b) : o.push(b), u !== null && clearTimeout(u), u = setTimeout(() => {
      u = null, m(0);
    }, 0), b;
  }
  function f() {
    o.length = 0;
  }
  function c(b, w) {
    a = b, l = w;
  }
  function m(b) {
    i.backgroundColor === "transparent" ? n.clearRect(0, 0, a, l) : (n.fillStyle = i.backgroundColor, n.fillRect(0, 0, a, l));
    const w = r.interpolate(b);
    s.onEnterFrame && (n.save(), s.onEnterFrame(w), n.restore());
    for (let k = 0; k < o.length; k++)
      o[k].render(n, b);
    s.onExitFrame && (n.save(), s.onExitFrame(w), n.restore());
  }
  function g(b) {
    return (w) => d(h.create(b, w));
  }
  return {
    list: o,
    setSize: c,
    getCanvas: () => t,
    getContext: () => n,
    add: d,
    clear: f,
    render: m,
    addArrow: g(xt),
    addArcSegment: g(Gt),
    addBezierCurve: g(qt),
    addBezierSegment: g(Wt),
    addCircle: g(jt),
    addContainer: g(Xt),
    addCube: g(Zt),
    addCurve: g(Kt),
    addCurveSegment: g(Vt),
    addGear: g(te),
    addGrid: g(ee),
    addHeart: g(se),
    addIsobox: g(ie),
    addLine: g(re),
    addOval: g(ne),
    addPath: g(oe),
    addPoly: g(ae),
    addRay: g(le),
    addRaySegment: g(he),
    addRect: g(ue),
    addSegment: g(ce),
    addSpiral: g(fe),
    addStar: g(de),
    addText: g(ge)
  };
}
const Z = {
  backgroundColor: "#ffffff",
  lineWidth: 1,
  strokeStyle: "#000000",
  fillStyle: "#000000",
  lineCap: "round",
  lineJoin: "round",
  lineDash: [],
  miterLimit: 10,
  shadowColor: null,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  globalAlpha: 1,
  translationX: 0,
  translationY: 0,
  shake: 0,
  blendMode: "source-over"
};
function be() {
  const e = { ...Z };
  return e.reset = function() {
    Object.assign(this, Z), this.lineDash = [];
  }, e;
}
const C = {
  canvasWidth: 400,
  canvasHeight: 400,
  duration: 2,
  fps: 30,
  maxColors: 256,
  mode: "bounce",
  easing: !0,
  quality: 10
};
function ye(e, t = {}) {
  const i = { ...C, ...t }, r = be(), s = It();
  s.setMode(i.mode), s.setEasing(i.easing);
  const n = { onEnterFrame: null, onExitFrame: null }, a = me({
    canvas: e,
    styles: r,
    interpolation: s,
    hooks: n,
    width: i.canvasWidth,
    height: i.canvasHeight
  }), l = pt(), o = Nt();
  l.setSize(i.canvasWidth, i.canvasHeight), l.setMaxColors(i.maxColors), l.setFPS(i.fps), l.setQuality(i.quality);
  let h = null;
  const u = lt({
    onStart() {
      h?.onStart?.();
    },
    onRender(c) {
      h?.onRender?.(c), a.render(c), l.isEncoding() ? l.addFrame(a.getContext()) : o.isEncoding() && o.addFrame(a.getCanvas());
    },
    onComplete() {
      if (h?.onComplete?.(), l.isEncoding()) {
        l.complete();
        const c = l.getDataURL();
        c && h?.onGifReady?.(c, f.w, f.h);
      } else if (o.isEncoding()) {
        o.complete();
        const c = o.getDataURL();
        h?.onSpriteSheetReady?.(c, o.getSpriteSheetSize());
      }
    }
  });
  u.setDuration(i.duration), u.setFPS(i.fps);
  function d(c, m) {
    e.width = c, e.height = m, a.setSize(c, m), l.setSize(c, m), f.w = c, f.h = m;
  }
  const f = {
    canvas: e,
    context: a.getContext(),
    color: Bt,
    styles: r,
    renderList: a,
    scheduler: u,
    encoder: l,
    spriteSheet: o,
    w: i.canvasWidth,
    h: i.canvasHeight,
    onEnterFrame: null,
    onExitFrame: null,
    loop: () => u.loop(),
    playOnce: () => u.playOnce(),
    stop: () => u.stop(),
    toggleLoop() {
      u.isRunning() ? u.stop() : u.loop();
    },
    size: d,
    reset() {
      a.clear(), this.setDuration(C.duration), this.setFPS(C.fps), this.setMaxColors(C.maxColors), this.setMode(C.mode), this.setEasing(C.easing), this.size(i.canvasWidth, i.canvasHeight), r.reset(), this.onEnterFrame = null, this.onExitFrame = null, n.onEnterFrame = null, n.onExitFrame = null;
    },
    setDuration: (c) => u.setDuration(c),
    setFPS(c) {
      u.setFPS(c), l.setFPS(c);
    },
    setMaxColors: (c) => l.setMaxColors(c),
    setMode: (c) => s.setMode(c),
    setEasing: (c) => s.setEasing(c),
    setQuality: (c) => l.setQuality(c),
    makeGif() {
      l.start(), u.playOnce();
    },
    makeSpriteSheet(c) {
      o.start(u.getFPS(), u.getDuration(), this.w, this.h, c), o.isEncoding() && u.playOnce();
    },
    captureStill() {
      return u.stop(), e.toDataURL();
    },
    setStatusListener(c) {
      h = c;
    },
    destroy() {
      u.stop(), h = null;
    }
  };
  return Object.defineProperty(f, "onEnterFrame", {
    get: () => n.onEnterFrame,
    set: (c) => {
      n.onEnterFrame = c;
    },
    enumerable: !0
  }), Object.defineProperty(f, "onExitFrame", {
    get: () => n.onExitFrame,
    set: (c) => {
      n.onExitFrame = c;
    },
    enumerable: !0
  }), d(i.canvasWidth, i.canvasHeight), f;
}
export {
  Bt as Color,
  ye as createGLC
};
//# sourceMappingURL=index.js.map
