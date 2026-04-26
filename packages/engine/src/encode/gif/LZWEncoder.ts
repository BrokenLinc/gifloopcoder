/* eslint-disable */
/*
 * LZWEncoder.js — ported to TypeScript.
 * Authors: Kevin Weiner, Thibault Imbert, Johan Nordberg.
 */

const EOF = -1;
const BITS = 12;
const HSIZE = 5003;
const masks = [
  0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff,
  0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff,
];

export interface ByteSink {
  writeByte(v: number): void;
  writeBytes(arr: ArrayLike<number>, offset?: number, length?: number): void;
}

export class LZWEncoder {
  private width: number;
  private height: number;
  private pixels: ArrayLike<number>;
  private initCodeSize: number;
  private accum = new Uint8Array(256);
  private htab = new Int32Array(HSIZE);
  private codetab = new Int32Array(HSIZE);
  private cur_accum = 0;
  private cur_bits = 0;
  private a_count = 0;
  private free_ent = 0;
  private maxcode = 0;
  private clear_flg = false;
  private g_init_bits = 0;
  private ClearCode = 0;
  private EOFCode = 0;
  private n_bits = 0;
  private remaining = 0;
  private curPixel = 0;

  constructor(width: number, height: number, pixels: ArrayLike<number>, colorDepth: number) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.initCodeSize = Math.max(2, colorDepth);
  }

  encode(outs: ByteSink): void {
    outs.writeByte(this.initCodeSize);
    this.remaining = this.width * this.height;
    this.curPixel = 0;
    this.compress(this.initCodeSize + 1, outs);
    outs.writeByte(0);
  }

  private MAXCODE(n_bits: number): number {
    return (1 << n_bits) - 1;
  }

  private nextPixel(): number {
    if (this.remaining === 0) return EOF;
    --this.remaining;
    const pix = this.pixels[this.curPixel++];
    return pix & 0xff;
  }

  private char_out(c: number, outs: ByteSink): void {
    this.accum[this.a_count++] = c;
    if (this.a_count >= 254) this.flush_char(outs);
  }

  private flush_char(outs: ByteSink): void {
    if (this.a_count > 0) {
      outs.writeByte(this.a_count);
      outs.writeBytes(this.accum, 0, this.a_count);
      this.a_count = 0;
    }
  }

  private cl_block(outs: ByteSink): void {
    this.cl_hash(HSIZE);
    this.free_ent = this.ClearCode + 2;
    this.clear_flg = true;
    this.output(this.ClearCode, outs);
  }

  private cl_hash(hsize: number): void {
    for (let i = 0; i < hsize; ++i) this.htab[i] = -1;
  }

  private compress(init_bits: number, outs: ByteSink): void {
    let fcode: number;
    let c: number;
    let i: number;
    let ent: number;
    let disp: number;
    let hsize_reg: number;
    let hshift: number;

    this.g_init_bits = init_bits;
    this.clear_flg = false;
    this.n_bits = this.g_init_bits;
    this.maxcode = this.MAXCODE(this.n_bits);
    this.ClearCode = 1 << (init_bits - 1);
    this.EOFCode = this.ClearCode + 1;
    this.free_ent = this.ClearCode + 2;
    this.a_count = 0;
    ent = this.nextPixel();
    hshift = 0;
    for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
    hshift = 8 - hshift;
    hsize_reg = HSIZE;
    this.cl_hash(hsize_reg);
    this.output(this.ClearCode, outs);

    outer_loop: while ((c = this.nextPixel()) != EOF) {
      fcode = (c << BITS) + ent;
      i = (c << hshift) ^ ent;
      if (this.htab[i] === fcode) {
        ent = this.codetab[i];
        continue;
      } else if (this.htab[i] >= 0) {
        disp = hsize_reg - i;
        if (i === 0) disp = 1;
        do {
          if ((i -= disp) < 0) i += hsize_reg;
          if (this.htab[i] === fcode) {
            ent = this.codetab[i];
            continue outer_loop;
          }
        } while (this.htab[i] >= 0);
      }
      this.output(ent, outs);
      ent = c;
      if (this.free_ent < 1 << BITS) {
        this.codetab[i] = this.free_ent++;
        this.htab[i] = fcode;
      } else {
        this.cl_block(outs);
      }
    }
    this.output(ent, outs);
    this.output(this.EOFCode, outs);
  }

  private output(code: number, outs: ByteSink): void {
    this.cur_accum &= masks[this.cur_bits];
    if (this.cur_bits > 0) this.cur_accum |= code << this.cur_bits;
    else this.cur_accum = code;
    this.cur_bits += this.n_bits;
    while (this.cur_bits >= 8) {
      this.char_out(this.cur_accum & 0xff, outs);
      this.cur_accum >>= 8;
      this.cur_bits -= 8;
    }
    if (this.free_ent > this.maxcode || this.clear_flg) {
      if (this.clear_flg) {
        this.maxcode = this.MAXCODE((this.n_bits = this.g_init_bits));
        this.clear_flg = false;
      } else {
        ++this.n_bits;
        if (this.n_bits == BITS) this.maxcode = 1 << BITS;
        else this.maxcode = this.MAXCODE(this.n_bits);
      }
    }
    if (code == this.EOFCode) {
      while (this.cur_bits > 0) {
        this.char_out(this.cur_accum & 0xff, outs);
        this.cur_accum >>= 8;
        this.cur_bits -= 8;
      }
      this.flush_char(outs);
    }
  }
}
