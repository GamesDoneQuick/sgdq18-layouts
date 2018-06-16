(function () {
	'use strict';

	const cyclingRecordingsRep = nodecg.Replicant('obs:cyclingRecordings');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class UiObsStatusItem extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'ui-obs-status-item';
		}

		static get properties() {
			return {
				namespace: String,
				status: {
					type: String,
					reflectToAttribute: true
				},

				// Private state.
				_websocket: Object,
				_cyclingRecordings: Boolean
			};
		}

		static get observers() {
			return [
				'_updateStatus(_websocket.status, _cyclingRecordings)'
			];
		}

		ready() {
			super.ready();
			cyclingRecordingsRep.on('change', newVal => {
				this._cyclingRecordings = newVal;
			});
		}

		_transformsNamespace(namespace) {
			return namespace.slice(0, -3);
		}

		_updateStatus(...args) {
			this.status = this._calcStatus(...args);
		}

		_calcStatus(websocketStatus, cyclingRecordings) {
			if (websocketStatus === 'connected') {
				return cyclingRecordings ? 'cycling' : websocketStatus;
			}

			return websocketStatus;
		}
	}

	customElements.define(UiObsStatusItem.is, UiObsStatusItem);
})();
