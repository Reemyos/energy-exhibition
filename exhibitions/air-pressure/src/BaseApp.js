import React, { Component } from 'react';

export class BaseApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      currentLanguageIndex: 0,
    };

    this.languages = ['hebrew', 'english', 'arabic'];
    this.reconnectIntervalRef = null;
    this.ws = null;
  }

  componentDidMount() {
    this.connectWebSocket();
  }

  componentWillUnmount() {
    if (this.reconnectIntervalRef) {
      clearInterval(this.reconnectIntervalRef);
    }
    if (this.ws) {
      this.ws.close();
    }
  }

  connectWebSocket = () => {
    if (this.ws?.readyState === WebSocket.OPEN) return; // Prevent reconnect if already open

    if (this.ws && this.ws?.readyState !== WebSocket.CLOSED) {
      this.ws.close();
    }

    this.ws = new WebSocket('ws://localhost:8000/ws');

    this.ws.onopen = () => {
      console.log('Connected to WebSocket server');
      this.setState({ isConnected: true });

      // Clear reconnection attempts
      if (this.reconnectIntervalRef) {
        clearInterval(this.reconnectIntervalRef);
        this.reconnectIntervalRef = null;
      }
    };

    this.ws.onmessage = this.handleMessage;

    this.ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      this.setState({ isConnected: false });

      // Attempt to reconnect only if not already reconnecting
      if (!this.reconnectIntervalRef) {
        this.reconnectIntervalRef = setInterval(() => {
          console.log('Attempting to reconnect...');
          this.connectWebSocket();
        }, 5000);
      }
    };
  };

  updateLanguage = () => {
    this.currentLanguageIndex = (this.currentLanguageIndex + 1) % 3
  }

  handleMessage = (event) => {
    // Default behavior; override this in extended class
    console.log('Message received from WebSocket:', event.data);
  };

  changeLanguage = () => {
    this.setState((prevState) => ({
      currentLanguageIndex: (prevState.currentLanguageIndex + 1) % this.languages.length,
    }));
  };

  render() {
    return (
      <div className={'App-container'}>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    // To be implemented by the extended class
    return null;
  }

  log = async (message) => {
    try {
      const response = await fetch('http://localhost:8000/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), // Wrap message in an object
      });

      if (response.ok) {
        console.log(`Log sent to server: ${message}`);
      } else {
        console.error(`Failed to send log. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error while logging:', error);
    }
  };
}

export default BaseApp;
