(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreakTopFrame extends Polymer.Element {
		static get is() {
			return 'gdq-break-top-frame';
		}

		ready() {
			super.ready();
			this.$.totalTextAmount.displayValueTransform = this._totalDisplayValueTransform.bind(this);

			nodecg.readReplicant('total', totalVal => {
				this.$.totalTextAmount.value = totalVal.raw;
				nodecg.listenFor('donation', this._handleDonation.bind(this));
			});

			nodecg.listenFor('total:manuallyUpdated', totalVal => {
				this.$.totalTextAmount.value = totalVal.raw;
			});
		}

		addDonationAlert(formattedAmount, rawAmount) {
			let backgroundColor = 'white';
			if (rawAmount >= 500) {
				backgroundColor = '#FF68B9';
			} else if (rawAmount >= 100) {
				backgroundColor = '#FFFBBD';
			} else if (rawAmount >= 20) {
				backgroundColor = '#00ffff';
			}

			this.$.donationAlerts.addAlert({
				text: formattedAmount,
				backgroundColor,
				holdDuration: rawAmount >= 500 ? 1 : 0.067
			});
		}

		_handleDonation({amount, rawAmount, rawNewTotal}) {
			this.addDonationAlert(amount, rawAmount);
			this.$.totalTextAmount.value = rawNewTotal;
		}

		_totalDisplayValueTransform(displayValue) {
			return displayValue.toLocaleString('en-US', {
				maximumFractionDigits: 0
			}).replace(/1/ig, '\u00C0');
		}
	}

	customElements.define(GdqBreakTopFrame.is, GdqBreakTopFrame);
})();
