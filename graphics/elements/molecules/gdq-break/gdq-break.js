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

			this._setupInterrupt({
				messageName: 'showTweet',
				interruptElement: this.$.tweet
			});

			this._setupInterrupt({
				messageName: 'showFanart',
				interruptElement: this.$.fanart
			});
		}

		_setupInterrupt({messageName, interruptElement}) {
			let queued = false;
			let queue = [];
			nodecg.listenFor(messageName, payload => {
				if (interruptElement.canExtend) {
					interruptElement.playItem(payload);
					return;
				}

				if (queued) {
					queue.push(payload);
				} else {
					queued = true;
					this._queue.add(async () => {
						interruptElement.addEventListener('can-extend', () => {
							queue.forEach(queuedFanart => {
								interruptElement.playItem(queuedFanart);
							});
							queued = false;
							queue = [];
						}, {once: true, passive: true});
						return this._promisifyTimeline(interruptElement.playItem(payload));
					});
				}
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
