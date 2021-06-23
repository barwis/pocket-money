import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import { v4 as uuidv4 } from 'uuid';
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

window.svg = { nodes: [] };

const Svg = ( props ) => {
	const svgRef = useRef( null );
	const { width, height, viewBox, style } = props;
	const uuid = uuidv4();

	useEffect( () => {
		window.svg.nodes.push({
			id: uuid,
			elementType: 'svg'
		});
	}, [] );

	useEffect( () => {
		window.svg.ref = svgRef;
	}, [svgRef] );

	const element = <svg
		ref={svgRef}
		width={width}
		height={height}
		version="1.1"
		viewBox={viewBox}
		xmlns="http://www.w3.org/2000/svg"
		style={style}
		id={uuid}
	>${props.children}</svg>;

	return element;
};

const ReactSVG = () => {
	return <div>
		<Svg width="256" height="256" viewBox="0 0 64 64">
			<circle cx="10" cy="10" r="10"/>
		</Svg>
	</div>;
};

export default ReactSVG;
