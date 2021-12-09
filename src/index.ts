import { Readable, Writable } from "stream";
import { performance } from "perf_hooks";

type TraceFormat = `Array`; // TODO: support also Object format
type Event = {
    name: string;
    cat: string;
    ph: string;
    ts: number;
    tts?: number;
    pid: number;
    tid: number; // === pid in node
    args?: unknown;
    cname?: string;
};

type EventProps = Pick<Event, `name` | `args` | `cname`> & { cat?: string[] };

const parseCat = (cat: EventProps[`cat`] = [`default`]): Event[`cat`] => {
    return cat.join(`,`);
};

const newBaseEvent = (apid?: Event[`pid`]): Pick<Event, `ts` | `pid` | `tid`> => {
    const pid = apid || process.pid;
    return {
        ts: performance.now(),
        pid,
        tid: pid,
    };
};

const newEvent = (
    event_props: EventProps & {
        ph: Event[`ph`];
        pid?: Event[`pid`];
    },
): Event => {
    return {
        ...event_props,
        ...newBaseEvent(event_props.pid),
        cat: parseCat(event_props.cat),
    };
};

export class TsTrace {
    private _stream = new Readable({
        read() {
            // Required implementation
        },
    });
    private _push = (() => {
        let is_first_event = true;
        return (e: Event | Pick<Event, `pid` | `tid` | `ts`>) => {
            let s = ``;
            if (is_first_event) {
                s += `[`;
                is_first_event = false;
            } else {
                s += `,\n`;
            }
            s += JSON.stringify(e);
            this._stream.push(s, `utf8`);
        };
    })();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor(private _trace_format: TraceFormat = `Array`) {}

    public pipe(destination: Writable): Writable {
        this._stream.pipe(destination);
        return destination;
    }

    public close(): void {
        this._stream.push(`]`, `utf8`);
        this._stream.push(null);
    }

    public B(event_props: EventProps): {
        pid: Event[`pid`];
        E: (e_event_props?: Partial<EventProps>) => void;
    } {
        const pid = process.pid;
        this._push(newEvent({ ...event_props, ph: `B`, pid }));
        return {
            pid,
            E: (e_event_props) =>
                this.E({
                    ...e_event_props,
                    pid,
                }),
        };
    }

    public E(event_props: Partial<EventProps> & { pid: number }): void {
        this._push({
            ...event_props,
            ph: `E`,
            ...newBaseEvent(event_props.pid),
        });
    }
}
