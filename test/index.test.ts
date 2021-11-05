import { TsTrace } from "index";

describe(`ts-trace test suite`, () => {
    const expected = JSON.stringify([
        { name: `name`, cat: `cat`, ph: `B`, pid: 1908261, ts: 1897.4071798324585, tid: 1908261 },
        { pid: 1908261, ph: `E`, ts: 1897.5370936393738, tid: 1908261 },
    ]);
    test(`B / returned E`, (done) => {
        const ts_trace = new TsTrace();
        let result = ``;
        const { E } = ts_trace.B({ name: `name`, cat: [`cat`] });
        E();
        ts_trace.close();
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`data`, (data) => {
            result = result + Buffer.from(data).toString();
        });
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`close`, () => {
            console.log(result);
            // TODO: More accurate regex
            expect(result).toMatch(/({.+})+/);
            done();
        });
    });

    test(`B / E`, (done) => {
        const ts_trace = new TsTrace();
        let result = ``;
        const { pid } = ts_trace.B({ name: `name`, cat: [`cat`] });
        ts_trace.E({ pid });
        ts_trace.close();
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`data`, (data) => {
            result = result + Buffer.from(data).toString();
        });
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`close`, () => {
            console.log(result);
            // TODO: More accurate regex
            expect(result).toMatch(/({.+})+/);
            done();
        });
    });
});
