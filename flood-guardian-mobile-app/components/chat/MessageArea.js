// MessageArea.js
// code in MessageArea.js is based off: https://github.com/Call-for-Code/Solution-Starter-Kit-Disasters-2020
import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';
// import Config from 'react-native-config';

// let serverUrl = Config.STARTER_KIT_SERVER_URL;
// if (serverUrl.endsWith('/')) {
//   serverUrl = serverUrl.slice(0, -1)
// }
const serverUrl = 'http://10.0.2.2:5000';

const Message = (props) => {
  const style = props.fromInput ? styles.myText : styles.waText;

  return (
    <View style={styles.messageContainer}>
      <Text style={style}>{props.text}</Text>
    </View>
  );
};

const MessageArea = function ({navigation}) {
  const [input, setInput] = React.useState('');
  const [session, setSession] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      fromInput: undefined,
      key: '0',
      text: "Hi, I'm Skippy the chatbot! Ask me anything about floods",
    },
  ]);

  const getSession = () => {
    return fetch(`${serverUrl}/api/assistant/session`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        } else {
          return response.text();
        }
      })
      .then((sessionId) => {
        setSession(sessionId);
        return sessionId;
      })
      .catch((e) => {
        console.error('Error in Watson Assistant: ', e.message);

        addMessages([
          {
            text:
              "I'm sorry, it looks like you have trouble connecting to our servers. Please check your Internet connection and try again later",
          },
        ]);
      });
  };

  const fetchMessage = (payload) => {
    console.log(JSON.stringify(payload));
    console.log(messages);

    return fetch(`${serverUrl}/api/assistant/message`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  };

  const handleMessageResponse = (response) => {
    if (!response.ok) {
      throw new Error(
        response.statusText || response.message || response.status,
      );
    } else {
      return response.json().then((response) => {
        addMessages(response.generic);
      });
    }
  };

  const sendMessage = () => {
    const payload = {
      text: input.trim(),
      sessionid: session,
    };

    addMessages([{text: input}], true);

    setInput('');

    fetchMessage(payload)
      .then(handleMessageResponse)
      .catch((e) => {
        console.error(
          'An error when running the chatbot: ',
          e,
          ' Retrying now...',
        );

        getSession()
          .then((sessionId) => {
            return fetchMessage({
              // retry fetchMessage
              text: payload.text,
              sessionid: sessionId,
            });
          })
          .then(handleMessageResponse)
          .catch((err) => {
            console.log(err);
            addMessages([
              {
                // if error persists, return error message to chat
                text:
                  'ERROR: Please try again. If the problem persists contact an administrator.',
              },
            ]);
          });
      });
  };

  const addMessages = (messages, fromInput) => {
    const result = messages.map((r, i) => {
      return {
        text: r.text,
        fromInput: fromInput,
      };
    });

    setMessages((msgs) => [...msgs, ...result]);
  };

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      getSession();
    });
  }, []);

  const BOTTOM_NAVIGATOR_HEIGHT = 60;
  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior="padding"
        keyboardVerticalOffset={-1 * BOTTOM_NAVIGATOR_HEIGHT}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          persistentScrollbar={true}>
          {messages.map((message, i) => {
            message.key = `${new Date().getTime()}-${i}`;
            return <Message {...message} />;
          })}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            placeholder="Ask a question..."
            blurOnSubmit={false}
          />
          <View style={{flex: input !== '' ? 2 : 0}}>
            {input !== '' && (
              <Button color="#5aa5e8" title="Send" onPress={sendMessage} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'column',
    paddingTop: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  waText: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#FBD9D7',
    padding: 10,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    fontSize: 17,
    borderRadius: 15,
  },
  myText: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#EFFBD7',
    padding: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    fontSize: 17,
    borderRadius: 15,
  },
  inputContainer: {
    backgroundColor: '#7FB3E2',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 10,
  },
  textInput: {
    flex: 7,
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    borderRadius: 10,
    marginRight: 20,
  },
  submitButton: {
    fontFamily: 'IBMPlexSans-Medium',
  },
});

export default MessageArea;
