# DIMLIM Secure Chat

DIMLIM is a secure, end-to-end encrypted messaging app designed to protect user privacy and provide a safe space for communication. With DIMLIM, your messages are encrypted from the moment they leave your device until they reach the intended recipient, preventing any third parties—including the server hosting the app—from accessing your private conversations. DIMLIM is built with a modular infrastructure and is optimized for seamless performance, offering users a robust and reliable messaging experience.

## Features

- **End-to-End Encryption**: Messages are encrypted with SHA256 to ensure secure communication.
- **Group Chats**: Easily set up secure group conversations to communicate with multiple people at once.
- **File Sharing**: Share files and media securely within chats.
- **Customizable User Profiles**: Personalize your account with profile pictures and status updates.
- **Message Blocking**: Block unwanted contacts from messaging you.

## Upcoming Features

- **Message Deletion**: Delete messages from both sender and receiver’s devices.
- **Voice and Video Calls**: Secure voice and video calling functionality.
- **GIF Support**: Enhance expressiveness with GIF support.
- **Multi-App Integration**: Connect with users on other encrypted messaging platforms.
- **Extended File Sharing**: Share documents and other file types with encrypted protection.

**Note**: Some features are in progress, and future updates will bring new functionalities and improvements.

## Table of Contents
- [DIMLIM](#dimlim)
  - [Features](#features)
  - [Upcoming Features](#upcoming-features)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Requirements](#requirements)
    - [Environment Variables](#environment-variables)
      - [Server Environment Variables (`server/.env`)](#server-environment-variables-serverenv)
      - [Client Environment Variables (`client/.env`)](#client-environment-variables-clientenv)
    - [Running on Development Mode](#running-on-development-mode)
    - [Running on Production Mode](#running-on-production-mode)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Compatibility](#compatibility)
    - [Browsers Tested](#browsers-tested)
    - [Operating Systems Tested](#operating-systems-tested)

## Setup

### Requirements

To get started with DIMLIM, ensure you have the following prerequisites installed:

- **Node.js** (v18.13.0 or later)
- **MongoDB** (v4.4 or later)
- **NPM** (v8.19.3 or later)
- A **Linux**, **macOS**, or **WSL** environment is recommended for optimal performance.

### Environment Variables

DIMLIM requires specific environment variables to be set up for the server and client. These variables can be configured by creating `.env` files in the respective directories based on the `.env.example` files provided.

#### Server Environment Variables (`server/.env`)

| Variable        | Description                                       | Required | Default                    |
|-----------------|---------------------------------------------------|----------|----------------------------|
| MONGODB_URI     | MongoDB connection string                         | Yes      | `mongodb://localhost:27017/dimlim` |
| SESSION_SECRET  | Secret key for session encryption                 | Yes      | No Default                 |
| SERVER_PORT     | Port for the server to listen on                  | No       | 3000                       |

#### Client Environment Variables (`client/.env`)

| Variable         | Description                                       | Required | Default                    |
|------------------|---------------------------------------------------|----------|----------------------------|
| VITE_SERVER_HOST | URL for the server to connect to                  | Yes      | `http://localhost:3000`    |

### Running on Development Mode

To start DIMLIM in development mode:

1. **Install dependencies**:
   - **Server**:
     ```bash
     cd server
     npm install
     ```

   - **Client**:
     ```bash
     cd ../client
     npm install
     ```

2. **Run the development server**:
   - In the server folder:
     ```bash
     npm run dev
     ```
   - In the client folder:
     ```bash
     npm run dev
     ```

You can now access the DIMLIM application at the specified local ports.

### Running on Production Mode

For production, use the following commands to start the app in a production-ready environment:

1. **Server**:
   ```bash
   npm run start
   ```

This command will build and start the server, making it ready for production deployment.

## Technologies Used

DIMLIM is developed with a modern tech stack for optimal performance, maintainability, and scalability.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript for type-safe code.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Radix UI**: Component library for building accessible user interfaces.
- **Vite**: Next-generation frontend tooling for fast builds.

### Backend

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for high scalability and flexibility.
- **Mongoose**: ODM for MongoDB and Node.js.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Nodemailer**: Email library for Node.js.

## Compatibility

DIMLIM has been tested across multiple browsers and operating systems to ensure a consistent experience.

### Browsers Tested

![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white)
![Edge](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)
![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)
![Opera](https://img.shields.io/badge/Opera-FF1B2D?style=for-the-badge&logo=Opera&logoColor=white)

### Operating Systems Tested

![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Kali](https://img.shields.io/badge/Kali-268BEE?style=for-the-badge&logo=kalilinux&logoColor=white)

---

DIMLIM is committed to providing a secure, user-friendly platform for private communication. Thank you for using DIMLIM, and enjoy the peace of mind that comes with end-to-end encryption!
