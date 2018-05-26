export interface Tweet {
    id_str: string;
    truncated: boolean;
    text: string;
    extended_tweet?: {
        full_text: string;
        entities: TweetEntities;
    };
    gdqRetweetId?: string;
}
export interface TweetEntities {
    media: {
        [key: string]: any;
    }[];
}
export interface TwitterAccountActivityPayload {
    favorite_events?: TweetFavoriteEvents[];
    tweet_create_events?: TweetCreateEvents[];
}
export interface TweetFavoriteEvents extends Tweet {
    favorited_status: Tweet;
}
export interface TweetCreateEvents extends Tweet {
    quoted_status: Tweet;
    retweeted_status: Tweet;
}
