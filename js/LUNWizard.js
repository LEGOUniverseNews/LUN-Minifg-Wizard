/*
    LEGO Universe News! Minifig Wizard

    Created 2013-2014 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
*/

// Global variables for various stuff
var bodyPart, imagesList, rowSize,
    partNumberID, oldPartNumberID, oldPartTypeID,
    imagesList = [],
    rowSize = 4;


$(function() {
    "use strict";
    var $content = $("#content"),
        $background = $("#background"),
        $resizeButton = $("#resize-button"),
        $categoryButtons = $(".category-buttons-th"),
        $categoryButtonsDiv = $("#category-buttons-div");

    // Apply orange bubble and mark as active the first button ("Head").
    // This must be done here to stop the orange bubble from sticking
    // if a (singlular) new category is selected then the table is enlarged.
    // Selecting multiple categories before enlarging is not bugged.
    $(".category-buttons-img:first").addClass("active");
    $(".category-buttons-img:first").addClass("bubble");

    // Find "The Special" who will disarm the Kragle using his interesting abilities
    $("#emmet").dblclick(function() {
        var $SpecialImg = $("#the-special");
        if ($SpecialImg.attr("src") === "img/ui/figure/empty.png") {
            $SpecialImg.attr("src", "img/special/Special001.png");
        } else {
            $SpecialImg.attr("src", "img/ui/figure/empty.png");
        }
    });

    // Export global jQuery variables
    window.$content = $content;
    window.$background = $background;
    window.$resizeButton = $resizeButton;
    window.$categoryButtons = $categoryButtons;
    window.$categoryButtonsDiv = $categoryButtonsDiv;

    // Run process to display the available minifig heads upon page load
    changePartImages("Head");
});


function changeCategoryImages(old, current) {
    "use strict";
    /* Apply orange "bubble" to category image */
    $(document).ready(function() {
        // On hover, if this is not already the active button,
        // apply the bubble to the images
        $(".category-buttons-img").on("mouseover", function() {
            if (!$(this).hasClass("active")) {
                $(this).addClass("bubble");
            }
        });

        // On mouseout, if this is not the active button,
        // remove the bubble to the images
        $(".category-buttons-img").on("mouseout", function() {
            if (!$(this).hasClass("active")) {
                $(this).removeClass("bubble");
            }
        });
    });

    // A button different from the current one was clicked
    if (old !== current) {
        $(".category-buttons-img").click(function() {
            // Swap the orange bubble
            $(old).removeClass("bubble");
            $(current).addClass("bubble");

            // Swap the active label
            $(old).removeClass("active");
            $(current).addClass("active");
        });
    }
}


function changePartImages(part) {
    "use strict";
    /* Parse the XML file for the specified values */
    // Update global variable with chosen part
    bodyPart = part;

    // Construct jQuery id attribute selector
    var partTypeID = "#{0}".format(bodyPart);
    changeCategoryImages(oldPartTypeID, partTypeID);

    // Keep a copy of the old element ID
    oldPartTypeID = "#{0}".format(bodyPart);


    // Fetch the XML for parsing
    $(function() {
        $.ajax({
            type: "GET",
            url: "img/images.xml",
            dataType: "xml",
            success: function(xml) {
                parseXML(xml);
            }
        });
    });
}


function resizeTable() {
    "use strict";
    /* Resizes the table between small and large display */

    // We are currently using the small display
    if (rowSize === 4) {
        // Change the number of items in a row to 6
        rowSize = 6;

        /**
         * Run animations to in/decrease the size/locations of whatever we need
         * In order in which they run for both enlarge and decrease:
         *
         * Resize button (location)
         * Scrollbar
         * Background
         * Category buttons (enlargement)
         * Category buttons (location)
         * Container
         * Left margin
         * Resize button (swap SVGs)
         */

        // CSS transitions are not supported, fallback to jQuery animations
        if (!Modernizr.csstransitions) {
            $resizeButton.animate({"left": "+=190px"}, 300);
            $(".my-tables").animate({"width": "+=180px"}, 300);
            $background.animate({"width": "+=180px"}, 300);
            $categoryButtonsDiv.animate({"margin-left": "+=48px"}, 300);
            $categoryButtons.animate({"padding-left": "5px"}, 100);
            $categoryButtons.animate({"padding-right": "5px"}, 100);
            $content.animate({"width": "+=180px"}, 150);
        }

        // For browsers that do support CSS transitions, trigger them
        $resizeButton.css("transform", "translate3d(190px, 0, 0)");
        $(".my-tables").css("width", "+=180px");
        $background.css("width", "+=180px");
        $categoryButtonsDiv.css("margin-left", "+=48px");
        $categoryButtons.css("padding-left", "5px");
        $categoryButtons.css("padding-right", "5px");
        $content.css("width", "+=180px");

        // Increase the margins on left side of the table to make it all even
        // This runs even if the browser does not support CSS transitions
        $("#minifig-items").css("margin-left", "20px");
        $resizeButton.attr("src", "img/ui/Reduce-button.svg");

        // We are currently using the larger size
    } else {
        // Set the number of items in a row to 4
        rowSize = 4;

        // CSS transitions are not supported, fallback to jQuery animations
        if (!Modernizr.csstransitions) {
            $resizeButton.animate({"left": "-=190px"}, 300);
            $(".my-tables").animate({"width": "-=180px"}, 300);
            $background.animate({"width": "-=180px"}, 300);
            $categoryButtonsDiv.animate({"margin-left": "-=48px"}, 300);
            $categoryButtons.animate({"padding-left": "0px"}, 100);
            $categoryButtons.animate({"padding-right": "0px"}, 100);
            $content.animate({"width": "-=180px"}, 150);
        }

        // For browsers that do support CSS transitions, trigger them
        $resizeButton.css("transform", "");
        $(".my-tables").css("width", "");
        $background.css("width", "");
        $categoryButtonsDiv.css("margin-left", "");
        $categoryButtons.css("padding-left", "");
        $categoryButtons.css("padding-right", "");
        $content.css("width", "-=180px");
        $("#minifig-items").css("margin-left", "5px");
        $resizeButton.attr("src", "img/ui/Enlarge-button.svg");
    }

    // Reconstruct the table using the desired size
    changePartImages(bodyPart);

    // Reapply the orange selection bubble
    reapplyBubble(partNumberID);
}

function reapplyBubble(partNumberID) {
    "use strict";
    /* Preserve orange box around selected item (if present) between resizes */

    // Only perform the class changes if an item is selected
    if (partNumberID !== undefined) {
        // Remove the orange bubble from th selected part
        $(partNumberID).removeClass("selected");

        // 2 milliseconds (and no sooner!) later, reapply the bubble
        // The timeout is required for jQuery to have time to remove the class
        window.setTimeout(function() {
            $(partNumberID).addClass("selected");
        }, 2);
    }
}


function main(partNumber) {
    "use strict";
    /* Change the part image to the selected one */
    var imgID;
    partNumberID = "#{0}".format(partNumber);

    // Get the proper imgID for each part
    switch (bodyPart) {
        case "Torso":
            imgID = "#TorsoImg";
            break;
        case "Leg":
            imgID = "#LegImg";
            break;
        case "Hat":
            imgID = "#HatImg";
            break;
        case "Shield":
            imgID = "#ShieldImg";
            break;
        case "Sword":
            imgID = "#SwordImg";
            break;
        case "Head":
            imgID = "#HeadImg";
            break;
    }

    // The user clicked a new part, swap orange background
    if (oldPartNumberID !== partNumberID) {
        $(oldPartNumberID).removeClass("selected");
        $(partNumberID).addClass("selected");
    }

    // Set the old part number
    oldPartNumberID = "#{0}".format(partNumber);

    // Change the image to the selected one
    $(imgID).attr("src", imagesList[partNumber]);
}


function parseXML(xml) {
    "use strict";
    /*
    Update the table with the proper images as
    specified by the part parameter.
    */
    var imgLink, fullImgLink, tableString,
        index = 0,
        numOfImages = 0,
        partNumber = 0;

    // Clear the array of full size images if it contains data
    if (imagesList[0]) {
        $.each(imagesList, function(value) {
            imagesList.splice(value, imagesList.length);
        });
    }

    // Get the URL's to each full size image, add to imagesList array
    $(xml).find(bodyPart).each(function() {
        fullImgLink = $(this).find("image").text();
        imagesList.push(fullImgLink);
    });

    // Clear the table of any previous images
    $("#minifig-items").empty();

    // Construct the beginning of the table data
    tableString = '<tr><td class="selector" id="0">';

    // Get the total number of images for this part
    $(xml).find(bodyPart).each(function() {
        numOfImages += 1;
    });

    // Go through all the images, adding them to the table
    $(xml).find(bodyPart).each(function() {
        partNumber += 1;

        // Bring it back down to work with array indexes
        index = partNumber - 1;
        imgLink = $(this).find("thumb").text();

        // Wrap the URL in an img tag, wrap that in a link, add it to the table
        /* jshint ignore:start */
        tableString += '<a name="{0}" onclick="main(this.name)"><img alt="{1} #{2}" width="64" height="64" src="{3}" /></a>'.format(
            index, bodyPart, partNumber, imgLink);
        /* jshint ignore:end */

        /* Check if
        a. we have not run through all the images
        b. the index is a multiple of the current row size,
        c. we are not at the start of the images

        If all this is true, then make a new table row.
        */
        //FUTURE FIXME I'm sure this can be majorly cleaned up
        if (partNumber !== numOfImages && (partNumber % rowSize) === 0 && partNumber !== 0) {
            tableString += '</td></tr><tr><td class="selector" id="{0}">'.format(partNumber);
        } else {

            /* Check if we have not run through all the images.
            if it is not, start a new table column
            */
            if (partNumber !== numOfImages) {
                tableString += '</td><td class="selector" id="{0}">'.format(partNumber);
            } else {
                // Otherwise, close the table column without making a new one
                tableString += "</td>";
            }
        }
    });

    // Finally, display the table with the images
    $("#minifig-items").append(tableString);

    // Display the scroll bar when needed for both layout sizes
    if ((rowSize === 4 && numOfImages > 16) || (rowSize === 6 && numOfImages > 24)) {
        $(document).ready(function() {
            // Activate scroll bar
            $content.perfectScrollbar({
                wheelSpeed: 30,
                suppressScrollX: true
            });
        });

        // The scroll bar is not needed, destroy it
    } else {
        $(document).ready(function() {
            $content.perfectScrollbar("destroy");
        });
    }
}
