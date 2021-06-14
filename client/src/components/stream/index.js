import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';
import Cam from './Cam';
// import jsmpeg from 'jsmpeg';
import JSMpeg from '@cycjimmy/jsmpeg-player';
// var jsmpeg = require( 'jsmpeg' );

import { fetchDevices, clearPlayingDevice, startStream, stopStream } from './slice';

import './style.css';

const Stream = () => {
	const canvasRef = useRef( null );
	const dispatch = useDispatch();
	const [ selectedCamera, setSelectedCamera ] = useState( 0 );
	const [ player, setPlayer ] = useState( null );

	// var player = new jsmpeg(client, {canvas:canvas});

	const { devices, streamingDeviceId } = useSelector( state => state.arlo );

	const isCurrentCameraStreaming = ( deviceId ) => streamingDeviceId === deviceId;

	const getDevices = async () => {
		dispatch( fetchDevices() );
	};

	useEffect( async () => {
		console.log( 'init..', streamingDeviceId );
		await dispatch( clearPlayingDevice() );
		await dispatch( stopStream() );
		getDevices();
	}, [] );

	useEffect( () => {
		console.log( 'canvasref updated' );
	}, [canvasRef] );

	const setActiveDevice = ( cameraId ) => {
		setSelectedCamera( cameraId );
	};

	const play = async ( deviceId ) => {
		console.log( selectedCamera );
		const device = devices[selectedCamera];
		// console.log( device );
		if ( device.streamUrl.wsUrl === null ) {
			console.log( 'get stream url first!' );
			await dispatch( startStream( device.deviceName ) );
			console.log( 'stream started' );
			// createPlayer();
		} else {

		}
	};

	const createPlayer = () => {
		console.log( 'creating player' );
		const activeDevice = devices.find( device => device.deviceName === streamingDeviceId );
		const url = activeDevice.streamUrl.wsUrl;
		console.log( 'url', activeDevice.streamUrl.wsUrl );
		if ( url === undefined ) { return; }

		// var webSocket = new WebSocket( url );

		// webSocket.onmessage = function ( event ) {
		// 	console.log( '[websocket]', event );
		// };
		let canvas = canvasRef.current;
		// console.log( webSocket, canvas );
		let c = new JSMpeg.VideoElement(
			canvas,
			url
		);

		setPlayer( c );

		// let player = new jsmpeg( webSocket, { canvas });

		// player.play();
		// var player = new jsmpeg(client, {canvas:canvas});
		// setPlayer({
		// 	webSocket,
		// 	player
		// });
	};

	useEffect( () => {
		if ( streamingDeviceId !== null ) {
			console.log( 'creating player for ', streamingDeviceId );
			createPlayer();
		}
	}, [streamingDeviceId] );

	const stop = async () => {
		// player.webSocket.stop();
		player.stop();
		player.destroy();
		await dispatch( stopStream() );
		// setPlayer( null );
	};

	const s = devices[selectedCamera];
	const isStreaming = s.deviceName === streamingDeviceId;

	// console.log( 'isStreaming? ', isStreaming );

	return (
		<div className="streamWrapper">
			<ul>
				{
					devices.map( ( device, index ) => <Cam isPlaying={isCurrentCameraStreaming( device.deviceId )} isSelected={index === selectedCamera } deviceName={device.deviceName + ' (' + device.deviceType + ')'} onCamClick={setActiveDevice} key={index} index={index} img={device.thumbnail}/> )
				}
			</ul>
			<div className="canvasWrapper">
				<h2>{devices[selectedCamera] && devices[selectedCamera].deviceName} ({devices[selectedCamera] && devices[selectedCamera].deviceType})</h2>
				<img className="streamCover" src={devices[selectedCamera] && devices[selectedCamera].thumbnail}/>
				{/* <canvas ref={canvasRef} id="canvas" width="640px" height="480px"></canvas> */}
				<div className="videoWrapper" ref={canvasRef} id="canvas" ></div>
				<div className="controls">
					{!isStreaming && <button onClick={play.bind( this, devices[selectedCamera].deviceId )}>play</button> }
					{isStreaming && <button onClick={stop}>stop</button> }
				</div>
			</div>
		</div>
	);
};

export default Stream;
