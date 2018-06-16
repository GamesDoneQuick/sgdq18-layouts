(function () {
	'use strict';

	const currentIntermission = nodecg.Replicant('currentIntermission');
	const casparConnected = nodecg.Replicant('caspar:connected');
	const compositingOBSWebsocket = nodecg.Replicant('compositingOBS:websocket');

	class DashHostAds extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-host-ads';
		}

		static get properties() {
			return {
				content: Array,
				_connectedToNodeCG: {
					type: Boolean,
					value: true,
					readOnly: true
				}
			};
		}

		ready() {
			super.ready();
			this._checkCover = this._checkCover.bind(this);
			currentIntermission.on('change', newVal => {
				this.content = newVal ? newVal.content : [];
			});
			casparConnected.on('change', this._checkCover);
			compositingOBSWebsocket.on('change', this._checkCover);

			window.socket.on('disconnect', () => {
				this._set_connectedToNodeCG(false);
				this._checkCover();
			});

			window.socket.on('reconnect', () => {
				this._set_connectedToNodeCG(true);
				this._checkCover();
			});
		}

		startAdBreak(adBreakId) {
			nodecg.sendMessage('intermissions:startAdBreak', adBreakId);
		}

		cancelAdBreak(adBreakId) {
			nodecg.sendMessage('intermissions:cancelAdBreak', adBreakId);
		}

		completeAdBreak(event) {
			nodecg.sendMessage('intermissions:completeAdBreak', event.detail.adBreakId);
		}

		equal(a, b) {
			return a === b;
		}

		_confirmStartAdBreak(e) {
			this._adBreakIdBeingConfirmed = e.detail.adBreakId;
			this.$.confirmStartDialog.open();
		}

		_confirmCancelAdBreak(e) {
			this._adBreakIdBeingConfirmed = e.detail.adBreakId;
			this.$.confirmCancelDialog.open();
		}

		_handleConfirmStartDialogClosed(e) {
			if (e.detail.confirmed === true) {
				this.startAdBreak(this._adBreakIdBeingConfirmed);
			}
		}

		_handleConfirmCancelDialogClosed(e) {
			if (e.detail.confirmed === true) {
				this.cancelAdBreak(this._adBreakIdBeingConfirmed);
			}
		}

		_checkCover() {
			if (casparConnected.status !== 'declared' || compositingOBSWebsocket.status !== 'declared') {
				return;
			}

			this.$.cover.hidden = false;

			const casparIsConnected = casparConnected.value;
			const compositingOBSWebsocketIsConnected = compositingOBSWebsocket.value.status === 'connected';
			if (!this._connectedToNodeCG) {
				this.$.cover.innerHTML = 'Disconnected from NodeCG!<br/>' +
					'Ads cannot be played until we reconnect.' +
					'<br/><br/>Tell the producer immediately!';
			} else if (!casparIsConnected && !compositingOBSWebsocketIsConnected) {
				this.$.cover.innerHTML = 'CasparCG and the compositing OBS are both disconnected!<br/>' +
						'Ads cannot be played until both of them are connected.' +
					'<br/><br/>Tell the producer immediately!';
			} else if (!casparIsConnected) {
				this.$.cover.innerHTML = 'CasparCG is disconnected!<br/>' +
						'Ads cannot be played until it is connected.' +
					'<br/><br/>Tell the producer immediately!';
			} else if (!compositingOBSWebsocketIsConnected) { // eslint-disable-line no-negated-condition
				this.$.cover.innerHTML = 'The compositing OBS is disconnected!<br/>' +
					'Ads cannot be played until it is connected.' +
					'<br/><br/>Tell the producer immediately!';
			} else {
				this.$.cover.hidden = true;
			}
		}
	}

	customElements.define(DashHostAds.is, DashHostAds);
})();
