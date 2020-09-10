import StepOneSignal from "step-onesignal";
import { xSetState } from "step-react-redux";
import Step_API_Client, { StepRequest } from "step-api-client";
import { Alert } from "react-native";

export const actions = {
  async refreshWalletBalance() {
    try {
      const data = await StepRequest("transactions/getBalance");
      xSetState({ userWallet: data.balance });
      console.warn("balance", data.balance);
    } catch (error) {
      alert(error.message);
    }
  },

  async refreshCities() {
    const cities = await StepRequest("cities");
    xSetState({ cities });
  },
  async refreshCategories() {
    const categories = await StepRequest("categories");
    
    xSetState({ categories });
  },
  async refreshBanks() {
    const banks = await StepRequest("banks");
    xSetState({ banks });
  },

  async setUserData({ data, userToken }) {
    const user = { data, loggedIn: true };
    xSetState({ user });
    if (userToken) {
      await this.setAccessToken(userToken);
      this.registerDeviceToken();
    }
  },

  async setAccessToken(userToken) {
    const accessToken = "Bearer " + userToken;
    Step_API_Client.appendHeader("Authorization", accessToken);
    console.warn("accessToken", accessToken);
    xSetState({ accessToken });
  },

  removeUserData() {
    Step_API_Client.removeHeader("Authorization");
    const user = { data: {}, loggedIn: false };
    xSetState({ user });
  },

  async updateUser(updatedData) {
    const data = await StepRequest("update-profile", "POST", updatedData);
    console.log("updateUser", data);
    return data;
  },

  async registerDeviceToken() {
    console.warn("registerDeviceToken");
    try {
      const deviceInfo = await StepOneSignal.getDeviceInfo();
      console.log("deviceInfo;;;;;", deviceInfo.userId);
      const response = await StepRequest("register-device", "PATCH", {
        token: deviceInfo.userId
      });

      console.log("registerDeviceResponse", response);
    } catch (error) {
      console.log("registerDeviceError", error.message);
    }
  }
};
