/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
const fs = require("fs");
const path = require('path');
const chalk = require('chalk');
const zkasm = require('@0xpolygonhermez/zkasmcom');
const sm_main_blob = require('@0xpolygonhermez/zkevm-proverjs/src/sm/sm_main/sm_main');

const blob_empty_input = require('@0xpolygonhermez/zkevm-proverjs/test/inputs/input_executor_blob.json');

const { argv } = require('yargs')
    .usage("node run-tests-zkasm pathname")
    .help("h")
    .alias("v", "verbose")
    .alias("H", "helper");

const { compilePil, getTestFiles } = require('./helpers/helpers');

async function main() {
    // Compile pil
    console.log(chalk.yellow('--> Compile PIL'));
    const cmPols = await compilePil();

    // Get all zkasm files
    const pathZkasm = path.join(__dirname, '..', process.argv[2]);
    const files = await getTestFiles(pathZkasm);

    let wasFailed = false;
    // Run all zkasm files
    // eslint-disable-next-line no-restricted-syntax
    console.log(chalk.yellow('--> Start running zkasm files'));
    for (const file of files) {

        if (file.includes('ignore')) {
          continue;
        }

        if (await runTest(file, cmPols) == 1) {
            wasFailed = true;
        }
    }
    if (wasFailed) {
        process.exit(1);
    }
}

// returns true if test succeed and false if test failed
async function runTest(pathTest, cmPols) {
    // Compile rom
    const configZkasm = {
        defines: [],
        allowUndefinedLabels: true,
        allowOverwriteLabels: true,
    };

    const config = {
        debug: true,
        stepsN: 8388608,
        assertOutputs: false,
        blob: true,
        debugInfo: {
            inputName: 'input',
        },
    };

    // Add custom helpers
    let helpers = argv.helper ?? [];
    if (!Array.isArray(helpers)) {
        helpers = [helpers];
    }
    if (helpers.length) {
        config.helpers = [];
        for (const helper of helpers) {
            const helperFile = fs.existsSync(helper) ? helper : pathZkasm + '/' + helper;
            if (!fs.existsSync(helperFile)) {
                throw new Error(`Not found helper on ${helper} or ${helperFile}`);
            }
            const fullPathHelper = path.resolve(helperFile);
            const clhelper = require(fullPathHelper);
            config.helpers.push(new clhelper());
        }
    }

    let failed = false;
    // execute zkasm tests
    try {
        console.log(chalk.blue('   --> start'), pathTest);
        const rom = await zkasm.compile(pathTest, null, configZkasm);
        const result = await sm_main_blob.execute(cmPols.Main, blob_empty_input, rom, config);
        console.log(chalk.green('   --> pass'), pathTest);
        if (argv.verbose) {
            console.log(chalk.blue('   --> verbose'));
            console.log(chalk.blue('        --> counters'));
            console.log(result.counters);
            console.log(chalk.blue('        --> outputs'));
            console.log(result.output);
            console.log(chalk.blue('        --> logs'));
            console.log(result.logs);
        }
    } catch (e) {
        console.log(chalk.red('   --> fail'), pathTest);
        console.log(e);
        failed = true;
    }

    return failed;
}

main();
