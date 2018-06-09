(function () {
	'use strict';

	const EMPTY_OBJ = {};

	/**
	 * @customElement
	 * @polymer
	 */
	class AtomInterrupt extends Polymer.Element {
		static get is() {
			return 'atom-interrupt';
		}

		static get properties() {
			return {
				companionElement: {
					type: Object
				},
				timeline: {
					type: TimelineLite,
					value() {
						return new TimelineLite({autoRemoveChildren: true});
					}
				},

				/**
				 * The message name to bind to.
				 */
				bindToMessage: {
					type: String
				},

				/**
				 * How long, in seconds, to hold items for after they have finished entering.
				 */
				itemDisplayDuration: {
					type: Number,
					value: 9
				},

				/**
				 * If true, it means that we're currently showing an item,
				 * and are at a point in the animation where we can show another one
				 * without performing a full exit/enter cycle again.
				 */
				canExtend: {
					type: Boolean,
					value: false,
					readOnly: true
				}
			};
		}

		ready() {
			super.ready();

			if (this.bindToMessage && this.bindToMessage.length > 0 && this.bindToMessage !== 'false') {
				nodecg.listenFor(this.bindToMessage, this.playItem.bind(this));
			}
		}

		/**
		 * Plays the entrance animation for this element.
		 * Then, holds it for itemDisplayDuration seconds.
		 * Then, plays the exit animation for this element.
		 *
		 * If this.companionElement is defined, this method will run this.companionElement.hide()
		 * before playing the entrance animation for this element.
		 *
		 * @param {Object} tweet - The tweet to show.
		 * @returns {TimelineLite} - A GSAP TimelineLite instance.
		 */
		playItem(tweet) {
			const tl = this.timeline;

			if (this.canExtend) {
				const newAnim = new TimelineLite();
				newAnim.add(this._createChangeAnim(tweet));
				newAnim.add(this._createHold());
				tl.add(newAnim, 'exit-=0.01');
				tl.shiftChildren(newAnim.duration(), true, tl.getLabelTime('exit'));
			} else {
				this._addReset();

				// Wait for prizes to hide, if applicable.
				tl.call(() => {
					this._setCanExtend(true);
					if (this.companionElement && typeof this.companionElement.hide === 'function') {
						tl.pause();

						const hidePrizeTl = this.companionElement.hide();
						hidePrizeTl.call(() => {
							tl.resume();
						});
					}
				}, null, null, '+=0.03');

				tl.add(this._createEntranceAnim(tweet));
				tl.add(this._createHold());
				tl.addLabel('exit');

				const exitAnim = new TimelineLite({
					callbackScope: this,
					onStart() {
						this._setCanExtend(false);
					}
				});
				exitAnim.add(this._createExitAnim());
				tl.add(exitAnim);

				if (this.companionElement && typeof this.companionElement.show === 'function') {
					tl.add(this.companionElement.show());
				}

				// Padding
				tl.to(EMPTY_OBJ, 0.1, EMPTY_OBJ);
			}

			return tl;
		}

		/**
		 * Creates a dummy tween which can be used to hold something as-is
		 * for itemDisplayDuration seconds.
		 * @private
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createHold() {
			const tl = new TimelineLite();
			tl.to(EMPTY_OBJ, this.itemDisplayDuration, EMPTY_OBJ);
			return tl;
		}
	}

	customElements.define(AtomInterrupt.is, AtomInterrupt);
	window.AtomInterrupt = AtomInterrupt;
})();
