#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NewinstanceVideoPlayer, NSObject)

RCT_EXTERN_METHOD(enterFullScreen)

RCT_EXTERN_METHOD(exitFullScreen)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
