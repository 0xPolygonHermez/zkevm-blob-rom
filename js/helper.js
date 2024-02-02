const { F1Field } = require("ffjavascript");

module.exports = class myHelper {
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
};