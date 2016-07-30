//
//  HealthKitManager.swift
//  StepsTracker
//
//  Created by Никита Лучко on 21/07/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import HealthKit

@objc(HealthKitManager)
class HealthKitManager: NSObject {
  
  var healthStore: HKHealthStore? {
    if HKHealthStore.isHealthDataAvailable() {
      return HKHealthStore()
    } else {
      return nil
    }
  }
  
  var dateParser: NSDateFormatter {
    let formatter = NSDateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    return formatter
  }
  
  var dateFormatter: NSDateFormatter {
    let formatter = NSDateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter
  }
  
  func requestAccess(completion: (() -> Void)!) {
    let distanceWalkingRunning = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierDistanceWalkingRunning)!
    let readTypes = Set(arrayLiteral: distanceWalkingRunning)
    
    healthStore!.requestAuthorizationToShareTypes(nil, readTypes: readTypes) { (success, error) in
      if success && completion != nil {
        completion()
      }
    }
  }
  
  @objc func fetchStatistics(startDateString: NSString, endDateString: NSString, callback: RCTResponseSenderBlock) -> Void {
    requestAccess { () -> Void in
      let distanceWalkingRunning = HKQuantityType.quantityTypeForIdentifier(HKQuantityTypeIdentifierDistanceWalkingRunning)!
      let startDate = self.parseDate(startDateString)
      let endDate = self.parseDate(endDateString)
      let predicate = HKQuery.predicateForSamplesWithStartDate(startDate, endDate: endDate, options: HKQueryOptions.StrictEndDate)
      
      let query = HKSampleQuery(sampleType: distanceWalkingRunning, predicate: predicate, limit: 100000, sortDescriptors: nil) { (sampleQuery, results, error) -> Void in
        let samples = results as! [HKQuantitySample]
        var groupedSamples = [String: [String: Double]]()
        
        samples.forEach { (sample) in
          let sampleStartDate = self.formatDate(sample.startDate)
          let sampleDevice = (sample.device != nil) ? sample.device!.name : "default"
          let sampleValue = sample.quantity.doubleValueForUnit(HKUnit.meterUnit())
          
          if groupedSamples[sampleStartDate] == nil {
            groupedSamples[sampleStartDate] = [sampleDevice: sampleValue]
          } else if groupedSamples[sampleStartDate]![sampleDevice] == nil {
            groupedSamples[sampleStartDate]![sampleDevice] = sampleValue
          } else {
            groupedSamples[sampleStartDate]![sampleDevice] = groupedSamples[sampleStartDate]![sampleDevice]! + sampleValue
          }
        }
        
        let data: [[String: AnyObject]] = groupedSamples.map { (date, samplesData) in
          return ["startDate": date, "value": samplesData.values.maxElement()!]
        }
        
        callback(NSArray(arrayLiteral: NSNull(), data) as [AnyObject])
      }
      
      self.healthStore?.executeQuery(query)
    }
  }
  
  private func parseDate(dateString: NSString) -> NSDate {
    return self.dateParser.dateFromString(dateString as String)!
  }
  
  private func formatDate(date: NSDate) -> String {
    return self.dateFormatter.stringFromDate(date)
  }
}