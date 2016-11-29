
# Machine learning on Fitbit data
# by Wenyu Xin
# 11/18/16

# this program takes a CSV file and trains a classifier AND ...
# ... use the clasifier to predict all future points

# INPUT:

# OUTPUT:
#   File 1 (csv file)
#   1. [column 1] time stamp
#   2. [column 2] number of tickers on each unique time stamp
#   3. [column 3] number of correctly predicted using classifier
#   4. [column 4] accuracy in percentage
#   File 2 (log file)
#   1. time starting program
#   2. time ending program
#   3. csv file path
#   4. gamma
#   5. cost
#   6. days range set for trainning classifier
#   7. how many unique time stamp calculated
#   8. average percentage of prediction
#   9. program completion note
#   File 3 (predicted y; csv file)
#   1. predicted y

# LOGIC FLOW: [!!!!!!!!!To be added!!!!!!!!!]
   
# WARNING:
#   1. this program will not take consideration of empty fields!!!


#-----------------------------------------------------------------------------------------------------------------#
#                                       IMPORT LIBERRAY                                                           #
#-----------------------------------------------------------------------------------------------------------------#

import sys
import numpy as np
import pandas as pd
from sklearn import svm
import csv
import os.path
from datetime import datetime as dt

#-----------------------------------------------------------------------------------------------------------------#
#                                         CONSTANTS                                                               #
#-----------------------------------------------------------------------------------------------------------------#
# output file name
OUTFILENAME = "result"
# features headers
FILENAME = "C:\\Users\\PC\\Desktop\\ML\\data1.csv"
FEATURESHEADER = ['Calories Burned', 'Steps', 'Floors', 'Minutes Sedentary']
RESPONSESHEADER = ['y']
TIMEHEADER = ['Date']
howLong = 14
GAMMA = 100
C = 0.01


#-----------------------------------------------------------------------------------------------------------------#
#                                  HELPER FUNCTION DEFINITION                                                     #
#-----------------------------------------------------------------------------------------------------------------#

# find the next time point, taking consideration that the time stamp might not be increment by 1
def calcNextTime(endTime, timeData):
    nextTime = endTime + 1
    while (not (nextTime in timeData)):
        nextTime = nextTime + 1
    return nextTime

# parse out features and response data during selected time period. and the very next one for testing
def parseData(startTime, endTime, nextTime, sortedData, FEATURESHEADER, RESPONSESHEADER, timeData):
    filteredData = sortedData[(timeData >= startTime) & (timeData <= endTime)]
    testData = sortedData[(timeData == nextTime)]
    # parse out using header, and convert to numpy array
    featuresData = filteredData[FEATURESHEADER].as_matrix()
    responsesData = filteredData[RESPONSESHEADER].as_matrix()
    responsesData = responsesData.ravel()
    testFeaturesData = testData[FEATURESHEADER].as_matrix()
    testResponsesData = testData[RESPONSESHEADER].as_matrix()
    return featuresData, responsesData, testFeaturesData, testResponsesData

# train classifier using features and responses data
def trainClassifier(featuresData, responsesData, testFeaturesData):
    # train classifier
    clf = svm.SVC(gamma = GAMMA, C = C)
    clf.fit(featuresData, responsesData)
    prediction = []
    # predict
    for eachRow in testFeaturesData:
        temp = clf.predict(eachRow.reshape(1, -1))
        prediction.extend(list(temp))
    return prediction

# compare each item in both list to see if prediction matches up with actual result
# output # of comparison and # of correct
def comparePrediction(timeStamp, prediction, testResponsesData):
    nCompare = len(prediction)
    nCorrect = 0
    rangeCompare = range(0, nCompare, 1)
    tempYList = [100]
    for idx in rangeCompare:
        temp = testResponsesData[idx]
        # compare result, if match, log info
        if (prediction[idx] == temp):
            nCorrect = nCorrect + 1
        accuracy = (nCorrect/nCompare)*100
        # log predicted y information
        tempYList.append(temp)
    resultList = [timeStamp, nCompare, nCorrect, accuracy]
    # need to remove the first element of tempYList
    tempYList.pop(0)
    return resultList, accuracy, tempYList

# attempt to find the path of file and save the output in the same place
def findPath(FILENAME, OUTFILENAME):
    parseString = FILENAME.rsplit("\\", 1)
    if (len(parseString) == 2):
        outPath = parseString[0] + "\\" + OUTFILENAME
    else:
        outPath = OUTFILENAME
    return outPath

# check if outfile name exist already, if yes, add number to the end
def isExist(outPath):
    csvPath = outPath + ".csv"
    csvPath2 = outPath + "Y" + ".csv"
    version = 1
    while(os.path.isfile(csvPath)):
        csvPath = outPath + str(version) + ".csv"
        csvPath2 = outPath + "Y" + str(version) + ".csv"
        version = version + 1
    return csvPath, csvPath2


#-----------------------------------------------------------------------------------------------------------------#
#                                           MAIN FUNCTION                                                         #
#-----------------------------------------------------------------------------------------------------------------#
tic = str(dt.now())

#-----------------------#
#-- STEP 1 - GET FILE --#
#-----------------------#
rawData = pd.read_csv(FILENAME)

#------------------------#
#-- STEP 2 - SORT DATA --#
#------------------------#
# always assume table not sorted, and sort according to time in ascending order
sortedData = rawData.sort_values(by=TIMEHEADER)

#--------------------------------------#
#-- STEP 3 - GATHER LAST MINUTE DATA --#
#--------------------------------------#
# parse time column and convert to array
timeData = sortedData[TIMEHEADER].as_matrix()

# find max time and use it as stopping point
terminationTime = timeData.max()
# use earliest date as reference find optimal starting point
startTime = timeData.min()
# validate if there are enough dates for at least 1 test
if (terminationTime - startTime <= howLong):
    print ("Not enough data!")
    sys.exit(1)
# find ending date
# NOTE: we don't have to validate if this date is valid, as we are doing query between range
endTime = startTime + howLong
# find the next time after endTime
# NOTE: we need to validate this, as this is single point reference
nextTime = calcNextTime(endTime, timeData)
# then using nextTime as a reference to find startTime and endTime
endTime = nextTime - 1
startTime = endTime - howLong
# from this point on, we will always use nextTime to find startTime and endTime

# initialize a list to store result
resultList = []
accuracyList = []
yList = [[nextTime]]

#----------------------------#
#-- STEP 4 - START LOOPING --#
#----------------------------#
while(nextTime <= terminationTime):
    #--------------------#
    #-- 4.1 PARSE DATA --#
    #--------------------#
    # using startTime and endTime to find features and response and using nextTime to find test data
    featuresData, responsesData, testFeaturesData, testResponsesData = parseData(
        startTime, endTime, nextTime, sortedData, FEATURESHEADER, RESPONSESHEADER, timeData)

    #-------------------------#
    #-- 4.2 TRAIN & PREDICT --#
    #-------------------------#
    # do training and prediction
    if (len(np.unique(responsesData)) > 1): # must have at least 2 different outcomes to train classifier | otherwise ignored
        prediction = trainClassifier(featuresData, responsesData, testFeaturesData)
    
        #--------------------------#
        #-- 4.3 CALCULATE RESULT --#
        #--------------------------#
        # convert testFeaturesData into a list for easier access
        testResponsesData = list(testResponsesData)
        # compare and update resultList, accuracy list, pred y list
        currentResult, currentAccuracy, currentY = comparePrediction(nextTime, prediction, testResponsesData)
        resultList.append(currentResult)
        accuracyList.append(currentAccuracy)
        yList.extend(currentY)

    #---------------------------#
    #-- 4.4 UPDATE TIME RANGE --#
    #---------------------------#
    # if current prediction is on the last time available, stop
    if (nextTime == terminationTime):
        break
    # else find next time range
    else:
        nextTime = calcNextTime(nextTime, timeData)
        endTime = nextTime - 1
        startTime = endTime - howLong
        
#---------------------------#
#-- 5 GATHER INFO TO SAVE --#
#---------------------------#
# get accuracy average, to be stored later
nItem = len(accuracyList)
accAvg = sum(accuracyList)/nItem
# get tock
toc = str(dt.now())

#--------------------------#
#-- STEP 6 - SAVE RESULT --#
#--------------------------#
# try to store the output file in the same directory as the original data
# if failed, try to store in current working directory
outPath = findPath(FILENAME, OUTFILENAME)

# if in same directory, check if file already exist, if so, create a new version
csvPath, csvPath2 = isExist(outPath)

# save csv
with open(csvPath, "w", newline = '') as csvFile:
    writer = csv.writer(csvFile)
    writer.writerows(resultList)

with open(csvPath2, "w") as csvFile2:
    writer = csv.writer(csvFile2)
    writer.writerows(yList)	

# print message to log file
print ("-------------------------- SUMMARY ----------------------------")
print ("CSV filename: %s" % csvPath)
print ("Program start time: %s" % tic)
print ("Program end time: %s" % toc)
print ("Gamma (SVM parameter): %f" % GAMMA)
print ("Cost (SVM parameter): %f" % C)
print ("Time range used to train classifier (should be 14): %d" % howLong)
print ("Number of unique time point predicted: %d" % nItem)
print ("Avg Accuracy (percentage): %f" % accAvg)
print ("Program Completed!")
print ("---------------------------------------------------------------\n")







