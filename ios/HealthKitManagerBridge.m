//
//  HealthKitManagerBridge.m
//  StepsTracker
//
//  Created by Никита Лучко on 21/07/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(HealthKitManager, NSObject)

RCT_EXTERN_METHOD(fetchStatistics:(NSString *)startDateString endDateString:(NSString *)endDateString callback:(RCTResponseSenderBlock)callback)

@end