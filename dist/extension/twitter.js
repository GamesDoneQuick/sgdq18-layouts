'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const twemoji = require("twemoji");
const io = require("socket.io-client");
// Ours
const nodecgApiContext = require("./util/nodecg-api-context");
const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:twitter`);
const tweets = nodecg.Replicant('tweets', { defaultValue: [] });
// Clear queue of tweets when currentRun changes
nodecg.Replicant('currentRun').on('change', (newVal, oldVal) => {
    if (oldVal && newVal.pk !== oldVal.pk) {
        tweets.value = [];
    }
});
nodecg.listenFor('acceptTweet', (tweet) => {
    if (!nodecg.bundleConfig.twitter.debug) {
        removeTweetById(tweet.id_str);
    }
    nodecg.sendMessage('showTweet', tweet);
});
nodecg.listenFor('rejectTweet', removeTweetById);
const socket = io.connect(nodecg.bundleConfig.twitter.websocketUrl);
socket.on('connect', () => {
    socket.on('authenticated', () => {
        log.info('Twitter socket authenticated.');
    });
    socket.on('unauthorized', (err) => {
        log.error('There was an error with the authentication:', (err && err.message) ? err.message : err);
    });
    socket.on('twitter-webhook-payload', (payload) => {
        // `payload` will be an object in the format described here:
        // https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/account-activity-data-objects
        if (!payload) {
            return;
        }
        if (payload.favorite_events) {
            payload.favorite_events.forEach(favoriteEvent => {
                if (favoriteEvent.favorited_status) {
                    addTweet(favoriteEvent.favorited_status);
                }
            });
        }
        if (payload.tweet_create_events) {
            payload.tweet_create_events.forEach(tweetCreateEvent => {
                // We discard quoted statuses because we can't show them.
                if (tweetCreateEvent.quoted_status) {
                    return;
                }
                if (tweetCreateEvent.retweeted_status) {
                    const retweetedStatus = tweetCreateEvent.retweeted_status;
                    retweetedStatus.gdqRetweetId = tweetCreateEvent.id_str;
                    addTweet(retweetedStatus);
                    return;
                }
                // We discard @ replies because we don't want to show them.
                if (tweetCreateEvent.text.charAt(0) === '@') {
                    return;
                }
                addTweet(tweetCreateEvent);
            });
        }
    });
    socket.emit('authentication', { preSharedKey: nodecg.bundleConfig.twitter.preSharedKey });
});
/**
 * Adds a Tweet to the queue.
 * @param tweet - The tweet to add.
 */
function addTweet(tweet) {
    // Reject tweets with media.
    if (tweet.extended_tweet && tweet.extended_tweet.entities.media.length > 0) {
        return;
    }
    // Don't add the tweet if we already have it
    const isDupe = tweets.value.find((t) => t.id_str === tweet.id_str);
    if (isDupe) {
        return;
    }
    // Parse emoji.
    tweet.text = twemoji.parse(tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text);
    // Replace newlines with spaces
    tweet.text = tweet.text.replace(/\n/ig, ' ');
    // Highlight the #SGDQ2018 hashtag.
    tweet.text = tweet.text.replace(/#sgdq2018/ig, '<span class="hashtag">#SGDQ2018</span>');
    // Add the tweet to the list
    tweets.value.push(tweet);
}
/**
 * Removes a Tweet (by id) from the queue.
 * @param idToRemove - The ID string of the Tweet to remove.
 * @returns The removed tweet. "Undefined" if tweet not found.
 */
function removeTweetById(idToRemove) {
    if (typeof idToRemove !== 'string') {
        throw new Error(`[twitter] Must provide a string ID when removing a tweet. ID provided was: ${idToRemove}`);
    }
    let didRemoveTweet = false;
    tweets.value.some((tweet, index) => {
        if (tweet.id_str === idToRemove || tweet.gdqRetweetId === idToRemove) {
            tweets.value.splice(index, 1);
            didRemoveTweet = true;
            return true;
        }
        return false;
    });
    return didRemoveTweet;
}
//# sourceMappingURL=twitter.js.map