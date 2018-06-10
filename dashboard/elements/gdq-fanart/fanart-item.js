(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class FanartItem extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'fanart-item';
		}

		static get properties() {
			return {
				value: {
					type: Object
				}
			};
		}

		preview() {
			this.dispatchEvent(new CustomEvent('preview'));
		}

		accept() {
			nodecg.sendMessage('acceptFanart', this.value);
		}

		reject() {
			nodecg.sendMessage('rejectTweet', this.value.id_str);
		}

		_calcIndicatorHidden(tweetMedia) {
			return !tweetMedia || !Array.isArray(tweetMedia) || tweetMedia.length <= 1;
		}
	}

	customElements.define(FanartItem.is, FanartItem);
})();
