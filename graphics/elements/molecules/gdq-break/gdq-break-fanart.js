(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreakFanart extends window.AtomInterrupt {
		static get is() {
			return 'gdq-break-fanart';
		}

		static get properties() {
			return {
				backgroundOpacity: {
					type: Number,
					value: 0.25
				}
			};
		}

		ready() {
			super.ready();
			this.$.tweet.companionElement = null;
			this._addReset();
		}

		/**
		 * Adds a reset to the master timeline.
		 * @private
		 * @returns {undefined}
		 */
		_addReset() {
			this.$.tweet._addReset();
		}

		/**
		 * Creates an entrance animation timeline.
		 * @private
		 * @param {Object} tweet - The tweet to enter.
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createEntranceAnim(tweet) {
			const tl = new TimelineLite();

			tl.addLabel('start', '+=0.03');
			tl.add(this.$.tweet._createEntranceAnim(tweet), 'start');

			return tl;
		}

		/**
		 * Creates an animation for changing the currently displayed tweet.
		 * This is only used when hot-swapping tweets
		 * (i.e., changing tweets while the graphic is already showing).
		 * @param {Object} tweet - The new tweet to show.
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 * @private
		 */
		_createChangeAnim(tweet) {
			const tl = new TimelineLite();
			let exitedPreviousItem = false;

			tl.call(() => {
				if (exitedPreviousItem) {
					return;
				}

				tl.pause();
				const exitTextTl = new TimelineLite();
				exitTextTl.add(this.$.tweet._createChangeAnim(tweet), 0);
				exitTextTl.call(() => {
					exitedPreviousItem = true;
					tl.resume();
				});
			}, '+=0.03');

			return tl;
		}

		/**
		 * Creates an exit animation timeline.
		 * @private
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createExitAnim() {
			const tl = new TimelineLite();

			tl.add('exit');
			tl.add(this.$.tweet._createExitAnim());

			return tl;
		}
	}

	customElements.define(GdqBreakFanart.is, GdqBreakFanart);
})();
