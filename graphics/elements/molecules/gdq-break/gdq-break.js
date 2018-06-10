/* global PQueue */
(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreak extends Polymer.Element {
		static get is() {
			return 'gdq-break';
		}

		static get properties() {
			return {
				_queue: {
					type: PQueue,
					value() {
						return new PQueue({concurrency: 1});
					}
				}
			};
		}

		ready() {
			super.ready();
			this.$.tweet.companionElement = this.$.prizes;
			this.$.fanart.companionElement = [
				this.$.bids,
				this.$.prizes
			];

			nodecg.listenFor('showTweet', tweet => {
				if (this.$.tweet.canExtend) {
					this.$.tweet.playItem(tweet);
					return;
				}

				this._queue.add(() => this._promisifyTimeline(this.$.tweet.playItem(tweet)));
				this._queue.add(() => {
					return Promise.resolve().then(() => {
						console.log('queue empty');
					});
				});
			});

			nodecg.listenFor('showFanart', fanartTweet => {
				if (this.$.fanart.canExtend) {
					this.$.fanart.playItem(fanartTweet);
					return;
				}

				this._queue.add(() => this._promisifyTimeline(this.$.fanart.playItem(fanartTweet)));
				this._queue.add(() => {
					return Promise.resolve().then(() => {
						console.log('queue empty');
					});
				});
			});
		}

		_promisifyTimeline(tl) {
			return new Promise(resolve => {
				tl.call(resolve);
			});
		}
	}

	customElements.define(GdqBreak.is, GdqBreak);
})();
