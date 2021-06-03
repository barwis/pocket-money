import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import IconsList from './components/iconsList';

import Homepage from './pages/home';
import PocketMoneyManager from './pages/pocketMoneyManager';
import SvgIcon from './pages/svgIcon';

import './style.css';

const Icons = () =>
	<>
		<IconsList/>
	</>;
const App = () => (
	<>
		<Switch>
			<Route path="/" component={Homepage} exact />
			<Route path="/pmm" component={PocketMoneyManager} exact />
			<Route path="/iconsList" component={Icons} exact />
			<Route path="/svgIcon" component={SvgIcon} exact />
		</Switch>

	</>
);

export default hot( module )( App );
