import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Chat from "./lib/ChatLibrary";

class App extends React.Component {
  render() {
    let { feedbacks, isReady, timeout } = this.state;
    console.log(" App STATE", feedbacks);

    return (
      <div className="App">
        <div className="send-message" id="chat">
          {isReady && <div className="ready">Ready!</div>}
          {!isReady && <div className="ready not">Not Ready!</div>}
          {isReady && (
            <button
              type="button"
              onClick={() => {
                this.sendMessage(this.chat);
              }}
            >
              Send
            </button>
          )}
        </div>

        <div className="timeout">
          Timeout: {timeout}ms
          <div className="timeout-buttons">
            ms:
            <button
              onClick={() => {
                this.setTimeout(200);
              }}
            >
              200
            </button>
            <button
              onClick={() => {
                this.setTimeout(300);
              }}
            >
              300
            </button>
            <button
              onClick={() => {
                this.setTimeout(400);
              }}
            >
              400
            </button>
          </div>
        </div>

        <div className="messages">
          <div className="message-id">Message ID</div>
          <div className="feedback">Feedback</div>
        </div>

        {feedbacks.map((feedback, index) => {
          return (
            <div className="messages" key={index}>
              <div className="message-id">{feedback.id}</div>
              <div className="feedback">
                {feedback.isRecevied && <span className="yes">Yes</span>}{" "}
                {!feedback.isRecevied && <span className="no">No</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  constructor(props) {
    super(props);

    let feedbacks = [];
    let isReady = false;
    let timeout = 300;

    this.state = { feedbacks, isReady, timeout };

    new Chat({
      timeout: timeout,
    }).then((chat) => {
      this.setState({ isReady: true });
      this.chat = chat;
    });
  }

  componentDidMount() {}
  componentWillUnmount() {
    delete this.chat;
  }

  sendMessage = (chat) => {
    console.log("INIT");
    if (typeof chat.send == "function") {
      const text = "message";
      const updateState = this.updateState;

      chat
        .send({ text, updateState })
        .then((id) => {
          let { feedbacks } = this.state;
          feedbacks.forEach((feedback) => {
            if (feedback.id == id) feedback.isRecevied = true;
          });

          this.setState({ feedbacks });
        })
        .catch((err) => {
          console.log("REJECTED");
        });
    } else console.error("Chat send not implemented");
  };

  updateState = (feedbacks) => {
    console.log("UPDATED", feedbacks);
    this.setState({ feedbacks });
  };

  setTimeout = (ms) => {
    this.setState({ timeout: ms, isReady: false }, () => {
      new Chat({
        timeout: ms,
      }).then((chat) => {
        this.setState({ isReady: true });
        this.chat = chat;
      });
    });
  };
}

export default App;
