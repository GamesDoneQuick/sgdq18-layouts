(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class DashIncidents extends Polymer.Element {
		static get is() {
			return 'dash-incidents';
		}

		static get properties() {
			return {};
		}
	}

	customElements.define(DashIncidents.is, DashIncidents);
})();
