# AI Nutritional Chatbot User Guide

## Overview

The AI Nutritional Chatbot is a comprehensive web application designed to help users track their nutrition, get personalized meal recommendations, and achieve their health goals through an interactive AI-powered chat interface.

## Features

- **User Authentication**: Secure login and registration system
- **Personalized Onboarding**: Initial setup to customize nutrition preferences
- **Meal Tracking**: Log and monitor daily food intake
- **Progress Monitoring**: Visual progress tracking with nutrition targets
- **Recipe Recommendations**: Access to curated recipes based on preferences
- **Budget Meals**: Affordable meal suggestions
- **AI Chat Support**: Interactive chatbot for nutrition advice
- **Profile Management**: Update personal preferences and settings

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Email service for password reset (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-nutri-chatbot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```
   JWT_SECRET=your_jwt_secret_here
   MONGODB_URI=mongodb://localhost:27017/ai-nutri-chatbot
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

   The application will be available at `http://localhost:3000`

## User Guide: From Login to Logout

### 1. Accessing the Application

- Open your web browser and navigate to `http://localhost:3000`
- You will be directed to the login page

### 2. User Registration (For New Users)

If you don't have an account:

1. Click on "Register here" link on the login page
2. Fill in the registration form:
   - **Username**: Choose a unique username (minimum 3 characters)
   - **Email**: Enter a valid email address
   - **Password**: Create a strong password (minimum 6 characters)
     - Password strength indicator will show weak/medium/strong
   - **Role**: Select either "Student" or "Professional"
3. Click "Create Account"
4. You will be redirected to the chat page after successful registration

### 3. User Login

For existing users:

1. Enter your registered email address
2. Enter your password
3. Select your role (Student/Professional) - this helps personalize recommendations
4. Click "Login"

**Note**: If you forget your password, click "Forgot Password?" to reset it via email.

### 4. First-Time User Onboarding

New users will go through a 5-step onboarding process to personalize their experience:

#### Step 1: Allergies
- Select any food allergies you have (Nuts, Dairy, Gluten, Eggs, Soy, Shellfish, or None)
- This ensures recommendations avoid allergens

#### Step 2: Goals
- Choose your nutrition goals (multiple selections allowed):
  - Weight Loss
  - Weight Gain
  - Muscle Building
  - Maintain Weight
  - Improve Energy
  - Better Sleep
  - Heart Health

#### Step 3: Dietary Preferences
- Select dietary restrictions or patterns:
  - Vegetarian, Vegan, Keto, Paleo, Mediterranean, Low-Carb, or None

#### Step 4: Activity Level
- Choose your daily activity level:
  - Sedentary (little to no exercise)
  - Lightly Active (light exercise 1-3 days/week)
  - Moderately Active (moderate exercise 3-5 days/week)
  - Very Active (hard exercise 6-7 days/week)
  - Extremely Active (very hard exercise & physical job)

#### Step 5: Nutrition Targets
- Review or adjust your daily nutrition targets:
  - Daily Calorie Target
  - Protein Target (grams)
  - Carbs Target (grams)
  - Fat Target (grams)
- These are auto-calculated based on your goals and activity level but can be customized

Click "Complete Setup" to finish onboarding and access the dashboard.

### 5. Using the Dashboard

After login/onboarding, you'll land on the dashboard with:

#### Progress Overview
- Visual circular progress rings showing:
  - Calories consumed vs. target
  - Protein, Carbs, and Fat intake
- Color-coded rings (red for calories, teal for carbs, blue for protein, orange for fat)

#### Recent Meals
- List of meals logged for the current day
- Shows meal name, calories, and protein

#### Quick Actions
- **Log Meal**: Add a new meal entry
- **View Recipes**: Browse available recipes

#### Adding a Meal
1. Click "Log Meal" or the floating action button (+)
2. Enter meal details:
   - Meal Name
   - Calories
   - Protein (g)
   - Carbs (g)
   - Fat (g)
3. Click "Add Meal"

### 6. Navigation and Features

Use the sidebar (desktop) or bottom navigation (mobile) to access features:

#### Meals View
- Detailed meal tracking interface
- View all logged meals
- Edit or delete meal entries
- Filter by date

#### Progress View
- Detailed progress charts and graphs
- Historical nutrition data
- Goal achievement tracking

#### Recipes View
- Browse curated recipes
- Filter by dietary preferences and allergies
- Save favorite recipes
- Get cooking instructions

#### Budget Meals
- Affordable meal suggestions
- Cost-effective nutrition options
- Budget-friendly recipes

#### Profile
- Update personal information
- Modify nutrition preferences
- Change password
- Update onboarding settings

#### Chat
- Interactive AI chatbot for nutrition advice
- Ask questions about nutrition
- Get personalized recommendations
- Real-time conversation support

### 7. Logging Out

To log out of the system:

1. Click the "Logout" button in the sidebar (desktop)
2. Or access logout through the menu on mobile
3. You will be redirected to the login page
4. Your session will be securely ended

## Tips for Best Experience

- **Regular Logging**: Log your meals consistently for accurate progress tracking
- **Complete Onboarding**: Fill out all onboarding steps for personalized recommendations
- **Update Preferences**: Modify your profile settings as your goals change
- **Use the Chat**: Ask the AI chatbot for specific nutrition advice
- **Monitor Progress**: Regularly check your progress view to stay on track

## Troubleshooting

- **Login Issues**: Ensure correct email/password combination
- **Onboarding Not Saving**: Check internet connection and try again
- **Meal Logging Errors**: Ensure all required fields are filled
- **Chat Not Responding**: Refresh the page or check internet connection

## Support

If you encounter any issues or need assistance:
- Check the chat feature for immediate help
- Review this guide for common solutions
- Contact support through the profile section

---

*This guide covers the complete user journey from initial login through daily usage to logout. The AI Nutritional Chatbot is designed to make nutrition tracking intuitive and effective for achieving your health goals.*
