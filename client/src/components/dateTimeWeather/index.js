import React, { useState, useEffect } from 'react';
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';


import './style.scss';
// import './style.css';

const DateTimeWeather = () => {
    const [ currentDate, setCurrentDate ] = useState( new Date() );
	const [ tick, setTick ] = useState( true );
    
    const separator = tick ? ':' : '\u00A0';
	useEffect( () => {
		const timer = setInterval( () => {
			setCurrentDate( new Date() );
			setTick( !tick );
		}, 1000 );
		return () => clearInterval( timer );
	}, [ tick ] );


    const getDate = () => {
        const dow = new Intl.DateTimeFormat( 'en-GB', { weekday: 'long' }).format( currentDate );
        const todaysDate = new Intl.DateTimeFormat( 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format( currentDate );

        return `${dow}, ${todaysDate}`
    }

    return (
        <Widget>
            <WidgetHeader
                title={getDate()}
                // lastUpdated={lastUpdated}
                // lastFetchStatus={lastFetchStatus}
                // onUpdateClick={() => dispatch( fetchCalendarEvents() ) }
            />
            <div className="today">
                <div className="date-time-conditions">
                    <div className="current-time">
                        <div>{currentDate.getHours()}</div>
                        <div className="separator">{separator}</div>
				        <div>{( currentDate.getMinutes() < 10 ? '0' : '' ) + currentDate.getMinutes()}</div>
                    </div>
                    <div className="conditions">
                        <div className="percip">81% / 5mm</div>
                        <div className="pressure">1013hPa</div>
                        <div className="wind">5km/h</div>
                    </div>
                </div>
                <div className="weather">

                </div>
            </div>
        </Widget>
    );

};

export default DateTimeWeather;