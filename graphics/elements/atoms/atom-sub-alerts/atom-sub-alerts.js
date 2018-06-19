(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class AtomSubAlerts extends customElements.get('atom-tiny-alerts') {
		static get is() {
			return 'atom-sub-alerts';
		}

		static get properties() {
			return {};
		}

		ready() {
			super.ready();
			nodecg.listenFor('subscription', this._handleSubscription.bind(this));
		}

		_handleSubscription(subscription) {
			let backgroundColor = 'white';
			let holdDuration = 0.067;
			let text = 'New';

			if (subscription.sub_plan && subscription.sub_plan.toLowerCase() === 'prime') {
				backgroundColor = '#6441a4';
				text = 'Prime';
			} else if (subscription.context && subscription.context.toLowerCase() === 'subgift') {
				backgroundColor = '#00ffff';
				text = 'Gift';
			} else if (subscription.sub_plan === '2000') {
				backgroundColor = '#ffba00';
				holdDuration *= 3;
				text = '$9.99';
			} else if (subscription.sub_plan === '3000') {
				backgroundColor = '#ff0099';
				holdDuration *= 6;
				text = '$24.99';
			}

			if (subscription.months <= 1) {
				text += ' Sub';
			} else {
				text += ` Resub x${subscription.months}`;
			}

			this.addAlert({
				text,
				backgroundColor,
				holdDuration
			});
		}
	}

	customElements.define(AtomSubAlerts.is, AtomSubAlerts);
})();
