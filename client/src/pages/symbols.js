// TODO: allow nesting symbols

const groups = [
	{
		name: 'cloud-big',
		elements: ['cloud-big']
	},
	{
		name: 'cloud-small',
		elements: ['cloud-small']
	},
	{
		name: 'sun',
		elements: ['sun']
	},
	{
		name: 'raindrop-1',
		elements: ['rain-1', 'rain-2', 'rain-3', 'rain-4', 'rain-5']
	}
];

export { groups };

export default [
	{
		id: 'cloud-small',
		symbolRef: 'cloudFlippedSymbol',
		symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
		attributes: {
			fill: 'none',
			stroke: '#3996D2',
			width: 25,
			height: 20,
			strokeWidth: 3
		},
		masks: ['sun', 'cloud-big'],
		translate: [8, 20]
	},
	{
		id: 'sun',
		symbolRef: 'sunSymbol',
		symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
		attributes: {
			fill: 'none',
			stroke: '#F1C413',
			width: 29,
			height: 29,
			strokeWidth: 3
		},
		masks: ['cloud-big'],
		translate: [11, 12]
	},
	{
		id: 'cloud-big',
		symbolRef: 'cloudSymbol',
		symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
		attributes: {
			fill: 'none',
			stroke: '#3996D2',
			width: 44,
			height: 28,
			strokeWidth: 3
		},
		masks: ['rain-5'],
		translate: [12, 17]
	},
	{
		id: 'rain-1',
		symbolRef: 'rainSymbol-1',
		symbolUrl: '/weather/64x64/day/svg/defs/rain2.svg',
		attributes: {
			fill: 'none',
			stroke: '#2980b9',
			width: 27,
			height: 22,
			strokeWidth: 3
		},
		foo: 'bar',
		transformOrigin: [11, 0],
		translate: [25, 35]
	},
	{
		id: 'rain-2',
		symbolRef: 'rainSymbol-2',
		symbolUrl: '/weather/64x64/day/svg/defs/rain2.svg',
		attributes: {
			fill: 'none',
			stroke: '#2980b9',
			width: 27,
			height: 22,
			strokeWidth: 3
		},
		foo: 'bar',
		transformOrigin: [11, 0],
		translate: [25, 35]
	},
	{
		id: 'rain-3',
		symbolRef: 'rainSymbol-3',
		symbolUrl: '/weather/64x64/day/svg/defs/rain2.svg',
		attributes: {
			fill: 'none',
			stroke: '#2980b9',
			width: 27,
			height: 22,
			strokeWidth: 3
		},
		foo: 'bar',
		transformOrigin: [11, 0],
		translate: [25, 35]
	},
	{
		id: 'rain-4',
		symbolRef: 'rainSymbol-4',
		symbolUrl: '/weather/64x64/day/svg/defs/rain2.svg',
		attributes: {
			fill: 'none',
			stroke: '#2980b9',
			width: 27,
			height: 22,
			strokeWidth: 3
		},
		foo: 'bar',
		transformOrigin: [11, 0],
		translate: [25, 35]
	},
	{
		id: 'rain-5',
		symbolRef: 'rainSymbol-5',
		symbolUrl: '/weather/64x64/day/svg/defs/rain2.svg',
		attributes: {
			fill: 'none',
			stroke: '#2980b9',
			width: 27,
			height: 22,
			strokeWidth: 3
		},
		transformOrigin: [11, 0],
		translate: [25, 35]
	}
];
