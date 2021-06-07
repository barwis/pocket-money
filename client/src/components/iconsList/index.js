import React from 'react';
import LazyLoad from 'react-lazyload';
import { conditions } from '../../utils';

import './style.css';

const IconsList = () => {
	const [ weatherConditions ] = React.useState( conditions.getData() );

	const imgPath = `/weather/64x64/day/svg/`;

	const getImgPath = ( icon ) => imgPath + icon + '.svg';

	return (
		<main className="iconsPage">
			<div className="iconsContainer" >
				{weatherConditions.map( ( item, index ) => {
					const icon = item.icon.filter( Boolean )[0];
					const name = item.desc.join( ', ' );
					const iconSrc = getImgPath( icon );
					return 	(
						<a key={index} href={iconSrc}>
							<LazyLoad height={250}>
								<img width="250" className="weatherIcon" src={ icon && imgPath + `${icon}.svg`}/>
							</LazyLoad>
							<span>{icon}.svg</span>
							<span>{name}</span>
						</a>
					);
				})}

			</div>

			<a href="/" className="backButtonContainer" > Back</a>
		</main>
	);
};

export default IconsList;
