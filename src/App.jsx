import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessage = { role: 'user', content: input };
  const updatedMessages = [...messages, newMessage];
  setMessages(updatedMessages);
  setInput('');
  console.log(setMessages);
  

  try {
    const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: updatedMessages
  })
});


    if (!response.ok) {
      const error = await response.text();
      console.error("Error response:", error);
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ Error from server. Try again later.' }]);
      return;
    }

    const data = await response.json();

    if (!data.reply) {
      console.error("No reply found in server response:", data);
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ No reply from server.' }]);
      return;
    }

    const botReply = data.reply;
    setMessages([...updatedMessages, botReply]);

  } catch (err) {
    console.error("Fetch error:", err);
    setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ Failed to connect to server.' }]);
  }
};


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    alert(`Selected file: ${file.name}`);
  };

  const toggleRecording = () => {
    setRecording((prev) => !prev);
    if (!recording) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setTime(0);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Chat with Me</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <strong>{msg.role === 'user' ? 'You' : 'GPT'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-bar">
        <label className="upload-btn">
          +
          <input type="file" onChange={handleFileUpload} hidden />
        </label>

        <div className="tools-dropdown">
          <button className="tools-btn">🛠 Tools</button>
          <div className="dropdown-content">
            <p>📄 Summarize</p>
            <p>📌 Save Message</p>
            <p>📤 Export</p>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          rows={1}
          className="chat-textarea"
          />


        <button className="mic-btn" onClick={toggleRecording}>
          🎤
          {recording && <span className="timer">{time}s</span>}
        </button>

        <button className="send-btn" onClick={sendMessage}>↑</button>
      </div>
    </div>
  );
}

export default App;
