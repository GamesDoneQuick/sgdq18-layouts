(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashIncidentsList extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-incidents-list';
		}

		static get properties() {
			return {
				incidents: Array
			};
		}
	}

	customElements.define(DashIncidentsList.is, DashIncidentsList);
})();
