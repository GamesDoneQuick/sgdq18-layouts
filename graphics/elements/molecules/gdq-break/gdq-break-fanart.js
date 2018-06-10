/* global AtomInterrupt */
(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreakFanart extends AtomInterrupt {
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
			this._initBackgroundSVG();
			this._addReset();
		}

		/**
		 * Adds a reset to the master timeline.
		 * @private
		 * @returns {undefined}
		 */
		_addReset() {
			const tl = this.timeline;
			tl.set(this._bgRect.node, {drawSVG: '0%', 'fill-opacity': 0});
			tl.call(this.$.tweet._addReset, null, this.$.tweet);
		}

		/**
		 * Creates an entrance animation timeline.
		 * @private
		 * @param {Object} tweet - The tweet to enter.
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createEntranceAnim(tweet) {
			const tl = new TimelineLite();

			let didStartingWork = false; // GSAP likes to run .calls again when you .resume
			tl.call(() => {
				if (didStartingWork) {
					return;
				}

				didStartingWork = true;

				tl.pause();
				this.$.image.$svg.image.load(tweet.gdqMedia[0].media_url_https).loaded(() => {
					tl.resume();
				}).error(error => {
					nodecg.log.error(error);
					tl.clear();
					tl.resume();
				});
			}, null, null, '+=0.03');

			tl.addLabel('start', '+=0.03');

			tl.to(this._bgRect.node, 0.75, {
				drawSVG: '100%',
				ease: Linear.easeNone
			}, 'start');

			tl.add(this.$.tweet._createEntranceAnim(tweet), 'start');
			tl.add(this.$.image.enter(), 'start');

			tl.to(this._bgRect.node, 0.5, {
				'fill-opacity': this.backgroundOpacity,
				ease: Sine.easeOut
			}, 'start+=1');

			if (tweet.gdqMedia.length > 1) {
				tweet.gdqMedia.slice(1).forEach(mediaEntity => {
					tl.add(this._createHold());
					tl.add(this._changeImage(mediaEntity.media_url_https));
				});
			}

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

			let exitedPreviousItem = false; // GSAP likes to run .calls again when you .resume
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
			}, null, null, '+=0.03');

			tl.add(this._changeImage(tweet.gdqMedia[0].media_url_https), '+=0.03');

			if (tweet.gdqMedia.length > 1) {
				tweet.gdqMedia.slice(1).forEach(mediaEntity => {
					tl.add(this._createHold());
					tl.add(this._changeImage(mediaEntity.media_url_https));
				});
			}

			return tl;
		}

		/**
		 * Changes just the image, without changing the tweet body.
		 * Used in tweets which have more than one image (they can have up to four).
		 * @param {string} newSrc - The url of the new image to show.
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 * @private
		 */
		_changeImage(newSrc) {
			const tl = new TimelineLite();

			tl.add(this.$.image.exit({
				onComplete: () => {
					tl.pause();
					this.$.image.$svg.image.load(newSrc).loaded(() => {
						tl.resume();
					});
				}
			}));

			tl.add(this.$.image.enter(), '+=0.05');

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

			tl.to(this._bgRect.node, 0.5, {
				'fill-opacity': 0,
				ease: Sine.easeOut
			}, 'exit');

			tl.to(this._bgRect.node, 1.5, {
				drawSVG: '0%',
				ease: Power2.easeIn
			}, 'exit');

			tl.add(this.$.tweet._createExitAnim(), 'exit');
			tl.add(this.$.image.exit(), 'exit');

			return tl;
		}

		_initBackgroundSVG() {
			const STROKE_SIZE = 1;
			const ELEMENT_WIDTH = this.$.background.clientWidth;
			const ELEMENT_HEIGHT = this.$.background.clientHeight;

			const svgDoc = SVG(this.$.background);
			const bgRect = svgDoc.rect();
			this._bgRect = bgRect;

			svgDoc.size(ELEMENT_WIDTH, ELEMENT_HEIGHT);

			// Intentionally flip the width and height.
			// This is part of how we get the drawSVG anim to go in the direction we want.
			bgRect.size(ELEMENT_HEIGHT, ELEMENT_WIDTH);
			bgRect.stroke({
				color: 'white',

				// Makes it effectively STROKE_SIZE, because all SVG strokes
				// are center strokes, and the outer half is cut off.
				width: STROKE_SIZE * 2
			});
			bgRect.fill({color: 'black', opacity: this.backgroundOpacity});

			// Rotate and translate such that drawSVG anims start from the top right
			// and move clockwise to un-draw, counter-clockwise to un-draw.
			bgRect.style({transform: `rotate(90deg) translateY(${-ELEMENT_WIDTH}px)`});
		}
	}

	customElements.define(GdqBreakFanart.is, GdqBreakFanart);
})();
