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
			}

			return targetStr;
		}

		_parsePageTargets(incident) {
			if (!incident) {
				return '';
			}

			if (incident.pagedPolicies && incident.pagedPolicies.length > 0) {
				const pagedTeams = [];
				incident.pagedPolicies.forEach(pagedPolicy => {
					if (pagedPolicy.team) {
						pagedTeams.push(pagedPolicy.team.name);
					}
				});

				if (pagedTeams.length > 0) {
					return pagedTeams.join(', ');
				}
			}

			return incident.pagedUsers.join(', ');
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

			return currentPhase;
		}
	}

	customElements.define(DashIncidentsIncident.is, DashIncidentsIncident);
})();
