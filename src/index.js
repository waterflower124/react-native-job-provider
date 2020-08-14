import React, { Component } from "react";
import Navigation from "./navigation";
import StepCrashCatcher from "step-crash-catcher";
import RootProvider from "step-react-redux";
import Step_API_Client from "step-api-client";
import { FallbackComponent } from "./components";
import StepOneSignal from "step-onesignal";


class App extends Component {
  constructor(props) {
    super(props);
    Step_API_Client.baseURL = "https://homejobapp.com/api/";
    Step_API_Client.defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    StepOneSignal.init('fbfa4ecc-728d-469e-9b8d-660c32945261')
  }
  componentWillUnmount() {
    StepOneSignal.remove()
  }
  render() {
    return (
      <RootProvider>
        <Navigation/>
      </RootProvider>
    );
  }
}
export default () => (
  <StepCrashCatcher AppRoot={App} FallbackComponent={FallbackComponent} />
);
