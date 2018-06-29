/* global Random */
(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class AtomGridmaskImage extends Polymer.Element {
		static get is() {
			return 'atom-gridmask-image';
		}

		static get properties() {
			return {
				// Configuration (props and attrs)
				strokeSize: {
					type: Number,
					value: 0
				},
				withBackground: {
					type: Boolean,
					value: false
				},
				cellSize: {
					type: Number,
					value: 21
				},
				cellStagger: {
					type: Number,
					value: 0.002
				},
				fallbackSrc: {
					type: String
				},
				preserveAspectRatio: {
					type: String,
					value: 'xMidYMid'
				},

				// State
				entering: {
					type: Boolean,
					value: false,
					notify: true
				},
				exiting: {
					type: Boolean,
					value: false,
					notify: true
				},

				// Private
				_initialized: {
					type: Boolean,
					value: false
				}
			};
		}

		ready() {
			super.ready();
			Polymer.RenderStatus.beforeNextRender(this, () => {
				this._initSVG();
				TweenLite.set(this.$svg.imageMaskCells, {opacity: 0});
			});
		}

		enter() {
			const tl = new TimelineLite();
			const shuffledMaskCells = Random.shuffle(
				Random.engines.browserCrypto,
				this.$svg.imageMaskCells.slice(0)
			);

			let didImageEntranceOnStart;
			tl.staggerTo(shuffledMaskCells, 0.224, {
				opacity: 1,
				ease: Sine.easeInOut,
				callbackScope: this,
				onStart() {
					// We only want this onStart handler to run once.
					// There is no "onStartAll" equivalent, only an "onCompleteAll".
					if (didImageEntranceOnStart) {
						return;
					}
					didImageEntranceOnStart = true;
					this.entering = true;
				}
			}, this.cellStagger, 0, () => {
				this.entering = false;
				this.dispatchEvent(new CustomEvent('entered'));
			});

			return tl;
		}

		exit({onComplete} = {}) {
			const tl = new TimelineLite();
			const shuffledMaskCells = Random.shuffle(
				Random.engines.browserCrypto,
				this.$svg.imageMaskCells.slice(0)
			);

			let didOnStart = false;
			tl.staggerTo(shuffledMaskCells, 0.224, {
				opacity: 0,
				ease: Sine.easeInOut,
				callbackScope: this,
				onStart() {
					// We only want this onStart handler to run once.
					// There is no "onStartAll" equivalent, only an "onCompleteAll".
					if (didOnStart) {
						return;
					}
					didOnStart = true;
					this.exiting = true;
				}
			}, this.cellStagger, 0, () => {
				if (typeof onComplete === 'function') {
					onComplete();
				}
				this.exiting = false;
				this.dispatchEvent(new CustomEvent('exited'));
			});

			return tl;
		}

		_initSVG() {
			if (this._initialized) {
				throw new Error('this element has already been initialized');
			}

			this._initialized = true;
			this.$svg = {};

			const STROKE_SIZE = this.strokeSize;
			const ELEMENT_WIDTH = this.clientWidth;
			const ELEMENT_HEIGHT = this.clientHeight;
			const IMAGE_MASK_CELL_SIZE = this.cellSize;
			const IMAGE_MASK_ROWS = Math.ceil(ELEMENT_HEIGHT / IMAGE_MASK_CELL_SIZE);
			const IMAGE_MASK_COLUMNS = Math.ceil(ELEMENT_WIDTH / IMAGE_MASK_CELL_SIZE);

			const svgDoc = SVG(this);
			const mask = svgDoc.mask();
			const image = svgDoc.image(this.fallbackSrc);
			this.$svg.svgDoc = svgDoc;
			this.$svg.image = image;
			this.$svg.imageMaskCells = [];

			image.attr({preserveAspectRatio: this.preserveAspectRatio});

			if (this.withBackground) {
				const bgRect = svgDoc.rect();
				bgRect.fill({color: 'black', opacity: 0.25});

				this.$svg.bgRect = bgRect;

				if (STROKE_SIZE > 0) {
					bgRect.stroke({
						color: 'white',

						// Makes it effectively STROKE_SIZE, because all SVG strokes
						// are center strokes, and the outer half is cut off.
						width: STROKE_SIZE * 2
					});

					image.move(STROKE_SIZE, STROKE_SIZE);
				}
			}

			// Generate the exitMask rects
			for (let r = 0; r < IMAGE_MASK_ROWS; r++) {
				const y = r * IMAGE_MASK_CELL_SIZE;
				for (let c = 0; c < IMAGE_MASK_COLUMNS; c++) {
					const x = c * IMAGE_MASK_CELL_SIZE;
					const rect = svgDoc.rect(IMAGE_MASK_CELL_SIZE, IMAGE_MASK_CELL_SIZE);
					rect.move(x, y);
					rect.fill({color: '#FFFFFF'});
					mask.add(rect);
					this.$svg.imageMaskCells.push(rect);
				}
			}

			image.front();
			image.maskWith(mask);

			this.resize();
		}

		resize() {
			if (!this._initialized) {
				return;
			}

			const STROKE_SIZE = this.strokeSize;
			const ELEMENT_WIDTH = this.clientWidth;
			const ELEMENT_HEIGHT = this.clientHeight;

			this.$svg.svgDoc.size(ELEMENT_WIDTH, ELEMENT_HEIGHT);
			this.$svg.image.size(ELEMENT_WIDTH, ELEMENT_HEIGHT);

			if (this.withBackground) {
				this.$svg.bgRect.size(ELEMENT_WIDTH, ELEMENT_HEIGHT);

				if (STROKE_SIZE > 0) {
					// Mirror such that drawSVG anims start from the top right
					// and move clockwise to un-draw, counter-clockwise to draw.
					this.$svg.bgRect.transform({scaleX: -1, x: ELEMENT_WIDTH});

					this.$svg.image.size(ELEMENT_WIDTH - (STROKE_SIZE * 2), ELEMENT_HEIGHT - (STROKE_SIZE * 2));
				}
			}
		}
	}

	customElements.define(AtomGridmaskImage.is, AtomGridmaskImage);
})();
