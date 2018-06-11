(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class UiToast extends Polymer.Element {
		static get is() {
			return 'ui-toast';
		}

		static get properties() {
			return {
				_successToastText: String,
				_errorToastText: String
			};
		}

		showSuccessToast(text) {
			this._successToastText = text;
			this.$.successToast.show();
		}

		showErrorToast(text) {
			this._errorToastText = text;
			this.$.errorToast.show();
		}
	}

	customElements.define(UiToast.is, UiToast);
})();
