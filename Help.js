import React from 'react';

const Help = () => {
  return (
    <div className="help">
      <h1>Help & Support</h1>

      <div className="help-section">
        <h2>Getting Started</h2>
        <p>Welcome to NutriChat! Here's how to make the most of your nutrition tracking experience:</p>
        <ul>
          <li><strong>Dashboard:</strong> View your daily progress towards nutritional goals and add meals.</li>
          <li><strong>Meal View:</strong> Log and review your meals with detailed nutritional information.</li>
          <li><strong>Progress View:</strong> Track your long-term progress with charts and metrics.</li>
          <li><strong>Recipes:</strong> Browse meal recipes with calorie and macronutrient details.</li>
          <li><strong>Budget Meals:</strong> Find affordable meal suggestions based on your budget.</li>
          <li><strong>Chat:</strong> Get personalized nutrition advice from our AI chatbot.</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>FAQ</h2>
        <div className="faq-item">
          <h3>How do I set my nutritional goals?</h3>
          <p>Go to Settings and update your daily calorie and macronutrient targets.</p>
        </div>
        <div className="faq-item">
          <h3>Can I edit or delete meals I've logged?</h3>
          <p>Yes, in the Meal View, you can add, edit, or delete meals for any date.</p>
        </div>
        <div className="faq-item">
          <h3>How does the chat feature work?</h3>
          <p>Simply type your nutrition-related questions, and our AI will provide personalized recommendations.</p>
        </div>
        <div className="faq-item">
          <h3>Is my data secure?</h3>
          <p>Yes, we use industry-standard encryption to protect your personal and nutritional data.</p>
        </div>
      </div>

      <div className="help-section">
        <h2>Contact Support</h2>
        <p>If you need further assistance, please contact our support team:</p>
        <ul>
          <li>Email: support@nutrichat.com</li>
          <li>Phone: 1-800-NUTRI-CHAT</li>
          <li>Hours: Monday-Friday, 9 AM - 5 PM EST</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>App Version</h2>
        <p>NutriChat v1.0.0</p>
      </div>
    </div>
  );
};

export default Help;
