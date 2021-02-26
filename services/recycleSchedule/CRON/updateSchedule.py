import sys
import mysql.connector
# import datetime
from datetime import date, datetime
from requests import Request, Session
from html.parser import HTMLParser
from pathlib import Path
from types import SimpleNamespace
from collections import namedtuple

from bs4 import BeautifulSoup

now = date.today()

database = mysql.connector.connect(
    host='localhost',
    user='root',
    password='VenCeym3',
    database='smart_home',
    autocommit=True
)
cursor = database.cursor(prepared=True)

print("\033c\033[3J", end='')

def loadText():
	p = Path(__file__).with_name('html.txt')
	with p.open('r') as f:
		content = f.read()
		return content

def getData():
	session = Session()

	session.head('https://recyclingservices.bromley.gov.uk/property/10070020041')
	response = session.post(
		url='https://recyclingservices.bromley.gov.uk/property/10070020041',
		data={
			'N': '4294966750',
			'form-trigger': 'moreId',
			'moreId': '156#327',
			'pageType': 'EventClass'
		},
		headers={
			'Cookie': 'PHPSESSID=70ugg4js3v9ggda1me1ui4ghvr; ARRAffinity=636b585fe5d15d7d762bc9fbfada8b13cb6037f8072b93fc74ed3886f5d5b422; ARRAffinitySameSite=636b585fe5d15d7d762bc9fbfada8b13cb6037f8072b93fc74ed3886f5d5b422'
		}
	)
	requestDuration = int(response.elapsed.total_seconds())
	return response.text, requestDuration

def parseData(string): 
	soup = BeautifulSoup(string, 'html.parser')
	# css_soup.select("p.strikeout.body")


	serviceWrappers = [
			'.service-wrapper.service-id-542.task-id-3223',	# Food waste
			'.service-wrapper.service-id-537.task-id-3218',	# Paper and cardboard
			'.service-wrapper.service-id-531.task-id-3212', # Non-recyclable refuse
			'.service-wrapper.service-id-535.task-id-3216', # Plastic, glass and tins
	]

	serviceNames = ['Food waste', 'Paper and cardboard', 'Non-recyclable refuse', 'Plastic, glass and tins']

	obj = []

	for i in range(len(serviceNames)):
		service = {
			"name": i+1,
			"schedule":  soup.select(serviceWrappers[i] + ' .schedule div')[0].getText().strip(),
			"lastService" : '',
			"nextService" : ''
			# 'lastService': soup.select(serviceWrappers[i] + ' td.last-service')[0]
		}
		lastService = soup.select(serviceWrappers[i] + ' td.last-service')[0]
		lastService.span.extract()
		service["lastService"] = lastService.getText().strip()
		if service["lastService"] == 'Today':
			service["lastService"] = now.strftime('%d/%m/%Y')
		service["lastService"] = '-'.join(service["lastService"].split('/')[::-1])
		# 	print('today!', service["lastService"])
		
			
		nextService = soup.select(serviceWrappers[i] + ' td.next-service')[0]
		nextService.span.extract()
		service["nextService"] = nextService.getText().strip()
		if service["nextService"] == 'Today':
			service["nextService"] = now.strftime('%d/%m/%Y')
		service["nextService"] = '-'.join(service["nextService"].split('/')[::-1])
		# 	print('today!', service["nextService"])


		obj.append(service)

	# print(obj)
	return obj



def insert(cursor, serviceName, lastUpdated, requestDuration, lastServiceDate, nextServiceDate):
	now = datetime.utcnow()

	sql_statement = """INSERT INTO recycleschedule (serviceNameId, lastUpdated, requestDuration, lastService, nextService) VALUES(%s, %s, %s, %s, %s)"""
	sql_data = ( serviceName, now.strftime('%Y-%m-%d %H:%M:%S'), requestDuration, lastServiceDate, nextServiceDate  )

	try:
		cursor.execute(sql_statement, sql_data )
	except mysql.connector.Error as err:
		print(sql_data)
		print('something went wrong:')
		print(err)
		print('----')


# before inserting, check if this row already exist in db (with name, lastService and nextService)
# if it does, update only lastUpdated and requestDuration

def saveDateToDb(obj, requestDuration = 0):
	for service in obj:
		print(service)
		insert(cursor, service["name"], now.strftime('%Y-%m-%d %H:%M:%S'), requestDuration, service["lastService"].replace('/', '-'), service["nextService"].replace('/', '-'),)


# get data from website
text, requestDuration = getData()

# text = loadText()
# requestDuration = 12345

# parse data
data = parseData(text)


saveDateToDb(data, requestDuration)
