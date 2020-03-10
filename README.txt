CIS 422 Project 2: SiteStall
Lucas Hyatt, Jimmy Lam, Claire Kolln, Noah Tigner, Sean Wilson
Created: 3/8/20

Description:
    SiteStall is a Firefox web browser extension specifically geared towards
    keeping digital distractions at a minimum for users. The user will be
    able to specify an amount of time to be on distraction websites, such as
    youtube.com or facebook.com, and the user will be able to create a custom
    block list for those websites. Once the time expires, the user will be
    immediately redirected out of the distraction website they are currently on,
    and it will inform the user their time is up.

Installation Instructions:
    SiteStall can be downloaded from our GitHub repository, as explained below.

    Downloading the source files:
        1. Navigate to https://github.com/SiteStall/SiteStall
        2. Select ‘Clone or Download’ and then ‘Download ZIP’ and save the .zip file
           to a location of your choosing.
        3. Decompress the zip file by double clicking the file.

    Installing SiteStall onto Firefox:
        1. Open the Firefox internet browser.
        2. Navigate to the Firefox extension page by entering

                about:debugging#/runtime/this-firefox

           into the search bar.
        3. Click ‘Load Temporary Add-On’ under the 'Temporary Extensions' tab.
        4. Navigate to where the decompressed zip file is stored on your computer and
           a. Select manifest.json
           b. Click ‘Open’
        5. You will now see the SiteStall extension loaded under "temporary Extensions".
           In addition, the SiteStall widget can be found at the top right of the toolbar
           (the blue pause icon) in Firefox.

Running SiteStall:
    Once the extension has been installed, the extension can be run by clicking on the
    SiteStall (blue pause icon) widget on the Firefox toolbar. Enter the desired daily
    limit time as well as the websites to be added on the block list. Click save in order
    to save the website list created. Once you click outside the widget, hence closing it,
    the timer will automatically start in the background. Click on the widget again in
    order to see the time remaining.

Usage Notes:
    1. The SiteStall extension is NOT accessible from the about:debugging page or the default
       Firefox startup page. The extension can only be opened on a page with a valid URL.
    2. The daily time limit countdown occurs only if:
       a. A daily limit has been set
       b. A site in the blocklist is open and active
       c. The SiteStall widget is closed. Opening the widget while on a site that is in the
          Blocklist pauses the countdown
    3. Please see the SiteStall User Documentation for a more detailed breakdown
       on how to use the software.


Directory Structure:
    In the unzipped folder, there will be the files responsible for blocking the websites,
    the page to be redirected to after the time expires, and manifest.json, which is
    used by Firefox to load the extension.

    The following are subdirectories used by SiteStall:

        icons:
            Contains image files used by SiteStall.

        prototype1:
            Contains our initial website blocker prototype
            written in python. The files here do not interact with the current SiteStall
            extension.

        widget:
            Contains files to be used by the extension widget as well as
            the stats files required to create the statistics page.



