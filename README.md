# Google's Trace Event format tracer written in Typescript for NodeJS

[![Build Status](https://app.travis-ci.com/haoadoresorange/ts-trace-event.svg?branch=main)](https://app.travis-ci.com/haoadoresorange/ts-trace-event)

[![NPM](https://nodei.co/npm/ts-trace-event.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ts-trace-event/)

Implemented as a wrapper of NodeJS Readable stream

### Installation
`yarn add ts-trace-event`

### Usage
```typescript
import { TsTrace } from "ts-trace-event";
const tracer = new TsTrace();
tracer.pipe(process.stdin);

const { pid, E } = tracer.B({ name: `name`, cat: [`cat`] });
doSomething();
E(); //or
tracer.E({ name: `another-name`, cat: [`another-cat`], pid });
tracer.close();
```