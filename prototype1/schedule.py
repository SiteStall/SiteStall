'''
	Scheduling module
	Author: Lucas Hyatt
	Last update: 2/24/20
'''

import time
import datetime

days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def immediate_stall(duration): #Duration in minutes
	'''
		duration: How long to stall the program for. 

		Function used for immediately stalling a program.
	'''

	timestamp = int(time.time())
	print("Epoch:", timestamp)

	date = datetime.datetime.fromtimestamp(timestamp)
	print("Date:", date.strftime('%Y-%m-%d %H:%M:%S'))

	weekday = datetime.datetime.today().weekday()
	day = days_of_week[weekday]
	print("Weekday:", day)

	return 0

def scheduled_stall(time, duration):
	'''
		time: Time of the day at which to start the stall
		duration: How long to stall the program for. 

		Function which will handle scheduled stalls
	'''

	return 0


def main():
	immediate_stall(5) #Stall for 5 minutes




	return 0




if __name__ == '__main__':
	main()