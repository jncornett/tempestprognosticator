'use strict';

class TestSuite {
    constructor() {
        this.cases = [];
    }
    add(name, fn) {
        this.cases.push({
            name: name,
            fn: fn
        });
    }
    run() {
        const results = {
            pass: [],
            fail: [],
            error: [],
            skip: []
        };
        for (const c of this.cases) {
            try {
                c.fn();
            } catch(err) {
                if (typeof(err) !== 'object' || err.type === undefined) {
                    results.error.push({error: err, testCase: c});
                } else {
                    results[err.type].push({error: err, testCase: c});
                }
                continue;
            }
            results.pass.push({testCase: c});
        }
        return results;
    }
    pass(msg) { throw {type: 'pass', msg: msg}; }
    fail(msg) { throw {type: 'fail', msg: msg}; }
    error(msg) { throw { type: 'error', msg: msg}; }
    skip(msg) { throw { type: 'skip', msg: msg}; }
}

const Test = new TestSuite;

function RunAllTests() {
    const results = Test.run();
    const ok = results.fail.length === 0 && results.error.length === 0;
    if (ok) {
        if (results.skip.length === 0) {
            console.log('OK!');
        } else {
            console.log('OK, ' + results.skip.length + ' tests skipped');
        }
    } else {
        console.log('FAILED');
        for (const r of results.fail) {
            console.log('test ' + r.testCase.name + ' failed with: ' + r.error.msg);
        }
        for (const r of results.error) {
            let msg = '';
            if (typeof(r.error) === 'object' && r.error.msg !== undefined) {
                msg = r.error.msg;
            } else {
                msg = r.error;
            }
            console.log('test ' + r.testCase.name + ' errored with: ' + msg);
        }
        throw 'test failed';
    }
}
