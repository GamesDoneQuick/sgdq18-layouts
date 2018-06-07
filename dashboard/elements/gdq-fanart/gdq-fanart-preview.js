(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqFanartPreview extends Polymer.Element {
		static get is() {
			return 'gdq-fanart-preview';
		}

		static get properties() {
			return {
				opened: {
					type: Boolean,
					reflectToAttribute: true,
					value: false
				},
				_tweet: Object,
				_currentImageIndex: {
					type: Number,
					value: 0
				}
			};
		}

		ready() {
			super.ready();

			// Close when the background is clicked on.
			this.addEventListener('click', event => {
				if (event.path[0] === this) {
					this.close();
				}
			});
		}

		open(tweet) {
			this.opened = true;
			this._currentImageIndex = 0;
			this._tweet = tweet;
			document.body.style.overflow = 'hidden';
		}

		close() {
			this.opened = false;
			document.body.style.overflow = '';
		}

		previous() {
			if (this._currentImageIndex <= 0) {
				this._currentImageIndex = 0;
			} else {
				this._currentImageIndex--;
			}
		}

		next() {
			if (!this._tweet || !this._tweetHasMedia(this._tweet)) {
				return;
			}

			const media = this._tweet.gdqMedia;
			const maxIndex = media.length - 1;
			if (this._currentImageIndex >= maxIndex) {
				this._currentImageIndex = maxIndex;
			} else {
				this._currentImageIndex++;
			}
		}

		_calcImageSrc(tweet, currentImageIndex) {
			if (!this._tweetHasMedia(tweet)) {
				return;
			}

			return tweet.gdqMedia[currentImageIndex].media_url_https;
		}

		_tweetHasMedia(tweet) {
			return tweet && tweet.gdqMedia;
		}

		_calcPreviousDisabled(currentImageIndex) {
			return currentImageIndex <= 0;
		}

		_calcNextDisabled(tweet, currentImageIndex) {
			if (!tweet || !this._tweetHasMedia(tweet)) {
				return true;
			}

			const maxIndex = this._tweet.gdqMedia.length - 1;
			return currentImageIndex >= maxIndex;
		}
	}

	customElements.define(GdqFanartPreview.is, GdqFanartPreview);
})();
