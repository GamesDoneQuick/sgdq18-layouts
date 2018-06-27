(function () {
	'use strict';

	const scoresRep = nodecg.Replicant('scores');

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
			scoresRep.on('change', newVal => {
				this.scores = newVal;
			});
		}

		_scoreInputChanged(e) {
			const teamIndex = parseInt(e.target.getAttribute('data-team-index'), 10);
			const val = parseInt(e.target.value, 10);
			if (typeof val === 'number' && !isNaN(val)) {
				scoresRep.value[teamIndex] = val;
			}
		}
	}

	customElements.define(GdqMarioScores.is, GdqMarioScores);
})();
