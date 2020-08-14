import { createStackNavigator } from "react-navigation";
import { defaultNavigationOptions } from "./options";
import {
  Intro,
  Login,
  SignUp,
  EnterPhone,
  VerifyPhone,
  NewPassword,
  SignUpSelection,
  EmployeeSignUp
} from "../screens";
const authNavigator = createStackNavigator(
  {
    Intro: {
      screen: Intro
    },
    Login: {
      screen: Login
    },
    SignUp: {
      screen: SignUp
    },
    SignUpSelection: {
      screen: SignUpSelection
    },
    EmployeeSignUp: {
      screen: EmployeeSignUp
    },
    EnterPhone: {
      screen: EnterPhone
    },
    VerifyPhone: {
      screen: VerifyPhone
    },
    NewPassword: {
      screen: NewPassword
    }
  },
  {
    defaultNavigationOptions
  }
);

export default authNavigator;
