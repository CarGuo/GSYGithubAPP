# iOS AppDelegate Migration Notes

## Issue Fixed
This migration fixes the iOS crash: `Exception thrown while executing UI block: -[RCTView setSheetLargestUndimmedDetent:]: unrecognized selector sent to instance`

## Changes Made

### AppDelegate.h
- **Before**: Extended `UIResponder <UIApplicationDelegate, RCTBridgeDelegate>`
- **After**: Extended `RCTDefaultReactNativeFactoryDelegate <UIApplicationDelegate>`

### AppDelegate.m
- **Before**: Used old `RCTBridge` pattern with manual bridge creation
- **After**: Uses `RCTReactNativeFactory` with modern initialization pattern

## Why This Fixes the Issue

The crash was caused by react-native-screens library not being able to register its view properties properly with React Native. The `setSheetLargestUndimmedDetent` method is exported as `RCT_EXPORT_VIEW_PROPERTY` in react-native-screens, but the old AppDelegate pattern lacked the proper `RCTAppDependencyProvider` setup.

The new `RCTDefaultReactNativeFactoryDelegate` automatically:
1. Sets up the dependency provider system
2. Ensures proper registration of third-party library components
3. Supports iOS 15+ sheet presentation features

## Testing Instructions

1. **Install dependencies:**
   ```bash
   cd ios
   pod install
   ```

2. **Build the iOS app:**
   ```bash
   npx react-native run-ios
   ```

3. **Test sheet presentation functionality:**
   - Navigate to screens that use bottom sheet presentations
   - Verify no crashes occur when sheets are presented
   - Test different detent configurations if used in the app

## Verification

The fix should resolve the specific issue mentioned in:
- [React Navigation Issue #12423](https://github.com/react-navigation/react-navigation/issues/12423)
- React Native 0.77+ blog post about RCTAppDependencyProvider

## Rollback Instructions

If issues occur, you can rollback by:
1. Reverting the AppDelegate.h and AppDelegate.m files
2. Running `pod install` again
3. However, this will restore the original crash

## React Native Version Compatibility

This pattern is supported in:
- React Native 0.70+
- Recommended for React Native 0.77+
- Compatible with current version 0.80.2

## Related Dependencies

This fix specifically addresses issues with:
- react-native-screens (current: 4.13.1)
- @react-navigation/* libraries (current: 7.x)
- iOS 15+ sheet presentation controllers