import { TsTrace } from "index";

describe(`ts-trace test suite`, () => {
    test(`B / returned E`, (done) => {
        const ts_trace = new TsTrace();
        const { E } = ts_trace.B({ name: `name`, cat: [`cat`] });
        E();
        ts_trace.close();
        const chunks: Uint8Array[] = [];
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`data`, (chunk) => {
            chunks.push(chunk);
        });
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`close`, () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = JSON.parse(Buffer.concat(chunks).toString());
            const length = Array.isArray(result) ? result.length : 0;
            expect(result).toMatchSnapshot(
                new Array(length).fill({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ts: expect.any(Number),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    pid: expect.any(Number),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    tid: expect.any(Number),
                }),
            );
            done();
        });
    });

    test(`B / E no cat`, (done) => {
        const ts_trace = new TsTrace();
        const { pid } = ts_trace.B({ name: `name` });
        ts_trace.E({ pid });
        ts_trace.close();
        const chunks: Uint8Array[] = [];
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`data`, (chunk) => {
            chunks.push(chunk);
        });
        // @ts-expect-error // testing private field
        ts_trace._stream.on(`close`, () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = JSON.parse(Buffer.concat(chunks).toString());
            const length = Array.isArray(result) ? result.length : 0;
            expect(result).toMatchSnapshot(
                new Array(length).fill({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ts: expect.any(Number),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    pid: expect.any(Number),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    tid: expect.any(Number),
                }),
            );
            done();
        });
    });
});
