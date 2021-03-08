import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import DateTime from './components/dateTime';
import Calendar from './components/calendar';

const App = () => (
	<div>
		<h1>test 1</h1>
		<DateTime/>
		<Calendar/>
	</div>
);

export default hot( module )( App );
