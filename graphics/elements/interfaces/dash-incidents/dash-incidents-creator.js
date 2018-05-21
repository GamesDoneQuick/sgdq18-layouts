(function () {
	'use strict';

	const log = new nodecg.Logger(`${nodecg.bundleName}:victorOps`);

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashIncidentsCreator extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-incidents-creator';
		}

		static get properties() {
			return {
				sending: {
					type: Boolean,
					reflectToAttribute: true,
					computed: '_computeSending(_requestStatus)'
				},
				_requestStatus: {
					type: String,
					value: 'ready',
					observer: '_requestStatusChanged'
				}
			};
		}

		async send() {
			log.info('Sending incident creation request...');
			this._requestStatus = 'sending';

			try {
				await nodecg.sendMessage('victorOps:createIncident', {
					routingKey: this._routingKey,
					subject: this._subject,
					details: this.$.details.value
				});
				log.info('Incident successfully created.');
				this._requestStatus = 'success';

				this._routingKey = '';
				this._subject = '';
				this.$.details.value = '';
			} catch (error) {
				log.warn('Failed to create incident:', error);
				this._requestStatus = 'failure';
			}
		}

		_computeSending(_requestStatus) {
			return _requestStatus === 'sending';
		}

		_requestStatusChanged(requestStatus) {
			clearTimeout(this._statusFadeTimeout);
			this.$.status.classList.remove('fade-out');

			if (requestStatus === 'success' || requestStatus === 'failure') {
				this._statusFadeTimeout = setTimeout(() => {
					this._statusFadeTimeout = null;
					this.$.status.classList.add('fade-out');
				}, 5000);
			}
		}

		_calcSendDisabled(sending, routingKey, subject) {
			return sending || !routingKey || !subject;
		}
	}

	customElements.define(DashIncidentsCreator.is, DashIncidentsCreator);
})();
