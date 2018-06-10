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

				this._queue.add(() => {
					return this._promisifyTimeline(this.$.tweet.playItem(tweet))
				});
			});

			nodecg.listenFor('showFanart', fanartTweet => {
				if (this.$.fanart.canExtend) {
					this.$.fanart.playItem(fanartTweet);
					return;
				}

				this._queue.add(() => {
					return this._promisifyTimeline(this.$.fanart.playItem(fanartTweet));
				});
			});
		}

		_promisifyTimeline(tl) {
			return new Promise(resolve => {
				tl.call(resolve, null, null, '+=0.03');
			});
		}
	}

	customElements.define(GdqBreak.is, GdqBreak);
})();
