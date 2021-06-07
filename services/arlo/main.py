from arlo import Arlo

from datetime import timedelta, date
import datetime
import sys
import pprint
import time
from datetime import datetime
import os
from subprocess import call
USERNAME = 'lordzix@gmail.com'
PASSWORD = 'VenCeym3'

isStreaming = False
arlo = False
# https://github.com/jeffreydwalter/arlo/wiki/Streaming-Video

def something(context, event):
	# if 'properties' in event:
	# 	# properties = event['properties']
	# 	if 'activityState' in event['properties']:
	# 		state = event['properties']['activityState']
	# 		# print('activityState: ', event['properties']['activityState'])
	# 		if state == 'startUserStream':
	# 			print('start stream')
	# 		if state == 'idle':
	# 			print('stop stream')

	now = datetime.now()

	current_time = now.strftime("%H:%M:%S")
	print(current_time)
	pprint.pprint(event)
	print('')


def startStream():
	if not arlo:
		pass
	if isStreaming:
		pass


# def stopStream():
# 	if not arlo:
# 		pass
# 	if not isStreaming:
# 		pass

try:
	# Instantiating the Arlo object automatically calls Login(), which returns an oAuth token that gets cached.
	# Subsequent successful calls to login will update the oAuth token.
	arlo = Arlo(USERNAME, PASSWORD)

	today = (date.today()-timedelta(days=0)).strftime("%Y%m%d")
	seven_days_ago = (date.today()-timedelta(days=7)).strftime("%Y%m%d")


	entranceCamera = arlo.GetDevice('ENTRANCE')

	url = arlo.StartStream(entranceCamera, entranceCamera)

	print(url)

	call(['ffmpeg', '-re', '-i', url, '-t', '30', '-acodec', 'copy', '-vcodec', 'copy', 'test.mp4'])

	# arlo.HandleEvents(entranceCamera, something, timeout=120)

	
		
except Exception as e:
    print(e)