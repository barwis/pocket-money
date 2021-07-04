import sys
import uuid
import os
from PIL import Image, ImageDraw, ImageFont
from ppadb.client import Client as AdbClient
from time import time, sleep
import cv2
import numpy
from itertools import product

client = AdbClient(host="127.0.0.1", port=5037)

devices = client.devices()

if len(devices) == 0:
    print('no device attached')
    quit()

device = devices[0]

#  E:\backup z c\workspace\smart-home\services\pokemonGo

root = os.path.dirname(os.path.abspath(__file__))

# b7c468c0-c28a-459f-92ca-0a190a2c9181
screenshotDirName = str(uuid.uuid4())
screenshotName = 'full.png'

fullScreenshotDirPath = os.path.join(root, screenshotDirName)
fullScreenshotImagePath = os.path.join( fullScreenshotDirPath, screenshotName)

def createScreenshotDir():
    os.mkdir(fullScreenshotDirPath )
    return fullScreenshotDirPath


def takeScreenshot():
    print('grabbing screenshot...')
    image = device.screencap()
    with open(fullScreenshotImagePath, 'wb') as f:
        f.write(image)
    return fullScreenshotImagePath



def tile(dir_in, dir_out):
    filename = screenshotName
    dirOut = os.path.join(dir_in, dir_out)
    os.mkdir(dirOut)
    name, ext = os.path.splitext(filename)
    img = Image.open(os.path.join(dir_in, filename))
    w, h = img.size
    dx = int(w / 10)
    # dy = h / 10
    # if (mean):
    # else:
    grid = list(product(range(0, h-h%dx, dx), range(0, w-w%dx, dx)))
    strout = ''
    for i, j in grid:
        box = (j, i, j+dx, i+dx)
        if j == 0:
            strout += "\n"

        strout += '[' + str(i) + ', ' + str(j) + ']'
        out = os.path.join(dirOut, f'{name}_{i}_{j}{ext}')
        img.crop(box).save(out)
        # print(strout)
        r, g, b = getMeanColor(out)


def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)

def getMeanColor(image): 
    myimg = cv2.imread(image)
    avg_color_per_row = numpy.average(myimg, axis=0)
    avg_color = numpy.average(avg_color_per_row, axis=0)
    r, g, b = avg_color
    # print('avg_color', int(r), int(g), int(b))
    # print(colored(int(r), int(g), int(b), 0))


# def imageToChunks(imgPath):
#     im = Image.open(imgPath)
#     width, height = im.size
#     print(width, height)

screenshotDirPath = createScreenshotDir()
screenShotPath = takeScreenshot()
# imageToChunks(screenShotPath)
tile(fullScreenshotDirPath, 'chunks')

# print(screenShotPath)

# positions = {
#     'OPEN_MENU': '540 1770',
#     'CLOSE_MENU': '540 1770',
#     'MENU_POKEDEX': '239 1005',
#     'MENU_BATTLE': '840 1005',
#     'MENU_SHOP': '540 1300',
#     'MENU_POKEMON': '239 1595',
#     'MENU_ITEMS': '840 1595'
# }




# def grabScreenshot():
#     print('grabbing screenshot...')
#     image = device.screencap()
#     with open(screenshotFullPath, 'wb') as f:
#         f.write(image)

def open_menu():
    print('open menu')
    device.shell('input tap ' + positions['OPEN_MENU'])


def close_menu():
    print('close menu')
    device.shell('input tap ' + positions['CLOSE_MENU'])

def open_pokedex():
    print('opening pokedex')
    device.shell('input tap ' + positions['MENU_POKEDEX'])

def open_pokemons():
    print('opening pokemons list...')
    device.shell('input tap ' + positions['MENU_POKEMON'])


def swipe():
    print('swipe...')
    device.shell('input touchscreen swipe 360 640 360 1015 500')


def wait(seconds):
    print('waiting ' + str(seconds) + ' seconds...')
    sleep(seconds)


def analyze_pokemons():
    image = Image.open('asd.png')
    image = numpy.array(image, dtype=numpy.uint8)
    pixels = [list(i[:3]) for i in image[788]]
    pixelNumber = 0
    for i, pixel in enumerate(pixels):
        r, g, b = [int(i) for i in pixel]
        print(pixelNumber, ':', r, g, b)
        pixelNumber += 1


# def run_sequence():
#     # open_menu()
#     wait(3)
#     # open_pokemons()
#     # wait(3)
#     # swipe()
#     # wait(1)
#     grabScreenshot()
#     print('sequence finished.')



# run_sequence()

# grabScreenshot()
# [109 237 183 255]

# analyze_pokemons()
# print(os.path.dirname(os.path.abspath(__file__)) )
# grabScreenshot()