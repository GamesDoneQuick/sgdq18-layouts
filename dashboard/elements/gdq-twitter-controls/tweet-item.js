(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class TweetItem extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'tweet-item';
		}

		static get properties() {
			return {
				value: {
					type: Object
				}
			};
		}

		computePhotoOrPhotos(numPhotos) {
			return numPhotos > 1 ? 'photos' : 'photo';
		}

		computeIndexPlusOne(index) {
			return index + 1;
		}

		accept() {
			nodecg.sendMessage('acceptTweet', this.value);
		}

		reject() {
			nodecg.sendMessage('rejectTweet', this.value.id_str);
		}
	}

	customElements.define(TweetItem.is, TweetItem);
})();
