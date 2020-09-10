/*
   npm install --save 'react-native-geolocation-service'
*/
import { Platform, PermissionsAndroid } from 'react-native'
import GeoLocation from '@react-native-community/geolocation'

export const getUserLocation = async (successCallback, errorCallBack, options) => {

    GeoLocation.setRNConfiguration({ authorizationLevel: "whenInUse" });

    let geolocationConroller
    if (Platform.OS == 'android') {
        geolocationConroller = GeoLocation
        const alreadyGranted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        let granted = alreadyGranted
        if (!granted) {
            const permissionResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            granted = permissionResult === PermissionsAndroid.RESULTS.GRANTED
        }
        if (!granted) { return }
    } else {
        // iOS Platform
        geolocationConroller = navigator.geolocation
        geolocationConroller.requestAuthorization()
    }


    geolocationConroller.getCurrentPosition(successCallback, errorCallBack, options)

}

export const GoogleMapiAPIKey = "AIzaSyBOSF44W1Z42oyLc0yq5Z_cRA7HkBL2XnY";

