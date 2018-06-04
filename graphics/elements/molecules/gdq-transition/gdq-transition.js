(function () {
	'use strict';

	const GAME_SCENE_NAME_REGEX = /^(Standard|Widescreen|GBA|Gameboy|3DS|DS|LttP|OoT|Mario)/;
	const HOME_POSITION = {x: 0, y: 0};
	const HERO_HOLD_TIME = 1.5;
	const GENERIC_HOLD_TIME = 0.5;
	const MEDIA_READY_STATES = {
		HAVE_NOTHING: 0,
		HAVE_METADATA: 1,
		HAVE_CURRENT_DATA: 2,
		HAVE_FUTURE_DATA: 3,
		HAVE_ENOUGH_DATA: 4
	};

	CustomEase.create('ModifiedPower2EaseInOut', 'M0,0 C0.66,0 0.339,1 1,1');

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqTransition extends Polymer.Element {
		static get is() {
			return 'gdq-transition';
		}

		static get properties() {
			return {
				masterTimeline: {
					type: TimelineLite,
					readOnly: true,
					value() {
						return new TimelineLite({autoRemoveChildren: true});
					}
				}
			};
		}

		ready() {
			super.ready();

			if (!window.__SCREENSHOT_TESTING__) {
				this.fromClosedToOpen().progress(1);
			}

			const videos = Array.from(this.shadowRoot.querySelectorAll('video'));
			const videoLoadPromises = videos.map(this.waitForVideoToLoad);
			Promise.all(videoLoadPromises).then(() => this.init());
		}

		init() {
			if (this._initialized) {
				throw new Error('already initialized');
			}
			this._initialized = true;
			this.dispatchEvent(new CustomEvent('initialized'));

			if (window.__SCREENSHOT_TESTING__) {
				this.shadowRoot.querySelectorAll('video').forEach(video => {
					video.currentTime = video.duration;
				});
			}

			nodecg.listenFor('streamingOBS:transitioning', data => {
				console.log('streamingOBS:transitioning |', data);
				if (!data || !data.fromScene || !data.toScene) {
					return;
				}

				let animationTimeline;
				if (data.fromScene === 'Break') {
					if (data.toScene === 'Break') {
						animationTimeline = this.genericBoth();
					} else if (isGameScene(data.toScene)) {
						animationTimeline = this.heroExit();
					} else if (data.toScene === 'Interview') {
						animationTimeline = this.genericExit();
					}
				} else if (isGameScene(data.fromScene)) {
					if (data.toScene === 'Break') {
						animationTimeline = this.heroEnter();
					} else if (isGameScene(data.toScene)) {
						animationTimeline = this.genericNone();
					} else if (data.toScene === 'Interview') {
						animationTimeline = this.genericNone();
					}
				} else if (data.fromScene === 'Interview') {
					if (data.toScene === 'Break') {
						this.genericEnter();
					} else if (isGameScene(data.toScene)) {
						animationTimeline = this.genericNone();
					} else if (data.toScene === 'Interview') {
						animationTimeline = this.genericNone();
					}
				} else if (data.fromScene === 'Countdown') {
					if (data.toScene === 'Break') {
						animationTimeline = this.heroEnter();
					} else if (isGameScene(data.toScene)) {
						animationTimeline = this.genericNone();
					} else if (data.toScene === 'Interview') {
						animationTimeline = this.genericNone();
					}
				} else if (data.fromScene === 'Technical Difficulties') {
					if (data.toScene === 'Break') {
						animationTimeline = this.genericNone();
					} else if (isGameScene(data.toScene)) {
						animationTimeline = this.genericNone();
					} else if (data.toScene === 'Interview') {
						animationTimeline = this.genericNone();
					}
				}

				if (animationTimeline) {
					this.masterTimeline.clear();
					this.masterTimeline.add(animationTimeline);
				}
			});
			console.log('listening for transition events...');
		}

		genericNone() {
			console.log('genericNone');
			return this.genericBase({startPartial: false, endPartial: false});
		}

		genericEnter() {
			console.log('genericEnter');
			return this.genericBase({startPartial: false, endPartial: true});
		}

		genericExit() {
			console.log('genericExit');
			return this.genericBase({startPartial: true, endPartial: false});
		}

		genericBoth() {
			console.log('genericBoth');
			return this.genericBase({startPartial: true, endPartial: true});
		}

		genericBase({startPartial, endPartial}) {
			const tl = new TimelineLite({
				callbackScope: this,
				onStart() {
					this.$.genericAnimation.style.display = '';
					this.$['bottomTrapAnimation-exit'].style.display = 'none';
					this.$['bottomTrapAnimation-enter'].style.display = 'none';
				}
			});

			const closingAnim = startPartial ? this.fromPartialToClosed() : this.fromOpenToClosed();
			closingAnim.call(() => {
				if (window.__SCREENSHOT_TESTING__) {
					return;
				}
				this.$.genericAnimation.play();
			}, null, null, 'frontRects');

			tl.add(closingAnim);
			tl.add(endPartial ? this.fromClosedToPartial() : this.fromClosedToOpen(), `+=${GENERIC_HOLD_TIME}`);
			return tl;
		}

		heroEnter() {
			console.log('heroEnter');
			const tl = new TimelineLite({
				callbackScope: this,
				onStart() {
					this.$.genericAnimation.style.display = 'none';
					this.$['bottomTrapAnimation-exit'].style.display = 'none';
					this.$['bottomTrapAnimation-enter'].style.display = '';
				}
			});

			const closingAnim = this.fromOpenToClosed();
			closingAnim.call(() => {
				if (window.__SCREENSHOT_TESTING__) {
					return;
				}
				this.$['bottomTrapAnimation-enter'].play();
				this.$.bottomRectAnimation.play();
				this.$.topTrapAnimation.play();
				this.$.topRectAnimation.play();
			}, null, null, 'frontRects');

			tl.add(closingAnim);
			tl.add(this.fromClosedToPartial(), `+=${HERO_HOLD_TIME}`);
			return tl;
		}

		heroExit() {
			console.log('heroExit');
			const tl = new TimelineLite({
				callbackScope: this,
				onStart() {
					this.$.genericAnimation.style.display = 'none';
					this.$['bottomTrapAnimation-enter'].style.display = 'none';
					this.$['bottomTrapAnimation-exit'].style.display = '';
				}
			});

			const closingAnim = this.fromPartialToClosed();
			closingAnim.call(() => {
				if (window.__SCREENSHOT_TESTING__) {
					return;
				}

				this.$['bottomTrapAnimation-exit'].play();
				this.$.bottomRectAnimation.play();
				this.$.topTrapAnimation.play();
				this.$.topRectAnimation.play();
			}, null, null, 'frontRects');

			tl.add(closingAnim);
			tl.add(this.fromClosedToOpen(), `+=${HERO_HOLD_TIME}`);
			return tl;
		}

		fromOpenToClosed() {
			return this.fromClosedToOpen().reverse(0);
		}

		fromClosedToOpen() {
			return this.tweenGeometry({
				bottomFrontRect: {x: 26, y: 413},
				topFrontRect: {x: -10, y: -418},
				bottomFrontTrapezoid: {x: -667, y: 488},
				topFrontTrapezoid: {x: 14, y: -521},
				bottomBackRect: {x: 0, y: 421},
				topBackRect: {x: -10, y: -437},
				bottomBackTrapezoid: {x: -666, y: 510},
				topBackTrapezoid: {x: 0, y: -543}
			});
		}

		fromPartialToClosed() {
			return this.fromClosedToPartial().reverse(0);
		}

		fromClosedToPartial() {
			return this.tweenGeometry({
				bottomFrontRect: {x: 26, y: 321},
				topFrontRect: {x: -10, y: -349},
				bottomFrontTrapezoid: {x: -503, y: 364},
				topFrontTrapezoid: {x: 8, y: -417},
				bottomBackRect: {x: 0, y: 323},
				topBackRect: {x: 0, y: -351},
				bottomBackTrapezoid: {x: -490, y: 374},
				topBackTrapezoid: {x: 0, y: -426}
			});
		}

		tweenGeometry({
			bottomFrontRect,
			topFrontRect,
			bottomFrontTrapezoid,
			topFrontTrapezoid,
			bottomBackRect,
			topBackRect,
			bottomBackTrapezoid,
			topBackTrapezoid
		}) {
			const tl = new TimelineLite();

			tl.addLabel('start');
			tl.addLabel('frontRects', 'start');
			tl.addLabel('frontTraps', 'start+=0.1');
			tl.addLabel('backRects', 'start+=0.1667');
			tl.addLabel('backTraps', 'start+=0.2334');

			// Front rects.
			tl.fromTo(this.$.bottomFrontRect, 0.2167, HOME_POSITION, {
				...bottomFrontRect,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');
			tl.fromTo(this.$.topFrontRect, 0.2167, HOME_POSITION, {
				...topFrontRect,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');

			// Front traps.
			tl.fromTo(this.$.bottomFrontTrapezoid, 0.2667, HOME_POSITION, {
				...bottomFrontTrapezoid,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');
			tl.fromTo(this.$.topFrontTrapezoid, 0.2667, HOME_POSITION, {
				...topFrontTrapezoid,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');

			// Back rects.
			tl.fromTo(this.$.bottomBackRect, 0.2334, HOME_POSITION, {
				...bottomBackRect,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backRects');
			tl.fromTo(this.$.topBackRect, 0.2334, HOME_POSITION, {
				...topBackRect,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backRects');

			// Back traps.
			tl.fromTo(this.$.bottomBackTrapezoid, 0.2334, HOME_POSITION, {
				...bottomBackTrapezoid,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backTraps');
			tl.fromTo(this.$.topBackTrapezoid, 0.2334, HOME_POSITION, {
				...topBackTrapezoid,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backTraps');

			return tl;
		}

		waitForInit() {
			return new Promise(resolve => {
				if (this._initialized) {
					return resolve();
				}

				this.addEventListener('initialized', () => {
					resolve();
				}, {once: true, passive: true});
			});
		}

		waitForVideoToLoad(videoElem) {
			return new Promise(resolve => {
				if (videoElem.readyState >= MEDIA_READY_STATES.HAVE_ENOUGH_DATA) {
					return resolve();
				}

				videoElem.addEventListener('canplaythrough', () => {
					resolve();
				}, {once: true, passive: true});
			});
		}
	}

	customElements.define(GdqTransition.is, GdqTransition);

	function isGameScene(sceneName) {
		return Boolean(sceneName.match(GAME_SCENE_NAME_REGEX));
	}
})();
