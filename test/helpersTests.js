const assert = require("chai").assert;

const myHelper = require("../js/helper.js");
const rootsOfUnity4096 = require("../js/rootsOfUnity4096.json");
const nTests = 100;

describe("Test blob helpers", async function () {
    this.timeout(10000000);

    let F;
    let helper;
    let ctx = {};
    let tag = {};

    before(async () => {
        helper = new myHelper();
        helper.setup({evalCommand})
        F = helper.FrBLS12_381;
    });

    it("It should check the correctness of the eval_frBLS12_381inv()", async () => {
        const inputs = [
            36352282618862064312344324462724268103148830853479618821175253459242643804113n,
            35846929875740879447400987543444976059055893769953225484216656739235800564611n,
            50020617611673705300370761515759864260250156195967325776310170367679413455137n,
            30884067678520913302639368809110275492207567833686475840074738068203473902410n,
            8500663844753221606692665560060555020794313965577564809043556418944359958845n,
            16159670288449241526569736422031572724602743160175337949888255582949277214952n,
            39165106505733080812504661511510975551172019082759627636009743718144293684747n,
            22660678109068367867076534284078408171453944057142819580363542631358003438130n,
            15146461440849932442509747299667825440372149850236476720557689625175254050988n,
            36102585227255454163943247349502189423763900796153650429312461282325457615520n,
        ];
        const inverses = [
            11424895913369466124362290998884431532865277338994086077415901915559151366169n,
            23350072860927159259251398340096263574253173719292772309120169848571556611236n,
            51866026426301005139815131357948855260390774446370854452455045269880910529806n,
            49743325602182550088103408433348826649465515568520203050314690171722992753129n,
            5093262953564691934053153273602808591834921325082067586624663667050048740832n,
            50510339063352491119066891967031185570635708523796633677751012076804454128396n,
            28180307937405665441571046445107532213552631120926763691855122672783109253659n,
            25447793879538241485473792454773227498813115964337706137804893221342946285768n,
            5340709793922026269137435773413656315541702060668080462589936326237872965112n,
            33580044322282237928434517485778616072400849169601178299255270706639388219849n,
        ];

        for (let i = 0; i < inputs.length; i++) {
            tag.params = [inputs[i]];
            let expected = inverses[i];
            let result = helper.eval_frBLS12_381inv(ctx, tag);
            assert.strictEqual(result, expected, `The result of the eval_frBLS12_381inv function is not correct. Diff: ${expected-result}`);
        }
    });

    describe("It should check the correctness of the eval_check4096Root()", async () => {
        it('It should verify the correspondence against the json file containing all the 4096-th roots of unity and the output', async () => {
            for (let i = 0; i < rootsOfUnity4096.length; i++) {
                tag.params = [BigInt(rootsOfUnity4096[i])];
                let result = helper.eval_check4096Root(ctx, tag);
                assert.equal(result, 1);
            }
        });

        it('It should fail if an input is not a 4096-th root of unity', async () => {
            let element = F.random();
            while (F.pow(element, 4096n) === 1n) {
                element = F.random();
            }

            tag.params = [element];
            let result = helper.eval_check4096Root(ctx, tag);
            assert.equal(result, 0);
        });
    });

    describe("It should check the correctness of the eval_get4096RootIndex()", async () => {
        it('It should directly return the index if z is found in the context', async () => {
            for (let i = 0; i < nTests; i++) {
                const index = Math.floor(Math.random() * rootsOfUnity4096.length);
                const z = BigInt(rootsOfUnity4096[index]);
                ctx["BLS12_381Root"] = {z, index};
                tag.params = [z];
                let result = helper.eval_get4096RootIndex(ctx, tag);
                assert.equal(result, index);
            }
        });

        it('If z is not found in the context, then it should look at the table of 4096-th roots of unity and return its index', async () => {
            for (let i = 0; i < nTests; i++) {
                const index = Math.floor(Math.random() * rootsOfUnity4096.length);
                const z = BigInt(rootsOfUnity4096[index]);
                tag.params = [z];
                let result = helper.eval_get4096RootIndex(ctx, tag);
                assert.equal(result, index);
            }
        });

        it('If z is not a root of unity, then it should fail', async () => {
            for (let i = 0; i < nTests; i++) {
                let element = F.random();
                while (F.pow(element, 4096n) === 1n) {
                    element = F.random();
                }

                tag.params = [element];
                assert.throws(() => helper.eval_get4096RootIndex(ctx, tag), "Root not found");
            }
        });
    });
});

// Mock function for evalCommand
function evalCommand(ctx, tag) {
    return tag;
}
