import os
import subprocess

def flushCache():
    '''
    Flushes the DNS Cache to prevent cached pages from circumventing the blocking system.

    Author: Noah Tigner

    Args:

    Returns:
    '''

    # os.system("sudo dscacheutil -flushcache")
    # os.system("sudo killall -HUP mDNSResponder")
    # os.system("sudo killall mDNSResponderHelper")
    # os.system("sudo dscacheutil -flushcache")

    commands = [['sudo',  'dscacheutil', '-flushcache'],
                ['sudo',  'killall', 'mDNSResponderHelper'], 
                ['sudo',  'killall', '-HUP', 'mDNSResponder']]

    for command in commands:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        # print(result.stdout)
        # print(result.stderr)

    # FIXME: might be overkill...
    # # Absoultely Nuke the cache
    # # CAUTION # ----------------------------------------------------------------
    # cacheLocations = ['~/Library/Caches/Google/Chrome/Default', 
    #                 #   '~/Library/Application\ Support/Google/Chrome',
    #                   '~/Library/Application\ Support/Google/Chrome/Default/Application\ Cache',
    #                   ]
    # 
    # for location in cacheLocations:
    #     process = subprocess.run(['sudo', 'chmod',  '777', location], 
    #                     stdout=subprocess.PIPE, 
    #                     universal_newlines=True)
    #     print(process)
    #     process = subprocess.run(['sudo', 'rm',  '-r', location], 
    #                     stdout=subprocess.PIPE, 
    #                     universal_newlines=True)
    #     print(process)
    # # CAUTION # ----------------------------------------------------------------


def block(blocklist, flush=False):
    '''
    Prevents Access to the websites specified by the blocklist.
    Sites are blocked by modifying /etc/hosts

    Author: Noah Tigner

    Args: 
        blocklist, a list of websites to block
        flush, a boolean to determine if the DNS Cache should be Flushed

    Returns:
    '''

    redirect = "127.0.0.1"

    if flush:
        flushCache()

    # Clear previously blocked websites from /etc/hosts
    unblock()

    # Append websites to /etc/hosts
    with open("/etc/hosts", 'a') as file:
        file.write("# SiteStall: The following websites are being blocked\n")
        # TODO: Do we need to enumerate all the differenet prefix combos?
        for site in blocklist:
            file.write(redirect + ' ' + site + '\n')
            file.write(redirect + ' ' + site.replace("www.", '') + '\n')
            file.write(redirect + ' ' + "https://" + site + '\n')

def unblock():
    '''
    Allows access to all previously blocked websites

    Author: Noah Tigner

    Args:

    Returns:
    '''

    # Grab all the lines in /etc/host
    with open("/etc/hosts", 'r') as file:
        lines = file.readlines()

    # Write back all the lines EXCEPT those previously used for blocking
    with open("/etc/hosts", 'w') as file:
        for i, line in enumerate(lines):

            if "# SiteStall" in line:
                break

            file.write(line)



# ----------------------------------------------------------------
# Example: (remove for production)
# ----------------------------------------------------------------

# blocklist = [
#             "www.facebook.com",
#             "www.instagram.com",
#             "www.twitter.com",
#             "www.netflix.com",
#             "www.youtube.com",
#             ]

# unblock()
# block(blocklist, flush=True)