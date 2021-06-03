#! /usr/bin/python3

import smtplib, ssl
import requests as req
import sys
req.packages.urllib3.disable_warnings()

from bs4 import BeautifulSoup
import pprint
import os
import logging
import inspect

pp = pprint.PrettyPrinter(indent=4)
headers = {
	'authority': 'www.amazon.co.uk',
	'pragma': 'no-cache',
	'cache-control': 'no-cache',
	'rtt': '50',
	'downlink': '10',
	'ect': '4g',
	'sec-ch-ua': 'Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
	'sec-ch-ua-mobile': '?0',
	'upgrade-insecure-requests': '1',
	'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	'sec-fetch-site': 'same-origin',
	'sec-fetch-mode': 'navigate',
	'sec-fetch-user': '?1',
	'sec-fetch-dest': 'document',
	'referer': 'https://www.amazon.co.uk/s?k=ps5&ref=nb_sb_noss_2',
	'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7'
}

class LOGGER:
    def __init__(self, logFileName="logfile.log"):
        pathtoLogFile = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), logFileName
        )
        logging.basicConfig(
            filename=pathtoLogFile,
            level=logging.DEBUG,
            format="%(asctime)s %(levelname)-8s %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        LOGGER.log("info", "---")
        LOGGER.log("info", "initialised ", parentObjectName=__class__.__name__)

    # @staticmethod
    def log(level, message, shouldTerminateApp=False, parentObjectName=False):
        # print('log name!', __class__)
        # get name of a function/method (a.k.a. context) that called log
        curframe = inspect.currentframe()
        calframe = inspect.getouterframes(curframe, 2)
        context = calframe[1][3]

        preparedMessage = ""

        if parentObjectName:
            preparedMessage += "[" + parentObjectName + "]"

        if context != "__init__":
            preparedMessage += "[" + context + "]:"
        else:
            preparedMessage += "[" + 'constructor' + "]:"

        preparedMessage += " " + message

        loggingLevel = getattr(logging, level)
        loggingLevel(preparedMessage)
        if shouldTerminateApp == True and level == "error":
            sys.exit(preparedMessage)
        else:
            print(preparedMessage)

class Scrapper:
	def __init__(self):
		if (len(sys.argv) < 2):
			LOGGER.log("error", 'no product url provided', True)
		else:
			self.url = sys.argv[1]

		self.mailPassword = 'qaroxgbfnbydqwkm'
		self.mailSender = "lordzix@gmail.com"
		self.itemName = ''
		self.isItemAvailable = False

		self.addToCartButton = '#add-to-cart-button'
		self.outOfStockTag = '#outOfStock'
		self.titleSpan = '#productTitle'

	def message(self):
		msg = self.itemName
		if (self.isItemAvailable ):
			msg += ' is available!'
		else: 
			msg += ' is unavailable'
		
		print(msg)
	

	def parse(self):
		print('parse', __class__.__name__)
		soup = BeautifulSoup(self.content, "html.parser")
		isAvailable = soup.select(self.addToCartButton)
		isOutOfStock = soup.select(self.outOfStockTag)
		self.itemName = soup.select(self.titleSpan)[0].getText().strip()
		if (len(isAvailable) > 0 ):
			self.isItemAvailable = True
			LOGGER.log("info", self.itemName + 'is available')
		else:
			LOGGER.log("info", self.itemName + 'is not available')
		
	def getUrlContent(self):
		try:
			response = req.get(self.url, headers=headers)

			self.content = response.text

			# with open("response.html", "w") as f:
			# 	f.write(response.text)
			# LOGGER.log("info", 'content saved to response.html')
			
		except Exception as e:
			LOGGER.log("error", e, True)
	def sendMail(self):
		if not self.isItemAvailable:
			sys.exit('not available. sending mail aborted')

		subject = 'SCRAPPER: '+ self.itemName + 'is available!'
		text = self.itemName + ' is available: ' + self.url

		message = 'Subject: {}\n\n{}'.format(subject, text)

		smtp_server = "smtp.gmail.com"
		port = 587  # For starttls
		sender_email = self.mailSender
		receiver_email = self.mailSender
		context = ssl.create_default_context()

		# Try to log in to server and send email
		try:
			server = smtplib.SMTP(smtp_server,port)
			
			server.ehlo()  # Can be omitted
			server.starttls(context=context)
			server.ehlo()  # Can be omitted
			server.login(self.mailSender, self.mailPassword)
			server.sendmail(self.mailSender, self.mailSender, message)
			LOGGER.log("info", "email sent.")
			# TODO: Send email here
		except Exception as e:
			# Print any error messages to stdout
			LOGGER.log("error", e)
		finally:
			server.quit()

if __name__ == "__main__":

	logger = LOGGER('stockchecker.log')

	scrapper =  Scrapper()

	scrapper.getUrlContent()
	scrapper.parse()
	scrapper.sendMail()
