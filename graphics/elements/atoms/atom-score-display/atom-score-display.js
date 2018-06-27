(function () {
	'use strict';

	const SCORE_FADE_IN_EASE = Power1.easeOut;
	const SCORE_FADE_OUT_EASE = Power1.easeIn;
	const scores = nodecg.Replicant('scores');

	class AtomScoreDisplay extends Polymer.Element {
		static get is() {
			return 'atom-score-display';
		}

		static get properties() {
			return {
				score: {
					type: Number,
					value: 0
				},

				team: {
					type: String
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
				scores.on('change', this.updateScore.bind(this));
			});
		}

		updateScore(scores) {
			TweenLite.to(this.$.score, this.scoreFadeDuration, {
				opacity: 0,
				ease: SCORE_FADE_OUT_EASE,
				callbackScope: this,
				onComplete() {
					this.score = scores.value[this.team];
					TweenLite.to(this.$.score, this.nameFadeDuration, {opacity: 1, ease: SCORE_FADE_IN_EASE});
				}
			});
		}
	}

	customElements.define(AtomScoreDisplay.is, AtomScoreDisplay);
})();
