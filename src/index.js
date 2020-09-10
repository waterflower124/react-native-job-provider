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
    Step_API_Client.baseURL = "http://172.105.38.120/api/";
    Step_API_Client.defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    StepOneSignal.init('0f30ee31-f8d2-44fc-82d4-2bded8a42861')
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
