# **Chat Application**

This is a real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack with Socket.IO for real-time communication. The application offers seamless messaging experience.

---

## **Features**


- **Authentication**:  
  Secure user login and registration with the ability to upload a custom profile image or select from pre-designed avatars.
  
- **Search Users**:  
  Effortlessly find users to start a new conversation.

- **Real-Time Messaging**:  
  Instantly send and receive messages with zero delays.

- **Online/Offline and Typing Status**:  
  Display real-time user presence and typing indicators.

- **Multiple Image Uploads**:  
  Share multiple images in a single chat seamlessly.

---

## **Tech Stack**

- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Real-Time Communication**: Socket.IO  

---


## ⚙ Installation

1. Clone the repository:
git clone https://github.com/AdityaRai24/chat-app.git chat-app
cd chat-app


2. Install dependencies for backend:
cd server
npm install


3. Install dependencies for frontend:
cd frontend
npm install


4. Create a .env file in the backend directory with the following variables:
PORT=yourbackendport
JWT_KEY=yourjwtsecretkey
ORIGIN=yourfrontendurl (eg : http://localhost:5173)
DATABASE_URL=yourmongodburl

5. Create a .env file in the backend directory with the following variables:
VITE_BACKEND_URL=your backend url (eg : http://localhost:8000)

## 🚀 Running the Application

1. Start the backend server:
bash
cd backend
npm run dev


2. Start the frontend development server:
cd frontend
npm run dev


The application should now be running on http://localhost:5173

