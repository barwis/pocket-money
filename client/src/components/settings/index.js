import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';
import { toggleView, toggleComponent } from './slice';

import './style.css';

const Settings = () => {
	const dispatch = useDispatch();

	const { components } = useSelector( state => state.settings );

	const toggleSettings = () => {
		dispatch( toggleView() );
	};

	return (
		<div className="settings">
			<div className="settingsBackground" onClick={toggleSettings}></div>
			<div className="settingsList">
				{Object.entries( components ).map( item => {
					const [ key, component ] = item;

					return (
						<label className="settingsOption" key={key} onClick={() => dispatch( toggleComponent( key ) )}>
							<span className={component.isVisible ? '' : 'disabled'} >{component.title}</span>
							<div className={`fakeCheckbox ${component.isVisible ? 'checked' : ''}`} />
						</label>
					);
				})}
			</div>
		</div>
	);
};
// Object.entries(obj).forEach(entry => {
//   const [key, value] = entry;
const Cog = () => {
	const dispatch = useDispatch();

	const toggleSettings = () => {
		dispatch( toggleView() );
	};

	return (
		<a className="cog" onClick={toggleSettings}><img src="/icons/cog.svg"/></a>
	);
};

export { Settings, Cog };
