import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Chat.css'; // Import the adapted CSS

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyDe_x1_to19PQv8sRjwIidwDjEfWtL6FCY"; // Move to env
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const chatBodyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sessions = await response.json();
        const allMessages = [];
        sessions.forEach(session => {
          session.messages.forEach(msg => {
            allMessages.push({
              content: msg.text,
              classes: "user-message fade-in",
              timestamp: msg.timestamp,
              id: Date.now() + Math.random()
            });
            if (msg.response) {
              allMessages.push({
                content: msg.response,
                classes: "bot-message fade-in",
                timestamp: msg.timestamp,
                id: Date.now() + Math.random()
              });
            }
          });
        });
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(allMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    if (user) loadChatHistory();
  }, [user]);

  const createMessageElement = (content, classes) => {
    return { content, classes };
  };

  const parseMarkdown = (text) => {
    // Split into lines
    const lines = text.split('\n');
    let inList = false;
    let result = '';

    lines.forEach(line => {
      if (line.trim().startsWith('* ')) {
        if (!inList) {
          result += '<ul>';
          inList = true;
        }
        result += `<li>${line.trim().substring(2)}</li>`;
      } else {
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        // Replace **text** with <strong>text</strong> for highlighting/bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace *text* with <em>text</em> for italic (if not at start of line)
        line = line.replace(/(?<!^)\*(.*?)\*/g, '<em>$1</em>');
        result += line + '<br>';
      }
    });

    if (inList) {
      result += '</ul>';
    }

    return result;
  };

  const generateBotResponse = async (incomingMessageDiv) => {
    try {
      const prompt = `I AM A NUTRI-BOT, an expert nutritionist. I can engage in basic greetings and conversational starters, but I ONLY provide detailed answers related to nutrition, food, health, diet, recipes, and meal planning. If the query is not related to nutrition or is about unrelated topics (like sports schedules, weather, news, etc.), politely decline and redirect to nutrition topics.

Query: ${incomingMessageDiv.content}

Provide a helpful response. For greetings like "hi" or "hello", respond warmly and ask about nutrition. For nutrition-related questions, provide detailed answers. For unrelated topics, say: "I'm sorry, I can only help with nutrition and diet-related questions. How can I assist you with your nutritional needs today?"`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      const botResponse = data.candidates[0].content.parts[0].text;
      const parsedResponse = parseMarkdown(botResponse);
      setMessages(prev => prev.map(msg =>
        msg.id === incomingMessageDiv.id ? { ...msg, content: parsedResponse, thinking: false } : msg
      ));
      saveMessageToBackend(incomingMessageDiv.content, botResponse);
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.id === incomingMessageDiv.id ? { ...msg, content: "Error: " + error.message, thinking: false } : msg
      ));
      saveMessageToBackend(incomingMessageDiv.content, "Error: " + error.message);
    }
  };

  const saveMessageToBackend = async (query, response) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/chat/save-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: query, response })
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleOutgoingMessage = (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;
    setInput('');

    const userMsg = createMessageElement(userMessage, "user-message fade-in");
    const userId = Date.now();
    setMessages(prev => [...prev, { ...userMsg, id: userId }]);

    setTimeout(() => {
      const botMsg = createMessageElement(
        `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
          <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text"><div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div></div>`, "bot-message thinking fade-in");
      const botId = Date.now() + 1;
      setMessages(prev => [...prev, { ...botMsg, id: botId, thinking: true }]);
      generateBotResponse({ content: userMessage, id: botId });
      saveMessageToBackend(userMessage);
    }, 600);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <div className="chat-header">
          <div className="header-info">
            <svg className="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <h2 className="logo-text">AI Nutrition-Chatbot</h2>
          </div>
          <button id="close-chatbot" onClick={() => navigate('/dashboard')}>×</button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          <div className="message bot-message">
            <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <div className="message-content">
              <div className="message-label">Nutri-Bot:</div>
              <div className="message-text">Hey there {user?.username || ''}! <br/>How can i help you today?</div>
            </div>
          </div>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.classes}`}>
              {msg.classes.includes('user-message') ? (
                <div className="message-content">
                  <div className="message-label">You:</div>
                  <div className="message-text">{msg.content}</div>
                </div>
              ) : (
                <div className="message-content">
                  <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                  </svg>
                  <div className="message-content">
                    <div className="message-label">Nutri-Bot:</div>
                    <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <form className="chat-form" onSubmit={handleOutgoingMessage}>
            <textarea
              className="message-input"
              placeholder="Ask Nutri-Bot"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleOutgoingMessage(e);
                }
              }}
              required
            />
            <div className="chat-controls">
              <button type="submit" id="send-message">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
