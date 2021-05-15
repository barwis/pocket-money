#! /usr/bin/python3

# system
import os
#helper func to clear console
clear = lambda: os.system('clear')

import sys
from pathlib import Path
from datetime import date, datetime
from time import strptime

# requests
import requests as req
#  disable warning about https domain not being verified etc...
req.packages.urllib3.disable_warnings()

# database
import mariadb

# beautifulsoup
from bs4 import BeautifulSoup

import pprint

# .ini loader
import configparser

# logging
import logging


import inspect

# from scrapper import SCRAPPER


class LOGGER:
    """Logger class. Takes care of logging. duh"""

    def __init__ ( self, logFileName = 'logfile.log' ):
        pathtoLogFile = os.path.join(os.path.dirname(os.path.abspath(__file__)), logFileName)
        logging.basicConfig( filename=pathtoLogFile, level=logging.DEBUG, format='%(asctime)s %(levelname)-8s %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        LOGGER.log('info', '--- ')
        LOGGER.log('info', 'initialised ', parentObjectName=__class__.__name__)

        
    # @staticmethod
    def log (level, message, shouldTerminateApp = False, parentObjectName = False ):
        # print('log name!', __class__)
        # get name of a function/method (a.k.a. context) that called log
        curframe = inspect.currentframe()
        calframe = inspect.getouterframes(curframe, 2)
        context = calframe[1][3]

        preparedMessage = ''

        if ( parentObjectName ):
            preparedMessage += '[' +  parentObjectName + ']'

        if ( context != '__init__'):
            preparedMessage += '[' + context + ']:'

        preparedMessage += ' ' + message

        loggingLevel = getattr(logging, level)
        loggingLevel( preparedMessage )
        if ( shouldTerminateApp == True and level == 'error' ):
            sys.exit( preparedMessage )
        # else:
        #     print( preparedMessage )


class CONFIG:
    ''' .ini loader.'''
    def __init__(self, configFile = 'config.ini'):

        # get abs path of config gile
        # pathToConfigFile = os.path.join(os.path.dirname(os.path.abspath(__file__)), configFile)
        LOGGER.log('info', '--- ')
        LOGGER.log('info', 'initialized', parentObjectName=__class__.__name__)
        self.pathToConfigFile = os.path.join(os.path.dirname(os.path.abspath(__file__)), configFile)
        self.loadConfig()

    def loadConfig(self):
        # check if config file exists
        if (os.path.exists(self.pathToConfigFile) == False):
            LOGGER.log('error', "Could not locate config file: " + self.pathToConfigFile, shouldTerminateApp=True, parentObjectName=__class__.__name__)

        self.config = configparser.ConfigParser()

        try:
            self.config.read(self.pathToConfigFile)
            LOGGER.log('info', 'Config loaded from:' + self.pathToConfigFile, parentObjectName=__class__.__name__)
        except:
             LOGGER.log('error', "Error loading config file", parentObjectName=__class__.__name__, shouldTerminateApp=True, )        


    def get(self, section = False):
        """Gets speciffic entry from config

        Examples:
        ---------

        'test' (str):
            returns config['test'] section

        ['foo', 'bar'] (list):
            returns config['foo']['bar'] section

        False (no param provided):
            returns config sections as dict

        """

        if (section == False):
            return self.config._sections
        if isinstance(section, str):
            return self.config._sections[section]
        if isinstance(section, list):
            c = self.config
            for entry in section:
                c = c[entry]
            return c

class DB:
    """ Database class

    Handles DB connections, and insert method.
    TODO: update insert parameters - one dict instead of multiple args.

    Attributes
    ----------
    dbConfig : dict
        dict with database config as follows:

        {
            'host': '192.168.0.100', 
            'user': 'user', 
            'password': 'password', 
            'database': 'db_name'
        }

    Methods
    -------
    verifyConfig()
        checks if the dbConfig provided to the constructor is correct

    connect()
        connects to DB using config provided by constructor 

    insert()
        performs DB insert operation with parameters provided
    """

    def __init__(self, dbConfig):
        """Constructor; nothing fancy"""
        LOGGER.log('info', '--- ')
        LOGGER.log('info', 'initialised', parentObjectName=__class__.__name__)

        self.connected = False
        self.cursor = False
        self.dbConfig = dbConfig
        self.dbConfig['port'] = int(self.dbConfig['port'])
        self.dbConfig['autocommit'] = True
        
        self.verifyConfig()
        self.connect()
         
    def verifyConfig( self ):
        """Verifies if the config provided is correct."""

        requiredKeys = {'autocommit', 'host', 'user', 'password', 'port', 'database'}

        if requiredKeys ==  self.dbConfig.keys():
            LOGGER.log('info', 'Verifying config file... done', parentObjectName=__class__.__name__)
        else:
            # the two followign variables are used with logger call
            requiredKeys_SL = list(requiredKeys)
            dbConfigKeys_SL = list(self.dbConfig.keys())

            requiredKeys_SL.sort()
            dbConfigKeys_SL.sort()
            LOGGER.log('error', "Verifying config file... ERROR: invalid DB config; expected: [" + ', '.join(requiredKeys_SL) + '] found: [' + ', '.join(dbConfigKeys_SL) + ']', parentObjectName=__class__.__name__, shouldTerminateApp=True)


    def connect(self):
        """Connects to DB, using config dict provided. """

        try:
            self.database = mariadb.connect(**self.dbConfig)
            self.cursor = self.database.cursor(prepared=True)
            #  can log get context?
            LOGGER.log('info', 'connected to database: ' + self.dbConfig['database'], parentObjectName=__class__.__name__ )
            self.connected = True
        except mariadb.Error as e:
            LOGGER.log('error', f"{e}", shouldTerminateApp=True)

    def insert(self, requestDuration, rawData):
        """Performs DB insert method"""

        currentDate = datetime.utcnow()

        rows = []
        keys = []

        for key in rawData:
            # print(key, '->', rawData[key])
            keys.append(key)
            rows.append('\'' + rawData[key] + '\'')

        # add currentDate and requestDuration to keys/rows 

        keys.append('lastUpdated')
        rows.append('\'' + currentDate.strftime('%Y-%m-%d %H:%M:%S') + '\'')

        keys.append('requestDuration')
        rows.append('\'' + str(requestDuration) + '\'')

        if (self.connected == False):
            LOGGER.log('error', "Not connected to any database",  parentObjectName=__class__.__name__)
            return False

        query = f"INSERT INTO recycleschedule ({(', ').join(keys)}) VALUES({(', ').join(rows)})"

        if (self.cursor == False):
            return

        try:
            self.cursor.execute( query )
            LOGGER.log('info', f"insert successful: {query}", parentObjectName=__class__.__name__)
        except mariadb.Error as err:
            LOGGER.log('error', f"{err}", parentObjectName=__class__.__name__, shouldTerminateApp=False)

class SCRAPPER:
    def __init__(self, domConfig):
        self.domConfig = domConfig
        self.content = False
        self.lastrequestDuration = 5
        LOGGER.log('info', '--- ')
        LOGGER.log('info', 'initialised ', parentObjectName=__class__.__name__)

    def getContent(self):
        urlToScrap = self.domConfig['url']
        LOGGER.log('info', 'Fetching ' + urlToScrap + '...', parentObjectName=__class__.__name__)
        try:
            response = req.get(urlToScrap, verify=False)
            # return resp.text
            requestDuration = int(response.elapsed.total_seconds())

            LOGGER.log('info', '...done', parentObjectName=__class__.__name__)
            self.content = response.text
            self.lastrequestDuration = requestDuration
        except:
            LOGGER.log('error', 'Something went wrong...', parentObjectName=__class__.__name__, shouldTerminateApp=True)

    def getFakeContent(self):
        fakeContentFile = 'html.txt'
        pathToContentFile = os.path.join(os.path.dirname(os.path.abspath(__file__)), fakeContentFile)
        if (os.path.exists(pathToContentFile) == False):
            LOGGER.log('error', 'Could not find file with fake content', parentObjectName=__class__.__name__, shouldTerminateApp=True)

        p = Path(pathToContentFile)
        with p.open('r') as f:
            content = f.read()
            LOGGER.log('info', 'Fake content loaded', parentObjectName=__class__.__name__)
            self.content = content

    def removeOrd(self, string):
        """ removes 'st ', 'nd ', 'rd ', 'th ' from date strings"""

        s = string
        ordinals = ['st', 'nd', 'rd', 'th']
        for o in ordinals: 
            s = s.replace(o, '')
        return s

    def parseDate(self, dateString):
        """converts 'date' scraped from the website to an actual date"""

        now = datetime.now()
        theDate = []
        _dateString = self.removeOrd(dateString)
        
        dateList = _dateString.split(' ')
        if (len(dateList) < 2): 
            LOGGER.log('error', f"dateString '{dateString}' doesn't appear to have any spaces...",  parentObjectName=__class__.__name__ )
            return False
                
        try:
            theDate.append(int(dateList[0]))
        except:
            LOGGER.log('error', f"Unable to convert '{dateList[0]}' to int",  parentObjectName=__class__.__name__ )
            return False

        # get numeral value of month
        month = dateList[1]
        try:
            monthNum = strptime(month,'%b').tm_mon
        except:
            LOGGER.log('error', f"{month} doesn't seem to be a 3-letter abbrevation of any month name",  parentObjectName=__class__.__name__ )
            return False

        try:
            theDate.append(strptime(dateList[1],'%b').tm_mon)
        except:
            LOGGER.log('error', f"Something went wrong",  parentObjectName=__class__.__name__ )
            return False

        try:
            theDate.append(int(dateList[2]))
        except:
            theDate.append(now.year)

        # check if theDate list is correct
        if ( len(theDate) != 3):
            LOGGER.log('error', f"theDate doesn't seem to be correct. expected list of three numbers, found '{theDate}'",  parentObjectName=__class__.__name__ )
            return False

        for entry in theDate:
            if (type(entry) != int):
                LOGGER.log('error', f"not all items in theDate are numbers: '{theDate}'",  parentObjectName=__class__.__name__ )
                return False

        parsedDate =  datetime(theDate[2], theDate[1], theDate[0])
        isInThePast = now > parsedDate

        if isInThePast:
            parsedDate = parsedDate.replace(year=now.year + 1)

        return parsedDate.strftime("%Y-%m-%d")

    def parse ( self ):
        if ( self.content ==  False ):
            LOGGER.log('error', 'Could not find content to parse', parentObjectName=__class__.__name__, shouldTerminateApp=True)
        # self.domConfig.get("nextservice")
        soup = BeautifulSoup(self.content, 'html.parser')
        schedules = soup.select(self.domConfig.get("schedules"))
        headings = soup.select('.govuk-grid-column-two-thirds h3' )

        if (len(headings) != 5):
            LOGGER.log('error', 'Error while retrieving headings', parentObjectName=__class__.__name__, shouldTerminateApp=True)

        dicts = []



        for i in range(0, len(headings) -1):
            heading = headings[i].getText()
         
            nextService = schedules[i].select(self.domConfig.get("nextservice"))[0].getText().strip().split(', ')[1]
            lastService = schedules[i].select(self.domConfig.get("lastservice"))[0].getText().strip().split(', ')[1]

            myDict = {
                "nextService": self.parseDate(nextService),
                "lastService": self.parseDate(lastService),
                "serviceNameId": str(i + 1),
            }

            dicts.append(myDict)

        self.parsed = dicts

def main():
    # config
    # ------
    config = CONFIG()

    # scrapper
    # --------
    domConfig = config.get('DOM')
    scrapper = SCRAPPER( domConfig )

    # scrapper - load content

    scrapper.getContent()
    # scrapper.getFakeContent()
    scrapper.parse()

    # database
    # --------
    dbConfig = config.get('db')
    db = DB(dbConfig)
    
    for service in scrapper.parsed:
        db.insert(scrapper.lastrequestDuration,  service)

if __name__ == "__main__":
    # clear()

    clear()
    logger = LOGGER()

    LOGGER.log('info', 'script started')
    main()
