// TODO: allow nesting symbols
const TYPES = {
	SYMBOL: 'symbol',
	GROUP: 'group'
};

const items = [
	{
		id: 'cloud-small',
		type: 'symbol'
		// masks: ['sun', 'cloud-big']
	},
	{
		id: 'sun',
		type: 'symbol'
		// masks: ['cloud-big']
	},
	{
		id: 'cloud-big',
		type: 'symbol'
		// masks: ['rain-straight']

	},
	{
		id: 'rain-straight',
		type: 'symbol',
		translate: [15, 5]
	}

	// {
	// 	id: 'rain-group2',
	// 	type: 'group',
	// 	elements: ['rain-1', 'rain-2', 'rain-3', 'rain-4', 'rain-straight'],
	// 	translate: [5, 5]
	// }

];

export { items };

const baseAttributes = {
	strokeWidth: 3,
	fill: 'none'
};

export default [
	{
		id: 'cloud-small',
		type: TYPES.SYMBOL,
		symbol: {
			ref: 'cloudFlippedSymbol',
			url: '/weather/64x64/day/svg/defs/cloud.svg'
		},
		attributes: {
			...baseAttributes,
			stroke: '#3996D2',
			width: 25,
			height: 20
		},
		// masks: ['sun', 'cloud-big'],
		translate: [8, 20]
	},
	{
		id: 'sun',
		type: TYPES.SYMBOL,
		symbol: {
			ref: 'sunSymbol',
			url: '/weather/64x64/day/svg/defs/sun.svg'
		},
		attributes: {
			...baseAttributes,
			stroke: '#F1C413',
			width: 29,
			height: 29
		},
		// masks: ['cloud-big'],
		translate: [11, 12]
	},
	{
		id: 'cloud-big',
		type: TYPES.SYMBOL,
		symbol: {
			ref: 'cloudSymbol',
			url: '/weather/64x64/day/svg/defs/cloud.svg'
		},
		attributes: {
			...baseAttributes,
			stroke: '#3996D2',
			width: 44,
			height: 28
		},
		// masks: ['rain-straight'],
		translate: [12, 17]
	},
	// {
	// 	id: 'rain-1',
	// 	type: TYPES.SYMBOL,
	// 	symbol: {
	// 		ref: 'rainSymbol-1',
	// 		url: '/weather/64x64/day/svg/defs/rain2.svg'
	// 	},
	// 	attributes: {
	// 		...baseAttributes,
	// 		stroke: '#2980b9',
	// 		width: 27,
	// 		height: 22
	// 	},
	// 	// transformOrigin: [11, 0],
	// 	translate: [25, 35],
	// 	animation: { timing: { delay: 400 } }

	// },
	// {
	// 	id: 'rain-2',
	// 	type: TYPES.SYMBOL,
	// 	symbol: {
	// 		ref: 'rainSymbol-2',
	// 		url: '/weather/64x64/day/svg/defs/rain2.svg'
	// 	},
	// 	attributes: {
	// 		...baseAttributes,
	// 		stroke: '#2980b9',
	// 		width: 27,
	// 		height: 22
	// 	},
	// 	// transformOrigin: [11, 0],
	// 	translate: [25, 35],
	// 	animation: { timing: { delay: 400 } }

	// },
	// {
	// 	id: 'rain-3',
	// 	type: TYPES.SYMBOL,
	// 	symbol: {
	// 		ref: 'rainSymbol-3',
	// 		url: '/weather/64x64/day/svg/defs/rain2.svg'
	// 	},
	// 	attributes: {
	// 		...baseAttributes,
	// 		stroke: '#2980b9',
	// 		width: 27,
	// 		height: 22
	// 	},
	// 	// transformOrigin: [11, 0],
	// 	translate: [25, 35],
	// 	animation: { timing: { delay: 400 } }
	// },
	// {
	// 	id: 'rain-4',
	// 	type: TYPES.SYMBOL,
	// 	symbol: {
	// 		ref: 'rainSymbol-4',
	// 		url: '/weather/64x64/day/svg/defs/rain2.svg'
	// 	},
	// 	attributes: {
	// 		...baseAttributes,
	// 		stroke: '#2980b9',
	// 		width: 27,
	// 		height: 22
	// 	},
	// 	translate: [25, 35],
	// 	animation: { timing: { delay: 400 } }

	// },
	{
		id: 'rain-straight',
		type: TYPES.SYMBOL,
		symbol: {
			ref: 'rainFragment',
			url: '/weather/64x64/day/svg/defs/rain2.svg'
		},
		attributes: {
			...baseAttributes,
			stroke: '#2980b9',
			width: 27,
			height: 22
		},
		translate: [25, 35]
	}

	// {
	// 	id: 'rain-group',
	// 	type: TYPES.GROUP,
	// 	children: [
	// 		{
	// 			id: 'rain-4',
	// 			type: TYPES.SYMBOL,
	// 			symbol: {
	// 				ref: 'rainSymbol-4',
	// 				url: '/weather/64x64/day/svg/defs/rain2.svg'
	// 			},
	// 			attributes: {
	// 				...baseAttributes,
	// 				stroke: '#2980b9',
	// 				width: 27,
	// 				height: 22
	// 			},
	// 			// transformOrigin: [11, 0],
	// 			translate: [25, 35],
	// 			animation: { timing: { delay: 400 } }

	// 		}
	// 	]

	// }
];
