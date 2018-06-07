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

		accept() {
			nodecg.sendMessage('acceptTweet', this.value);
		}

		reject() {
			nodecg.sendMessage('rejectTweet', this.value.id_str);
		}
	}

	customElements.define(TweetItem.is, TweetItem);
})();
