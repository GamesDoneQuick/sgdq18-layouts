(function () {
	'use strict';

	const TWEET_DISPLAY_DURATION = 9;
	const EMPTY_OBJ = {};

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqTweet extends Polymer.Element {
		static get is() {
			return 'gdq-tweet';
		}

		static get properties() {
			return {
				label: {
					type: String,
					value: ''
				},
				companionElement: {
					type: Object,
					value() {
						return document.querySelector('gdq-sponsors');
					}
				},
				timeline: {
					type: TimelineLite,
					value() {
						return new TimelineLite({autoRemoveChildren: true});
					}
				},
				backgroundOpacity: {
					type: Number,
					value: 0.25
				},

				/**
				 * The message name to bind to.
				 */
				bindToMessage: {
					type: String,
					value: 'showTweet'
				},

				/**
				 * If true, it means that we're currently showing a tweet,
				 * and are at a point in the animation where we can show another one
				 * without performing a full exit/enter cycle again.
				 */
				_canExtend: {
					type: Boolean,
					value: false
				}
			};
		}

		ready() {
			super.ready();
			this._initBackgroundSVG();
			this._addReset();

			if (this.bindToMessage && this.bindToMessage.length > 0 && this.bindToMessage !== 'false') {
				nodecg.listenFor(this.bindToMessage, this.playTweet.bind(this));
			}

			Polymer.RenderStatus.beforeNextRender(this, () => {
				if (!this.companionElement) {
					if (document.querySelector('layout-app')) {
						this.companionElement =
							document.querySelector('layout-app').shadowRoot.querySelector('gdq-sponsors');
					}
				}
			});
		}

		/**
		 * Plays the entrance animation for this element.
		 * Then, holds it for TWEET_DISPLAY_DURATION seconds.
		 * Then, plays the exit animation for this element.
		 *
		 * If this.companionElement is defined, this method will run this.companionElement.hide()
		 * before playing the entrance animation for this element.
		 *
		 * @param {Object} tweet - The tweet to show.
		 * @returns {TimelineLite} - A GSAP TimelineLite instance.
		 */
		playTweet(tweet) {
			console.log('playTweet', tweet);
			const tl = this.timeline;

			if (this._canExtend) {
				console.log('extending');
				const newAnim = new TimelineLite();
				newAnim.add(this._createTweetChangeAnim(tweet));
				newAnim.add(this._createHold());
				tl.add(newAnim, 'exit-=0.01');
				tl.shiftChildren(newAnim.duration(), true, tl.getLabelTime('exit'));
			} else {
				console.log('not extending');
				this._addReset();

				// Wait for prizes to hide, if applicable.
				tl.call(() => {
					this._canExtend = true;
					if (this.companionElement && typeof this.companionElement.hide === 'function') {
						tl.pause();

						const hidePrizeTl = this.companionElement.hide();
						console.log('waiting for companion element to hide');
						hidePrizeTl.call(() => {
							console.log('companion element hidden');
							tl.resume();
						});
					}
				}, null, null, '+=0.03');

				tl.add(this._createEntranceAnim(tweet));
				tl.add(this._createHold());
				tl.addLabel('exit');
				tl.add(this._createExitAnim());

				if (this.companionElement && typeof this.companionElement.show === 'function') {
					tl.add(this.companionElement.show());
				}

				// Padding
				tl.to(EMPTY_OBJ, 0.1, EMPTY_OBJ);
			}

			return tl;
		}

		/**
		 * Adds a reset to the master timeline.
		 * @private
		 * @returns {undefined}
		 */
		_addReset() {
			const tl = this.timeline;
			tl.call(() => {
				this.$['body-actual'].innerHTML = '';
				this.$.name.innerHTML = '';
			}, null, null, '+=0.03');
			tl.set(this._bgRect.node, {drawSVG: '0%', 'fill-opacity': 0});
			tl.set([this.$.label, this.$.name], {scaleX: 0, color: 'transparent', clipPath: ''});
			tl.set(this.$['body-actual'], {opacity: 1});
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

			tl.call(() => {
				this.$.name.innerText = `@${tweet.user.screen_name}`;
			}, null, null, 'start');

			tl.to(this._bgRect.node, 0.75, {
				drawSVG: '100%',
				ease: Linear.easeNone
			}, 'start');

			tl.to(this.$.name, 0.334, {
				scaleX: 1,
				ease: Sine.easeInOut,
				callbackScope: this,
				onComplete() {
					this.$.name.style.color = '';
					TypeAnims.type(this.$.name);
				}
			}, 'start+=0.05');

			tl.to(this.$.label, 0.334, {
				scaleX: 1,
				ease: Sine.easeInOut,
				callbackScope: this,
				onComplete() {
					this.$.label.style.color = '';
					TypeAnims.type(this.$.label);
				}
			}, 'start+=0.4');

			tl.to(this._bgRect.node, 0.5, {
				'fill-opacity': this.backgroundOpacity,
				ease: Sine.easeOut
			}, 'start+=1');

			tl.call(() => {
				this.$['body-actual'].innerHTML = tweet.text;
				TypeAnims.type(this.$['body-actual'], {typeInterval: 0.01});
			});

			return tl;
		}

		/**
		 * Creates a dummy tween which can be used to hold something as-is for
		 * a given time.
		 * @private
		 * @param {Number} duration - How long, in seconds, to hold for.
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createHold(duration = TWEET_DISPLAY_DURATION) {
			const tl = new TimelineLite();
			tl.to(EMPTY_OBJ, duration, EMPTY_OBJ);
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
		_createTweetChangeAnim(tweet) {
			const tl = new TimelineLite();
			let exitedPreviousTweet = false;

			tl.addLabel('start', '+=0.03');

			tl.call(() => {
				if (exitedPreviousTweet) {
					return;
				}

				console.log('pausing');
				tl.pause();
				const exitTextTl = new TimelineLite();
				exitTextTl.add(TypeAnims.untype(this.$.name, 0.01), 0);
				exitTextTl.add(TypeAnims.untype(this.$['body-actual'], 0.01), 0.08);
				exitTextTl.call(() => {
					console.log('resuming');
					exitedPreviousTweet = true;
					tl.resume();
				});
			});

			tl.call(() => {
				console.log('replacing body');
				this.$.name.innerText = `@${tweet.user.screen_name}`;
				this.$['body-actual'].innerHTML = tweet.text;

				const enterTextTl = new TimelineLite();
				enterTextTl.add(TypeAnims.type(this.$.name, {typeInterval: 0.01}), 0);
				enterTextTl.add(TypeAnims.type(this.$['body-actual'], {typeInterval: 0.01}), 0.08);
			}, null, null, '+=0.03');

			return tl;
		}

		/**
		 * Creates an exit animation timeline.
		 * @private
		 * @returns {TimelineLite} - A GSAP animation timeline.
		 */
		_createExitAnim() {
			const tl = new TimelineLite({
				callbackScope: this,
				onStart() {
					this._canExtend = false;
				}
			});

			tl.add('exit');

			tl.add(MaybeRandom.createTween({
				target: this.$['body-actual'].style,
				propName: 'opacity',
				duration: 0.465,
				start: {probability: 1, normalValue: 1},
				end: {probability: 0, normalValue: 0}
			}), 'exit');

			tl.to(this._bgRect.node, 0.5, {
				'fill-opacity': 0,
				ease: Sine.easeOut
			}, 'exit');

			tl.to(this._bgRect.node, 1.5, {
				drawSVG: '0%',
				ease: Power2.easeIn
			}, 'exit');

			tl.fromTo(this.$.label, 0.334, {
				clipPath: 'inset(0 0% 0 0)'
			}, {
				clipPath: 'inset(0 100% 0 0)',
				ease: Sine.easeInOut
			}, 'exit+=0.9');

			tl.fromTo(this.$.name, 0.334, {
				clipPath: 'inset(0 0 0 0%)'
			}, {
				clipPath: 'inset(0 0 0 100%)',
				ease: Sine.easeInOut
			}, 'exit+=1.3');

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

		_falsey(value) {
			return !value;
		}
	}

	customElements.define(GdqTweet.is, GdqTweet);
})();
