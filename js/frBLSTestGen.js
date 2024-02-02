const { F1Field } = require("ffjavascript");

const FrBLS12_381 = new F1Field(52435875175126190479447740508185965837690552500527637822603658699938581184513n);
const ops = ["add", "sub", "mul", "square", "inv", "reduce", "expBy4096"];
const nTests = 10;

function genRandomInOut(opname) {
    const x = FrBLS12_381.random();
    const y = FrBLS12_381.random();
    let z;
    switch (opname) {
        case "add":
            z = FrBLS12_381.add(x, y);
            console.log(`\t${x}n => A\n\t${y}n => C\n\t:CALL(${opname}FrBLS12381)\n\tC => A\n\t${z}n\t:ASSERT\n`);
            break;
        case "sub":
            z = FrBLS12_381.sub(x, y);
            console.log(`\t${x}n => A\n\t${y}n => C\n\t:CALL(${opname}FrBLS12381)\n\tC => A\n\t${z}n\t:ASSERT\n`);
            break;
        case "mul":
            z = FrBLS12_381.mul(x, y);
            console.log(`\t${x}n => A\n\t${y}n => B\n\t:CALL(${opname}FrBLS12381)\n\tC => A\n\t${z}n\t:ASSERT\n`);
            break;
        case "square":
            z = FrBLS12_381.square(x);
            console.log(`\t${x}n => A\n\t:CALL(${opname}FrBLS12381)\n\t${z}n\t:ASSERT\n`);
            break;
        case "inv":
            z = FrBLS12_381.inv(x);
            console.log(`\t${x}n => A\n\t:CALL(${opname}FrBLS12381)\n\t${z}n\t:ASSERT\n`);
            break;
        case "reduce":
            z = FrBLS12_381.mod(x, FrBLS12_381.p);
            console.log(`\t${x}n => A\n\t:CALL(${opname}FrBLS12381)\n\t${z}n\t:ASSERT\n`);
            break;
        case "expBy4096":
            z = FrBLS12_381.exp(x, 4096n);
            console.log(`\t${x}n => A\n\t:CALL(${opname}FrBLS12381)\n\t${z}n\t:ASSERT\n`);
            break;
        default:
            throw new Error("Invalid opname");
    }
}

let values = [];
for (const opname of ops) {
    for (let i = 0; i < nTests; i++) {
        const test = genRandomInOut(opname);
        values.push(test);
    }
}