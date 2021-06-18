
class AnimateStroke {
	constructor ( path, scale, strokeWidth, timing = {
		duration: 1000,
		iterations: Infinity
	}) {
		this.path = path;
		this.strokeWidth = strokeWidth;
		this.timing = timing;

		const vectorEffect = path.attr( 'vector-effect' );

		this.scale = vectorEffect === null ? 1 : scale;
		this.isScaled = this.scale !== 1;
		this.pathLength = Math.ceil( this.path.getTotalLength() );

		this.defaultStyles = {
			strokeDashoffset: this.strokeWidth, // might need to add 1 if path too close to bounding box...
			strokeDasharray: [this.strokeWidth, this.pathLength]
		};
	}

	get length () {
		return this.isScaled ? this.pathLength * this.scale : this.pathLength;
	}

	get strokeDashOffset () {
		const defaultStrokeDashOffset = this.defaultStyles.strokeDashoffset;
		return this.isScaled ? defaultStrokeDashOffset * this.scale : defaultStrokeDashOffset;
	}

	get strokeDashArray () {
		const defaultStrokeDashArray = this.defaultStyles.strokeDasharray;
		return this.isScaled ? defaultStrokeDashArray.map( item => item * this.scale ).join( ', ' ) : defaultStrokeDashArray.join( ', ' );
	}

	calculate () {
		return {
			'stroke-dashoffset': this.strokeDashOffset,
			'stroke-dasharray': this.strokeDashArray
		};
	}

	apply () {
		this.path.attr({
			'stroke-dashoffset': this.strokeDashOffset,
			'stroke-dasharray': this.strokeDashArray
		});
		const animKeyframes = [
			{ strokeDashoffset: this.strokeDashOffset + this.strokeDashOffset + this.length },
			{ strokeDashoffset: this.strokeDashOffset }
		];

		// const duration = this.duration;
		const timing = this.timing;

		this.path.node.animate(
			animKeyframes,
			timing
		);
	}
	// const getSstrokeDashArray = () => {
	// 	return scaled ? s.strokeDasharray.map( item => item * scale ).join( ', ' ) : s.strokeDasharray.join( ', ' );
	// };

	// const getLength = () => {
	// 	return scaled ? pathLength * scale : pathLength;
	// };

	// path.node.animate(
	// 	animKeyframes,
	// 	{
	// 		duration,
	// 		iterations: Infinity
	// 	}
	// );
};

export default AnimateStroke;
