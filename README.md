# Collaborative Whiteboard App
 
*A real-time, collaborative whiteboard application.*

## 🚀 Live Demo
Check out the live deployed version of the app [here](https://www.collaborateboard.site).

## 📚 Project Overview
The Collaborative Whiteboard App is designed to bring the interactive experience of a physical whiteboard to the digital space. This app enables multiple users to collaborate in real-time, providing a seamless platform for remote teams, online learning, and creative brainstorming sessions.

## 🛠 Core Features
- **Real-time Collaboration**: 
  - Multiple users can draw, write, and interact on the same canvas simultaneously using **Socket.IO**. The app handles synchronization efficiently to ensure that every participant sees the updates in real-time.

- **Authentication & Authorization**:
  - Secure user sessions and data protection are implemented using **JWT (JSON Web Tokens)**. Users can register, log in, and enjoy a secure experience. The app also ensures that only authorized users can access specific whiteboards.

- **Advanced Drawing Tools**:
  - A variety of tools including pencils, erasers, shapes, and text boxes powered by the **Canvas API**. The app supports undo/redo functionality and auto-saving to retain whiteboard content across sessions, even if the user is not logged in.

- **Integrated Real-time Chat**:
  - Chat feature built using **Socket.IO** allows users to communicate directly within the whiteboard. This makes collaboration even more effective as users can discuss ideas and share thoughts in real-time.

- **Whiteboard Sharing & Joining**:
  - Users can easily share and join whiteboards via unique session codes. This feature allows teams or groups to quickly collaborate on a shared canvas without the need for extensive setup.

## 🛠 Tech Stack
- **Frontend**: React.js, Canvas API, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Real-time Communication**: Socket.IO
- **Authentication/Authorization**: JWT (JSON Web Tokens)
- **Database**: MongoDB (for storing user data and whiteboard sessions)

## 📋 How to Use
1. **Sign Up**: Create an account using your email and a secure password.
2. **Create or Join a Whiteboard**: You can start a new whiteboard session or join an existing one using a session code.
3. **Collaborate in Real-time**: Use the drawing tools to collaborate with others in real-time. Communicate using the integrated chat.
4. **Save Your Work**: The whiteboard automatically saves your progress, ensuring your work is preserved across sessions.
5. **Share with Others**: Invite others to your whiteboard by sharing the session code.

## 💡 What I Learned
Through this project, I enhanced my skills in both frontend and backend development, as well as in deploying a full-stack application. Working with real-time technologies like **Socket.IO** taught me how to handle synchronization and concurrency effectively. I also gained valuable experience in managing non-relational databases with **MongoDB**, ensuring data consistency and persistence across multiple users. This project has undoubtedly made me a more proficient and well-rounded software developer.

---

This project showcases my ability to build complex, interactive applications with a focus on user experience, security, and real-time functionality. I invite you to explore the live demo and check out the code on GitHub.

- **Live Demo Video**: [Demo video](https://drive.google.com/file/d/1Eg7V6xpsUchCkgGjAxFjvwQYUYJcBenP/view?usp=drive_link).
