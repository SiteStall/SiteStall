"""
    This file saves user data, such as the website block list.

    Author: Jimmy Lam
    Last Modified: 2/24/20
"""

import subprocess

# ---------------------------------------------
should_print = 1  # will not print anything if value is 0; for debugging
# ---------------------------------------------

def printInfo(string: str, printType: str = '', alwaysPrint=False):
    """ For debugging purposes. Allows developers to disable all
        printing from io.py to the terminal by modifying the global
        variable 'should_print'

        printType:
            'o': prints OK in green, followed by the string
            'w': prints WARNING in orange, followed by the string
            'e': prints ERROR in red, followed by the string
            'u': prints string as underlined
           else: regular printing, will be disabled if should_print = 0
    """
    ok = "\033[38;5;46mOK\033[0m: "
    warning = "\033[38;5;208mWARNING\033[0m: "
    error = "\033[38;5;196mERROR\033[0m: "

    if should_print == 0 and not alwaysPrint:
        return

    printType = printType.lower()
    if printType == 'o':
        print(ok, string)
    elif printType == 'w':
        print(warning, string)
    elif printType == 'e':
        print(error, string)
    elif printType == 'u':
        print("\033[4m{}\033[0m".format(string))
    else:
        print(string)


def websiteIsValid(website: str) -> bool:
    """ This function uses the nslookup utility found on the
        terminal to determine whether or not a website is valid.
        This is used instead of ping since ping can stall.
    """
    try:
        command = ['nslookup', website]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if 'NXDOMAIN' in result.stdout:
            return False
        else:
            return True
    except:
        printInfo("Could not validate website", 'w')
        return True

def saveWebsites(website, eraseFirst=False, onlySaveIfValid=False):
    """ Saves argument website to websites.txt. If the file does not exist,
        this function will create it.

    Args:
        website: Can either be a single website or a list of websites.
        eraseFirst: If False, this function appends the website(s) to
                    websites.txt. If True, this function erases the
                    contents of websites.txt first before writing to it.
    """
    savedList = []  # the sites to be caved
    websiteList = []  # use this since website argument can be either str or list

    if isinstance(website, str):
        websiteList.append(website)
    elif isinstance(website, list):
        websiteList = website
    else:
        printInfo("(saving) Argument website should be string or list, not {}".format(type(website)), 'e')
        return

    # add websites to savedList
    for site in websiteList:
        # error checking
        if websiteIsValid(site) is False:
            printInfo("(saving) '{}' may not be a valid website".format(site), 'w')

        # add websites to save list
        if onlySaveIfValid and websiteIsValid(site):
            savedList.append(site)
        elif onlySaveIfValid is False:
            savedList.append(site)

    # set file writing mode
    if eraseFirst is True:
        mode = 'w'
    else:
        mode = 'a'

    # write to websites.txt
    with open('websites.txt', mode) as f:
        for site in savedList:
            f.write('{}\n'.format(site))

    if len(savedList) > 0:
        printInfo("The following websites were written to websites.txt:", 'o')
        for site in savedList:
            printInfo("\t{}".format(site))

def getWebsites(getAll=False, checkDuplicates=True):
    """ Returns a list of websites taken from websites.txt. If websites.txt
        does not exist, returns an empty list.

    Args:
        getAll: if False, only return websites that have been verified. if
                True, return all the websites from the file regardless.
        checkDuplicates: if True, does not add a duplicate website frim the file.
    """
    websiteList = []  # the list to be returned
    errorList = []    # websites that were invalid, only for debugging

    try:
        with open('websites.txt', 'r') as f:
            for line in f:
                line = line.strip()

                # append websites read from file, unvalidated
                if getAll:
                    if line != '':
                        # only add unique websites if checkDuplicates is True
                        if checkDuplicates:
                            if line not in websiteList:
                                websiteList.append(line)
                        else:
                            websiteList.append(line)

                    # for debugging
                    if not websiteIsValid(line):
                        errorList.append(line)

                # only append websites that have been validated
                else:
                    if websiteIsValid(line):
                        if line != '':
                            # only add unique websites if checkDuplicates is True
                            if checkDuplicates:
                                if line not in websiteList:
                                    websiteList.append(line)
                            else:
                                websiteList.append(line)
                    else:
                        errorList.append(line)

        if len(errorList) > 0:
            printInfo("(reading) The following websites may not be valid:", 'w')
            for site in errorList:
                printInfo("\t{}".format(site))

        return websiteList

    except FileNotFoundError:
        printInfo("(reading) Could not open websites.txt, returning empty list", 'w')
        return websiteList

    except:
        printInfo("function getWebsites() failed", 'e')


if __name__ == '__main__':
    siteList = ['youtube.com', 'yyoutube.com', 'yyoytube.com', 'fakebfgdfv.com', 'test.py', 'hi.txt', 'nope.html']

    printInfo('saving sample websites', 'u')
    saveWebsites(siteList, eraseFirst=True)

    printInfo('\nReading from websites.txt', 'u')
    gotSites = getWebsites(True)
    printInfo('got {} website(s) from websites.txt: {}'.format(len(gotSites), gotSites))
