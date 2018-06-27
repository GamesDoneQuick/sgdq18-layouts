(function () {
	'use strict';

	const SCORE_FADE_IN_EASE = Power1.easeOut;
	const SCORE_FADE_OUT_EASE = Power1.easeIn;
	const scoresRep = nodecg.Replicant('scores');

	class AtomScoreDisplay extends Polymer.Element {
		static get is() {
			return 'atom-score-display';
		}

		static get properties() {
			return {
				score: {
					type: Number
				},

				teamIndex: {
					type: Number
				},

				/**
				 * How long, in seconds, to fade scores in/out.
				 *
				 * For example, a value of 0.33 means that the fade out will take 0.33
				 * seconds, and then the subsequent fade in will take another 0.33 seconds.
				 */
				scoreFadeDuration: {
					type: Number,
					value: 0.33
				}
			};
		}

		ready() {
			super.ready();

			// Workaround for: https://bugs.chromium.org/p/chromium/issues/detail?id=844880
			this.shadowRoot.querySelectorAll('sc-fitted-text').forEach(node => {
				node.$.fittedContent.style.webkitBackgroundClip = 'text';
			});

			Polymer.RenderStatus.afterNextRender(this, () => {
				scoresRep.on('change', this.updateScore.bind(this));
			});
		}

		updateScore(newScores) {
			if (!newScores || typeof newScores[this.teamIndex] !== 'number') {
				return;
			}

			if (newScores[this.teamIndex] === this.score) {
				return;
			}

			TweenLite.to(this.$.scoreText, this.scoreFadeDuration, {
				opacity: 0,
				ease: SCORE_FADE_OUT_EASE,
				callbackScope: this,
				onComplete() {
					this.score = newScores[this.teamIndex];
					TweenLite.to(this.$.scoreText, this.scoreFadeDuration, {opacity: 1, ease: SCORE_FADE_IN_EASE});
				}
			});
		}
	}

	customElements.define(AtomScoreDisplay.is, AtomScoreDisplay);
})();
