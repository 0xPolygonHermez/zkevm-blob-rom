module.exports = class myHelper {
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
        return ctx.FrBLS12_381.inv(a);
    }
};