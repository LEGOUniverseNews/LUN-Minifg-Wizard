#! /usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    LEGO Universe News! Minifig Wizard

    Created 2013 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
"""

import sys
import os

# If this is Python 3, use input()
if sys.version_info >= (3, 0):
    get_input = input

# If this is Python 2, use raw_input()
elif sys.version_info <= (2, 7):
    get_input = raw_input

# Store the final file lists for writing
thumbList = []
imageList = []

# All folders images are stored in
imageFols = ["hats", "heads", "legs", "torsos", "items/LHand", "items/RHand"]

# All valid XML tag names
tagNames = ["Hat", "Head", "Leg", "Torso", "LHandItem", "RHandItem"]

# Location of output XML file
xmlPath = os.path.join("..", "img", "images.xml")

# Special images to remove optional item
noImageXML = ["<thumb>img/Clear-Selection.png</thumb>",
              "<image>img/ui/figure/empty.png</image>"]


for num in range(0, len(imageFols)):
    # Go through every subfolder in `img`
    for root, dirnames, filenames in os.walk(
            os.path.join("..", "img", "{0}".format(imageFols[num]))):

        # Get each file in the list
        for files in filenames:
            bodyType = root.split(os.path.sep)
            myFile = os.path.join(root, files)

            # Split each folder into the proper sections
            if bodyType[2] == "hats":
                tagName = tagNames[0]
            elif bodyType[2] == "heads":
                tagName = tagNames[1]
            elif bodyType[2] == "legs":
                tagName = tagNames[2]
            elif bodyType[2] == "torsos":
                tagName = tagNames[3]
            elif bodyType[2] == "items/LHand":
                tagName = tagNames[4]
            elif bodyType[2] == "items/RHand":
                tagName = tagNames[5]

            # The Web uses forward slashes
            if os.path.sep in myFile:
                myFile = myFile.replace("\\", "/")

            # Construct entry for thumbnail
            if bodyType[3] == "thumb":
                subTagName = "thumb>"
                thumbList.append("<{0}{1}</{0}".format(
                    subTagName, myFile[3:]))

            # Construct entry for full-size image
            else:
                subTagName = "image>"
                imageList.append("<{0}{1}</{0}".format(
                    subTagName, myFile[3:]))


# There were no images to make an XML
if len(thumbList) == 0:
    print('''Could not find any images! Ensure there are images at\n
{0}'''.format(os.path.abspath(os.path.dirname(xmlPath))))

    # Abort only on user input
    print("\nAn XML file has not been generated.")
    get_input("\nPress Enter to close.")
    raise SystemExit(0)

# Begin the file contents
with open(xmlPath, "wt") as f:
    f.write('''<?xml version="1.0" encoding="UTF-8"?>
<Minifigure>''')

# Each part is accessed by it's index
# Since each list (should be) the same length,
# we only need the length of one of them.
thumbListLen = len(thumbList)

# There is not the same number of thumbnails and images
if thumbListLen != len(imageList):

    # There are more thumbnails than images
    if thumbListLen > len(imageList):
        print('''A thumbnail does not have a corresponding full size image.
Double check all the "thumb" and "full" folders and fix this error before
continuing.''')

    # There are more images than thumbnails
    else:
        print('''A full size image does not have a corresponding thumbnail.
Double check all the "thumb" and "full" folders and fix this error before
continuing.''')

    # Abort only on user input
    print("\nAn XML file has not been generated.")
    get_input("\nPress Enter to close.")
    raise SystemExit(0)


for listIndex in range(0, thumbListLen):
    # Create the proper XML divider
    blah = thumbList[listIndex].split("/")
    if blah[1] == "hats":
        divide = tagNames[0]
    elif blah[1] == "heads":
        divide = tagNames[1]
    elif blah[1] == "legs":
        divide = tagNames[2]
    elif blah[1] == "torsos":
        divide = tagNames[3]
    elif (blah[1] == "items" and blah[2] == "LHand"):
        divide = tagNames[4]
    elif (blah[1] == "items" and blah[2] == "RHand"):
        divide = tagNames[5]

    # Write the None Image for Hats and Items
    if divide in (tagNames[0], tagNames[4], tagNames[5]):
        with open(xmlPath, "at") as f:
            f.write("\n\t<{0}>".format(divide))
            f.write("\n\t\t{0}".format(noImageXML[0]))
            f.write("\n\t\t{0}".format(noImageXML[1]))
            f.write("\n\t</{0}>".format(divide))

    # Write our XML document
    with open(xmlPath, "at") as f:
        f.write("\n\t<{0}>".format(divide))
        f.write("\n\t\t{0}".format(thumbList[listIndex]))
        f.write("\n\t\t{0}".format(imageList[listIndex]))
        f.write("\n\t</{0}>".format(divide))


# Finish off the file
with open(xmlPath, "at") as f:
    f.write("\n</Minifigure>\n")

# Delete now unneeded lists
del blah[:]
del bodyType[:]


# Success!
print('''A new XML file has been successfully generated and saved to\n
{0}'''.format(os.path.abspath(xmlPath)))
get_input("\nPress Enter to close.")
raise SystemExit(0)
