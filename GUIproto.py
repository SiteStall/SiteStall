#
# Sean Wilson - 2/20/20
# -GUI prototype v1.0
# -SiteStall cis422 @ U of O W'20
#

#-------------------------------------------------------------------------------

# import all the the tkinter library has to offer
from tkinter import *
from tkinter import messagebox
from blockingSystem import block, unblock, flushCache
import sitestall_io as io

#-------------------------------------------------------------------------------
#---GUI Class-------------------------------------------------------------------
#-------------------------------------------------------------------------------

class SiteStallGui:

    #---------------------------------------------------------------------------
    #---Initializer-------------------------------------------------------------
    #---------------------------------------------------------------------------

    def __init__(self, flush=False):

        # main window
        self.main = Tk()

        # Noah's fault
        self.flush = flush

        # size of main window (short and wide for top of screen)
        self.main.geometry("300x400")
        self.main.title("Welcome to Site-Stall")

        # list to store URL's in
        self.url = io.getWebsites(getAll=True)

        # store state of blocking (blocking/nonblocking) initially 0 (nonblocking)
        self.blocked = 0

        # listbox to display URL's
        self.lb = Listbox(self.main)

        # prompt text
        self.input = Label(self.main, text='Type a URL to Stall the Site')

        # get user input on URL's
        self.entry_id = StringVar()
        self.entry = Entry(self.main, textvariable=self.entry_id, justify=LEFT)

        # buttons
        self.enter = Button(self.main, text='Enter URL', command=lambda: self.addToList(event=None))
        self.power = Button(self.main, text='Start/Stop', command=lambda: self.StartStop(event=None))
        self.delete = Button(self.main, text='Delete Selected URL', command=lambda: self.deleter(event=None))

        # button binding
        self.main.bind("<Return>", self.addToList)
        # self.enter.bind("<Button-1>", self.addToList)
        # self.power.bind("<Button-1>", self.StartStop)
        # self.delete.bind("<Button-1>", self.deleter)

        # pack window items
        self.lb.pack()
        self.input.pack()
        self.entry.pack()

        # pack buttons
        self.enter.pack()
        self.power.pack()
        self.delete.pack()

        # refresh website list after reading from file
        self.refreshList()

        # main window loop initiaition
        self.main.mainloop()

    #---------------------------------------------------------------------------
    #---Class Functions---------------------------------------------------------
    #---------------------------------------------------------------------------

    def refreshList(self):

        # delete entry and listbox
        self.entry.delete(0, 'end')
        self.lb.delete(0, 'end')

        # add each url back into listbox
        for i in self.url:
            self.lb.insert(END, i)

        # pack it all back in frame
        self.entry.pack()
        self.lb.pack()

    #---------------------------------------------------------------------------

    def addToList(self, event):
        print("Enter Pressed")

        # payload is a list of URL's
        payload = self.url

        # get the text from entry
        text = self.entry_id.get()

        # add entry to url list
        self.url.append(text)

        # save website to websites.txt
        io.saveWebsites(text)

        # refresh with new data
        self.refreshList()

        # if blocker is running, unblock because list has changed
        if(self.blocked == 1):
            self.blocked = 0
            self.main['bg'] = 'red'
            # TODO: STOP (unblock sites in payload)
            unblock()

    #---------------------------------------------------------------------------

    def StartStop(self, event):
        print("Start / Stop Pressed")

        # payload is a list of URL's
        payload = self.url

        if(self.blocked == 1):
            self.blocked = 0
            self.main['bg'] = 'red'
            # TODO: STOP (unblock sites in payload)
            unblock()
        else:
            self.blocked = 1
            self.main['bg'] = 'green'
            # TODO: START (block sites in payload)
            block(payload, flush=self.flush)

    #---------------------------------------------------------------------------

    def deleter(self, event):
        print("Delete Pressed")

        # payload is a list of URL's
        payload = self.url

        if(len(self.url) != 0):

            # if blocker is running, unblock because list has changed
            if(self.blocked == 1):
                self.blocked = 0
                self.main['bg'] = 'red'
                # TODO: STOP (unblock sites in payload)
                unblock()

            # get where cursor is on list
            selection = self.lb.curselection()

            # remove that entry from url list
            self.url.remove(self.url[selection[0]])

            # refresh with updated data
            self.refreshList()

            # update websites.txt
            io.saveWebsites(self.url, eraseFirst=True)

        else:
            messagebox.showinfo("Invalid Action", "There is nothing to delete!")

#-------------------------------------------------------------------------------
#-------------------------------------------------------------------------------

# if __name__ == '__main__':

#     Gui = SiteStallGui()

#-------------------------------------------------------------------------------
