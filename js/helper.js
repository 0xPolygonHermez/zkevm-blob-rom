const { F1Field } = require("ffjavascript");
const rootsOfUnity4096 = require("./rootsOfUnity4096.json");

module.exports = class myHelper {
    blobSize = 4096;

    constructor() {
        this.FrBLS12_381 = new F1Field(0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n);
    }

    setup(props) {
        for (const name in props) {
            this[name] = props[name];
        }
    }

    /**
     * Computes the inverse of the given element of the BLS12-381 scalar field.
     * @param ctx - Context.
     * @param tag - Tag.
    */
    eval_frBLS12_381inv(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a = this.evalCommand(ctxFullFe, tag.params[0]);
        return this.FrBLS12_381.inv(a);
    }

    /**
     * Checks if the given element of the BLS12-381 scalar field is a 4096-th root of unity.
     * @param ctx - Context.
     * @param tag - Tag.
    */
    eval_check4096Root(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const z = this.evalCommand(ctxFullFe, tag.params[0]);

        for (let i = 0; i < this.blobSize; i++) {
            const rooti = BigInt(rootsOfUnity4096[i]);
            if (z === rooti) {
                ctx["BLS12_381Root"] = {z, index: i};
                return 1n;
            }
        }
        return 0n;
    }

    /**
     * Returns the index of the given element of the BLS12-381 scalar field if it is a 4096-th root of unity.
     * @param ctx - Context.
     * @param tag - Tag.
    */
    eval_get4096RootIndex(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const z = this.evalCommand(ctxFullFe, tag.params[0]);

        if (ctx["BLS12_381Root"]?.z === z) {
            return ctx["BLS12_381Root"].index;
        }

        for (let i = 0; i < this.blobSize; i++) {
            const rooti = BigInt(rootsOfUnity4096[i]);
            if (z === rooti) {
                return i;
            }
        }
        throw new Error("Root not found");
    }
};