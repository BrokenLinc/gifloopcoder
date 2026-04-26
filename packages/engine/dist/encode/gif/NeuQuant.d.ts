export declare class NeuQuant {
    private thepicture;
    private lengthcount;
    private samplefac;
    private network;
    private netindex;
    private bias;
    private freq;
    private radpower;
    constructor(thepic: any, len: number, sample: number);
    setMaxColors(maxColors: number): void;
    process(): number[];
    private colorMap;
    private inxbuild;
    private learn;
    map(b: number, g: number, r: number): number;
    private unbiasnet;
    private alterneigh;
    private altersingle;
    private contest;
}
//# sourceMappingURL=NeuQuant.d.ts.map