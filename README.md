###The script
<pre>
javascript:$.getScript('https://dl.dropboxusercontent.com/u/26362756/laEnhancer/main.js');void(0);
</pre>

###Settings Menu
![Settings Menu](https://raw.githubusercontent.com/ntoombs19/LA-Enhancer/master/settings.jpg)

###What it does
This script has 3 main features: Filtering, page loading, and key commands. As you can see in the settings panel, you have the ability to load 1 page or all pages by setting last page to 'max'. So, "load pages 1 to max" will load all the pages. The script will show you what page is currently loading so your browser won't hang. For users with a poor network connection, the page loading can take a long time so loading fewer pages at a time would probably be a good idea. When clicking A, B, or C, the row containing those buttons will be hidden. If an error occurs such as "Not enough units" or "You can only send 5 attacks per second", the row will reappear and my script will not think it has been farmed yet. By setting filters, you can farm even faster by not having to check for various factors such as the last report, wall level, estimated resources, or whether the last attack received a full or partial haul. Those "info" images will provide details as to what that particular feature will do when you hover over it. The script also includes integration with the [FA Keypress](http://forum.tribalwars.net/showthread.php?270283-FA-KeyPress) script to allow you to farm even faster. Now you can farm with the master button so you won't have to think about which button to click.

_Disclaimer: there is no validation for correct input. It is the users responsibility to ensure all inputs have valid values._

###Filters
* Load Pages: Load's a set number of pages. The first input is the start page, the second number is the end page. Setting this to max will automatically use the last page.
* Order/Direction: Selects what the pages will be ordered by and in what direction. This setting and the load pages setting cannot be changed after running the script for the first time. To change these settings, the page will need to be reloaded and the script run again.
* Hide farmed rows: Saves the the village coordinates of any village you send troops to using this script in the browsers cache. If this filter is enabled, the script will hide all villages that have had troops sent to it since x amount of time. The format is in minutes so for 2 hours, the input would be 120 minutes. Changing this value will not change the time for villages already in the cache but will be the timeout for villages farmed after that value was changed. It is important to note that this does not set the timer once the attack lands but rather sets the timer when the attack is sent. Clicking the reset button will only reset the rows that are loaded on the page (including hidden rows). It will not reset rows if those rows are not loaded.
* Hide/show continent(s): Hides or shows a list of continents separated by a comma. This is useful if the terms of a diplomatic relationship with another tribe is to not farm in their K.
* Middle column filters: These filters will only be applied if the check box next to them is enabled.
* Hide hauls: will hide whichever radio button is selected.
* Hide attacks: Hide's rows where the number of attacks going to that village is greater than, less than, or equal to a number.
* Hide wall lvl: Hides rows where the wall level is greater than, less than, or equal to a number. Rows where the wall lvl is a question mark will be assumed to have a wall lvl of zero.
* Hide distances: Hides rows greater than, less than, or equal to (pointless?) a number. This input can have a decimal value (eg. 30.2)
* Hide scout reports: Will remove rows where the estimated resources are greater than, less than, or equal to a number. Rows without any resource information will be assumed to have 0 resources.
* Attack time filter: Hides/shows villages attacked within a certain time. Useful for C farming.
* Hide reports: Checked report types will be hidden.
* Apply/Reset: Clicking "Apply Filters" will run through all the rows and hide any rows that match a filter setting. Clicking "Reset Table" will show all rows loaded even if they were hidden by clicking the button or by a filter.

###Profiles
Profiles allow the user to save settings in their browsers cache for later use.
* Create new: Creates a new profile with the current settings. The user will be prompted to set a name for the profile. Profiles cannot have the same name.
* Set default: Sets the selected profile to the default profile.
* Delete: Deletes the currently selected profile. The user will be prompted to confirm they wish to delete the profile. The default profile can not be deleted.
* Update: Setset the current inputs to the selected profile.
* Export: Retrieves a string of text containing all the settings to be pasted in a notebook, forum, or mail.
* Import: Opens prompt to paste exported settings

###Keypress Settings
I stole this feature from crimsoni's [FA keypress script](http://forum.tribalwars.net/showthread.php?270283-FA-KeyPress). This aspect of the script works the same as that script. I recommend only mapping numbers, letters, and arrows for the keypress settings. Some of the characters won't show in text box the way they do on your keyboard so it may get confusing if you use anything other than the recommended keys.

###Master Button Settings
This is what controls what action is taken when clicking the master button. If an MBS is enabled (checked) the script will look at that MBS and perform the selected action (A, B, C, Skip) if the row matches the profile. If the row does not match the first enabled MBS profile the script will then look at the next enabled MBS profile to see if it's a match and perform the action if it is. This process will occur for each enabled MBS in order until the row matches one of the profiles and the selected action is performed. If the row matches none of the profiles then the default action will be taken.

###Languages
For those interested in viewing this script in a particular language, you can translate the following text into that language and I will add it to the script. Just change the text inside the quotes. Also be sure to tell me what language it is.
<pre>
//Language: English
//Translator: ntoombs19
var filter_01 = "FA Filter Settings";
var filter_02 = "Instructions";
var filter_03 = "Created by";
var filter_04 = "Load Pages";
var filter_05 = "to";
var filter_06 = "Enable";
var filter_07 = "Hide All/None";
var filter_08 = "Scout Attack";
var filter_09 = "No losses";
var filter_10 = "Some losses";
var filter_11 = "Lost, but damaged building(s)";
var filter_12 = "Lost,but scouted";
var filter_13 = "Lost";
var filter_14 = "Order By";
var filter_15 = "Distance";
var filter_16 = "Time";
var filter_17 = "Direction";
var filter_18 = "Ascending";
var filter_19 = "Descending";
var filter_20 = "Hide Hauls";
var filter_21 = "Full";
var filter_22 = "Partial";
var filter_23 = "Hide Attacks";
var filter_24 = "Greater Than";
var filter_25 = "Less Than";
var filter_26 = "Equal To";
var filter_27 = "Hide farms sent to in the last";
var filter_28 = "minutes";
var filter_29 = "Reset";
var filter_30 = "Hide Wall Lvl";
var filter_31 = "Hide Distances";
var filter_32 = "Hide";
var filter_33 = "Show";
var filter_34 = "continent(s)";
var filter_35 = "Hide scout reports with resources";
var filter_36 = "villages attacked in the last";
var filter_37 = "minutes(s)";
var filter_38 = "Run default automatically";
var filter_39 = "Hide scout reports where C is disabled";
var filter_40 = "Farm Assistant";
var filter_41 = "Farm Assistant - Loading page";
var filter_42 = "Language";
var instructions_01 = "Checked report types will be hidden";
var instructions_02 = "Filters left unchecked will not be applied";
var instructions_03 = "Separate continents with a period. Example: 55.54.53";
var instructions_04 = "This filter will hide rows that were farmed \"n\" minutes ago. The default is 60 minutes. Changing the time will only affect newly farmed rows. Clicking reset will reset all the timers for each row but only the rows loaded.";
var instructions_05 = "Save and load your various settings configurations here. Changing profiles will load the selected profile. The default will load automatically when the script is run.";
var instructions_06 = "Adjust page size to 100 for faster page loading";
var dialog_01 = "Are you sure you want to reset your recently farmed villages?";
var dialog_02 = "You are already on the default profile. Would you like to create a new profile and set it to default?";
var dialog_03 = "Profile name";
var dialog_04 = "You already have a profile with that name. Please choose another name";
var dialog_05 = "Your profile name cannot be empty. Please try again.";
var dialog_06 = "You cannot delete your default profile";
var dialog_07 = "You cannot export/import the default profile. To export these settings, create a new profile, then try exporting again.";
var dialog_08 = "Copy to clipboard: Ctrl+C, Enter";
var dialog_09A = "[b]FA Filter: ";
var dialog_09B = "[/b][spoiler][i][u]Instructions[/u]: To import this profile, copy the following line of code then import the copied settings by pasting them into the prompt after clicking import on the FA Filter Script settings panel[/i][code]";
var dialog_09C = "[/code][/spoiler]";
var dialog_10 = "Profile Settings";
var dialog_11 = "Ctrl+V to paste here settings here";
var dialog_12 = "You already have a profile with that name.";
var dialog_13 = "Reload this script to see the new language. This page will refresh automatically.";
var profile_01 = "Settings profile";
var profile_02 = "Apply";
var profile_03 = "Reset";
var profile_04 = "New";
var profile_05 = "Set Default";
var profile_06 = "Delete";
var profile_07 = "Update";
var profile_08 = "Export";
var profile_09 = "Import";
var profile_10 = "Default";
</pre>
####Languages currently supported:
* English
* Spanish
* Arabic
* Greek
* Italian

###Future Improvements
* Hide success messages, error messages, or both
* Asynchronous page loading
* Sorting by wall and resources
* Village priority list to farm from more important villages first
* Custom troop order (send certain troops first, second, third, etc...)
* Custom filtering besides wall and distance
* Auto pagination to reduce page loading time
* Add two new versions (FA Filter Lite, and FA Filter Mobile)
