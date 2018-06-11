(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashOotbingo extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-ootbingo';
		}

		static get properties() {
			return {
				socketStatus: {
					type: String
				},
				status: {
					type: String,
					reflectToAttribute: true,
					computed: '_computeStatus(socketStatus)'
				},
				_submitting: {
					type: Boolean,
					value: false
				}
			};
		}

		async submit() {
			this._submitting = true;
			await nodecg.sendMessage('ootBingo:joinRoom', {
				siteUrl: this.$.siteUrl.value,
				socketUrl: this.$.socketUrl.value,
				roomCode: this.$.roomCode.value,
				passphrase: this.$.passphrase.value
			});
			this._submitting = false;
		}

		defaults() {
			this.$.siteUrl.value = 'https://bingosync.com';
			this.$.socketUrl.value = 'wss://sockets.bingosync.com';
		}

		_computeStatus(socketStatus) {
			if (!socketStatus) {
				return 'disconnected';
			}

			return socketStatus.status;
		}

		_calcComplete(cell) {
			if (!cell) {
				return false;
			}

			return cell.colors.length > 0 && cell.colors !== 'none' && cell.colors !== 'blank';
		}
	}

	customElements.define(DashOotbingo.is, DashOotbingo);
})();
