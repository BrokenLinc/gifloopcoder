export interface ByteSink {
    writeByte(v: number): void;
    writeBytes(arr: ArrayLike<number>, offset?: number, length?: number): void;
}
export declare class LZWEncoder {
    private width;
    private height;
    private pixels;
    private initCodeSize;
    private accum;
    private htab;
    private codetab;
    private cur_accum;
    private cur_bits;
    private a_count;
    private free_ent;
    private maxcode;
    private clear_flg;
    private g_init_bits;
    private ClearCode;
    private EOFCode;
    private n_bits;
    private remaining;
    private curPixel;
    constructor(width: number, height: number, pixels: ArrayLike<number>, colorDepth: number);
    encode(outs: ByteSink): void;
    private MAXCODE;
    private nextPixel;
    private char_out;
    private flush_char;
    private cl_block;
    private cl_hash;
    private compress;
    private output;
}
//# sourceMappingURL=LZWEncoder.d.ts.map