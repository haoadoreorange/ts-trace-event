# Google's Trace Event format tracer written in Typescript for NodeJS

Implemented as a wrapper of NodeJS Readable stream

### Installation
`yarn add ts-trace-event`

### Usage
```typescript
import { TsTrace } from "index";
const ts_trace = new TsTrace();
ts_trace.pipe(process.stdin);

const { pid, E } = ts_trace.B({ name: `name`, cat: [`cat`] });
doSomething();
E(); //or
ts_trace.E({ name: `another-name`, cat: [`another-cat`], pid });
ts_trace.close();
```