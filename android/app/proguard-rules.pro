-keep public class com.facebook.react.ReactActivityDelegate { *; }
-keep public class com.facebook.react.devsupport.DevSettingsActivity { *; }
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keepclasseswithmembers,includedescriptorclasses class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclasseswithmembers,includedescriptorclasses class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

-keep class com.facebook.flipper.** { *; }

-keep class com.google.android.gms.common.** { *; }
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.android.gms.measurement.AppMeasurementReceiver { *; }
-keep class com.google.android.gms.measurement.AppMeasurementService { *; }
-keep public class com.google.firebase.messaging.FirebaseMessagingService {*;}

-keep class com.swmansion.** { *; }

-keep class com.hotupdater.** { *; }

-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.learnium.resolver.** { *; }

-dontwarn com.facebook.react.**
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn com.swmansion.**