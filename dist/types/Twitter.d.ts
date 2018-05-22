export interface Tweet {
    id_str: string;
    extended_entities: {
        media: {
            [key: string]: any;
        }[];
    };
    truncated: boolean;
    text: string;
    full_text: string;
    gdqRetweetId?: string;
}
