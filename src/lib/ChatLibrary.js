import { v4 as uuidv4 } from "uuid";

class Chat {
  constructor({ timeout }) {
    this.timeout = timeout;
    this.pendingFeedback = [];
    // this.feedbackEvent = document.createEvent("HTMLEvents");
    // this.sendResolves = [];

    // initiate websockets

    this.socket = this.setUpWebsocket();

    return new Promise((resolve, reject) => {
      this.onConnectResolve = resolve;
    });
  }

  send = ({ text, updateState }) => {
    // assign message ui

    // add id to pendingFeedback

    // send
    const message = {
      id: uuidv4(),
      text,
      isRecevied: false,
    };

    console.log("SEND");
    try {
      this.socket.send(JSON.stringify(message));
    } catch (err) {
      delete this;
      window.location.reload();
    }

    return new Promise((resolve, reject) => {
      message.resolve = resolve;
      this.pendingFeedback.push(message);

      updateState(this.pendingFeedback);

      setTimeout(reject, this.timeout);

      // resolve on message receive
      // reject on timeout
    });
  };

  setUpWebsocket = () => {
    const chatSocket = (room) =>
      ["wss://salty-fortress-50912.herokuapp.com", "/ws/chat/", room, "/"].join(
        ""
      );
    const socket = new WebSocket(chatSocket("dummy"));

    socket.onmessage = (e) => {
      console.log("RECEIVED");
      this.pendingFeedback.some((feedback) => {
        const message = JSON.parse(e.data);
        if (message.id == feedback.id) {
          console.log("WOW");
          feedback.resolve(feedback.id);
          return true;
        }
      });
    };

    socket.onopen = (e) => {
      this.onConnectResolve(this);
    };

    return socket;
  };
}

export default Chat;
