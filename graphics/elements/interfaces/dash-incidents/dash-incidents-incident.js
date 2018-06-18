(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class DashIncidentsIncident extends Polymer.Element {
		static get is() {
			return 'dash-incidents-incident';
		}

		static get properties() {
			return {
				incident: Object,
				currentPhase: {
					type: String,
					reflectToAttribute: true,
					computed: '_computeCurrentPhase(incident.*)'
				}
			};
		}

		_computeCurrentPhase() {
			return this.incident ? this.incident.currentPhase.toLowerCase() : 'unknown';
		}

		_calcFormattedPageTarget(incident) {
			if (!incident) {
				return '';
			}

			let targetStr = this._parsePageTargets(incident);
			if (incident.currentPhase.toLowerCase() === 'unacked') {
				targetStr = `PAGING: ${targetStr}`;
			} else if (incident.currentPhase.toLowerCase() === 'acked') {
				targetStr = incident.transitions.filter(transition => {
					return transition.name.toLowerCase() === 'acked';
				}).map(transition => {
					return transition.by;
				}).join(', ');
			} else if (incident.currentPhase.toLowerCase() === 'resolved') {
				targetStr = incident.transitions.filter(transition => {
					return transition.name.toLowerCase() === 'resolved';
				}).map(transition => {
					return transition.by;
				}).join(', ');
			}

			return targetStr;
		}

		_parsePageTargets(incident) {
			if (!incident) {
				return '';
			}

			if (incident.pagedUsers && incident.pagedUsers.length > 0) {
				return incident.pagedUsers.join(', ');
			}

			return 'NOBODY - TRY SLACK';
		}

		_formatDate(dateString) {
			const date = new Date(dateString);
			return date.toLocaleString('en-US', {
				day: 'numeric',
				month: 'numeric',
				year: '2-digit',
				hour12: true,
				hour: 'numeric',
				minute: '2-digit'
			});
		}

		_calcStatusText(currentPhase) {
			if (currentPhase.toLowerCase() === 'acked') {
				return 'ACKED BY:';
			}

			if (currentPhase.toLowerCase() === 'resolved') {
				return 'RESOLVED BY:';
			}

			return currentPhase;
		}
	}

	customElements.define(DashIncidentsIncident.is, DashIncidentsIncident);
})();
