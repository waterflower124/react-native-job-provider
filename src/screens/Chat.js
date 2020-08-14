import React, { Component } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Platform
} from "react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import { hScale, vScale } from "step-scale";
import { icons } from "../assets";
import {
  BackButton,
  Container,
  TextField,
  EmptyScreen,
  ConversationCard
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { ImagePicker } from "../helpers";
import { connect } from "step-react-redux";
import { whiteHeaderOptions } from "../navigation/options";
import { Step_API_Helpers, StepRequest } from "step-api-client";

class ChatScreen extends Component {
  state = {
    second: {},
    text: "",
    screenLoading: true,
    receiver_id: "",
    type: 1,
    image: null,
    uploadImage: null,
    hasMicPermission: false,
    isRecording: false,
    currentTime: "",
    voiceMessage: "",
    stoppedRecording: false,
    list: [],
    sendLoading: false,
    pageNo: 1,
    lastPage: null
  };
  static navigationOptions = ({ navigation }) => {
    const avatar = navigation.getParam("avatar", null);
    return {
      ...whiteHeaderOptions,
      headerRight: (
        <Image
          source={avatar ? { uri: avatar } : icons.userPlaceholder}
          resizeMode={"cover"}
          style={styles.avatarStyle}
        />
      ),
      headerLeft: (
        <BackButton
          backWithTitle
          title={strings.chat}
          onPress={() => navigation.goBack()}
        />
      )
    };
  };

  componentWillUnmount(){
    try {
      voiceMessage.stop()
    } catch (error) {
      console.warn(error.message);
    }
    try {
      clearTimeout(refreshInterval)
    } catch (error) {
      console.warn(error.message);
    }
  }

  componentDidMount() {
    const { getParam, goBack } = this.props.navigation;
    const receiver_id = getParam("receiver_id", null);
    console.warn("component", receiver_id);
    if (receiver_id) {
      this.initializeRecorder();
      this.setState({ receiver_id }, () => this.fetchData());
    } else {
      goBack();
    }
  }
  async initializeRecorder() {
    try {
      const isAuthorised = await AudioRecorder.requestAuthorization();

      this.setState({ hasMicPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath();

      AudioRecorder.onProgress = (data) => {
        let seconds = Math.floor(data.currentTime);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        if (minutes < 59) {
          minutes = `0${minutes}`;
        }
        const currentTime = `${minutes} : ${seconds}`;
        // console.warn('recording ..')
        console.log("currentTime", currentTime);
        this.setState({ text: currentTime, isRecording: true });
      };

      AudioRecorder.onFinished = (data) => {
        console.warn("onfinished", data);
        // Android callback comes in the form of a promise instead.
        if (Platform.OS == "ios") {
          const voiceMessage = data.base64;
          const didSuccess = data.status === "OK";
          const filePath = data.audioFileURL;
          const fileSize = data.audioFileSize;
          if (didSuccess) {
            console.warn(
              `Finished recording of duration ${this.state.currentTime} seconds
           at path: ${filePath}  and size of ${fileSize || 0} bytes `
            );

            this.setState({
              isRecording: false,
              stoppedRecording: true,
              voiceMessage,
              type: 2
            }, ()=> this.validateInput());
          }
        }
      };
    } catch (error) {
      console.warn(error.message);
    }
  }

  prepareRecordingPath() {
    const audioPath = AudioUtils.DocumentDirectoryPath + "/temp.aac";
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      IncludeBase64: true
    });
  }

  async startRecording() {
    const { isRecording, hasMicPermission, stoppedRecording } = this.state;
    if (isRecording) {
      console.warn("Already recording!");
      return;
    }

    if (!hasMicPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (stoppedRecording) {
      this.prepareRecordingPath();
    }

    this.setState({ isRecording: true, voiceMessage: "" });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error.message);
    }
  }

  async stopRecording() {
    const { isRecording } = this.state;

    if (!isRecording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ isRecording: false, stoppedRecording: true });

    try {
      const filePath = await AudioRecorder.stopRecording();
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }
  async playVoiceMessage(item, index) {
    if (this.state.playingIndex != null) {
      console.warn("Can't Play, Please Wait");
      return;
    }
    voiceMessage = new Sound(item.text, null, (error) => {
      if (error) {
        console.warn("Error Playing VoiceMessage");
      } else {
        voiceMessage.setCategory("Playback");
        this.setState({ playingIndex: index });
        voiceMessage.play(() => {
          console.warn("end playing");
          this.setState({ playingIndex: null });
        });
      }
    });
  }

  refreshData () {
    console.warn("Refreshing");
    this.setState({ pageNo: 1 }, () => this.fetchData())
  }

  async fetchData() {
    const { pageNo, receiver_id, list } = this.state;
    const params = Step_API_Helpers.convertObjToParams({
      second: receiver_id,
      page: pageNo
    });
    const isFirstPage = pageNo == 1;
    console.warn(pageNo);
    try {
      const data = await StepRequest(`conversation?${params}`);
      console.warn("data", data);
      const newChat = typeof data == "string";
      if (!newChat) {
        this.setState({
          list: isFirstPage
            ? data.conversation.data
            : [...list, ...data.conversation.data],
          lastPage: data.conversation.last_page,
          second: data.second,
          screenLoading: false,
          sendLoading: false
        });
      } else {
        this.setState({
          screenLoading: false
        });
      }
      refreshInterval = setTimeout(() => {
        this.refreshData()
      }, 30000);
    } catch (error) {
      this.setState({ screenLoading: false, sendLoading: false });
      Alert.alert(error.message);
    }
  }

  validateInput() {
    const { text } = this.state;
    text.length > 0 && this.onSend();
  }
  async onSend() {
    let { text, type, voiceMessage, uploadImage, receiver_id } = this.state;
    console.warn(receiver_id);
    this.setState({ sendLoading: true });
    const isPhotoMessage = type === 3;
    const isVoiceMessage = type === 2;
    if (isPhotoMessage) {
      text = uploadImage;
    }
    if (isVoiceMessage) {
      text = voiceMessage;
    }
    try {
      const messageBody = { receiver_id, type, text };
      console.warn("messageBody", messageBody);
      const data = await StepRequest("messages", "POST", messageBody);
      this.setState({ text: "", voiceMessage: "", type: 1, pageNo: 1 }, () =>
        this.fetchData()
      );
      console.warn(data);
    } catch (error) {
      this.setState({ sendLoading: false });
      Alert.alert(error.message);
    }
  }

  async uploadPhotoPress() {
    const { imageObject } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState(
      {
        uploadImage: imageObject,
        type: 3
      },
      () => this.onSend()
    );
  }
  render() {
    const {
      container,
      defaultIconStyle,
      microphoneStyle,
      inputImageStyle,
      iconContainer,
      noChatImageStyle,
      uploadIconContainer
    } = styles;
    const {
      text,
      screenLoading,
      list,
      receiver_id,
      second,
      sendLoading,
      pageNo,
      lastPage,
      type,
      isRecording,
      playingIndex
    } = this.state;
    // const pendingVoiceMessage = type == 2;

    const noMessages = list.length == 0;
    const { user } = this.props;
    const endReached = pageNo == lastPage;
    return (
      <Container loading={screenLoading}>
        <KeyboardAvoidingView
          style={container}
          behavior="padding"
          keyboardVerticalOffset={100}
        >
          {noMessages ? (
            <EmptyScreen
              customContainer={{ flex: 1 }}
              title={strings.noMessages}
              image={icons.emptyNoChat}
              imageStyle={noChatImageStyle}
              onPress={() =>
                this.setState({ screenLoading: true }, () => this.fetchData())
              }
            />
          ) : (
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                !endReached &&
                this.setState({ pageNo: pageNo + 1 }, () => this.fetchData())
              }
              data={list}
              extraData={this.state}
              inverted
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const isOtherUserMsg = item.user_id != user.data.id;
                const isPlaying = playingIndex == index;

                return (
                  <ConversationCard
                    second={second}
                    myAvatar={user.data.avatar}
                    isOtherUserMsg={isOtherUserMsg}
                    item={item}
                    onPressPlay={() => this.playVoiceMessage(item, index)}
                  />
                );
              }}
            />
          )}
          <TextField
            onChangeText={(text) => this.setState({ text })}
            value={text}
            onRightIconPress={() => this.validateInput()}
            onSubmitEditing={() => this.validateInput()}
            onLeftIconPress={() => this.uploadPhotoPress()}
            onLeftIcon2Press={() =>
              // isRecording
              //   ? this.stopRecording()
                // : // : pendingVoiceMessage
                  // ? this.setState({ voiceMessage: "", type: 1 })
                  this.startRecording()
            }
            onLeftIcon2Release={()=> this.stopRecording()}
            placeholder={strings.typeHere}
            leftIcon={icons.placeholderImage}
            leftIcon_2={icons.microphone}
            leftIcon_2Style={[
              microphoneStyle,
              isRecording && { tintColor: "red" }
            ]}
            leftIconStyle={microphoneStyle}
            leftIconContainer={uploadIconContainer}
            rightIcon={icons.miniArrow}
            rightIconStyle={defaultIconStyle}
            rightIconContainer={iconContainer}
            loading={sendLoading}
            enabled={!sendLoading || !isRecording}
            disableInput={isRecording}
            inputStyle={{ height: vScale(40) }}
            customMainContainer={{
              marginBottom: vScale(20),
              height: vScale(40)
            }}
            containerStyle={{ height: vScale(40) }}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: hScale(354.4),
    borderRadius: hScale(5),
    marginTop: vScale(10.4),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  iconContainer: {
    width: hScale(21.5),
    height: vScale(19.2),
    alignItems: "center",
    justifyContent: "center"
  },
  defaultIconStyle: {
    width: hScale(11.5),
    height: vScale(9.2),
    resizeMode: "contain"
  },
  uploadIconContainer: {
    width: hScale(20),
    height: hScale(20),
    justifyContent: "center",
    alignItems: "center"
  },
  inputImageStyle: {
    width: hScale(11.2),
    height: vScale(11.2),
    tintColor: colors.second,
    resizeMode: "contain"
  },
  microphoneStyle: {
    width: hScale(30),
    height: hScale(30),
    marginHorizontal: hScale(5),
    tintColor: colors.second,
    resizeMode: "contain"
  },
  avatarStyle: {
    width: hScale(24.3),
    height: hScale(24.3),
    borderRadius: hScale(12.15),
    marginEnd: hScale(40.7)
  },
  noChatImageStyle: {
    width: hScale(59.7),
    height: hScale(59.7)
  }
});

export const Chat = connect(ChatScreen);
