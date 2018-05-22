export declare class Run {
    category: string;
    commentators: string;
    console: string;
    coop: boolean;
    estimate: string;
    id: number;
    longName: string;
    name: string;
    notes: string;
    order: number;
    pk: number;
    releaseYear: string | number | null;
    runners: Runner[];
    setupTime: string;
    type: 'run';
    originalValues?: Partial<Run>;
}
export declare class Runner {
    name: string | undefined;
    stream: string | undefined;
}
