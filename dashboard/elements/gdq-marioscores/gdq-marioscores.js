(function () {
	'use strict';

	const scores = nodecg.Replicant('scores');

	class GdqMarioScores extends Polymer.Element {
		static get is() {
			return 'gdq-marioscores';
		}

		static get properties() {
			return {
				scores: {
					type: Object
				}
			};
		}

		ready() {
			super.ready();
		}

		_scoreInputChanged(e) {
			const teamNumber = parseInt(e.target.getAttribute('data-team-number'), 10);
			const val = parseInt(e.target.value, 10);
			if (typeof val === 'number' && !isNaN(val)) {
				scores.value[`entrant${teamNumber}Score`] = val;
			}
		}
	}

	customElements.define(GdqMarioScores.is, GdqMarioScores);
})();
