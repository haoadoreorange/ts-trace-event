import { TsTrace } from "index";

describe(`ts-trace test suite`, () => {
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

    test(`B / E no cat`, (done) => {
        const ts_trace = new TsTrace();
        let result = ``;
        const { pid } = ts_trace.B({ name: `name` });
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
