# React TypeScript To-Do App with Google Authentication

## Overview

Welcome to the React TypeScript To-Do App! This project is a simple and efficient task management application built with React.js, TypeScript, and Tailwind CSS. It includes essential features such as task creation, editing, deletion, marking tasks as completed, setting task deadlines, and providing insightful task information.The application also offers an intuitive Drag and Drop functionality for easy task organization. Additionally, the app integrates Google Authentication to enhance user experience and security. Users can also enjoy a personalized experience with the option to switch between Dark and Light modes.

## Features

- **Task Management:** Create, edit, and delete tasks seamlessly.
- **Task Completion:** Mark tasks as completed to track your progress.
- **Drag And Drop Functionality:** Effortlessly organize tasks through an intuitive Drag and Drop interface.
- **Google Authentication:** Securely log in using your Google account for personalized task management.
- **Responsive Design:** Built with a mobile-first approach, ensuring a smooth experience across various devices.
- **Deadline Setting:** Set deadlines for tasks to better manage your schedule.
- **Task Information:** Get insights into task status, including the number of overdue and pending tasks.
- **Dark and Light Mode:** Choose between dark and light modes for a personalized visual experience.

## Getting Started

Follow these steps to run the application locally:

1. Clone the repository: `git clone https://github.com/RehanRanav/TODO-App-TS.git`
2. Navigate to the project directory: `cd todo-app`
3. Install dependencies: `npm install`
4. **Add Google Client Id:**
   - Obtain a Google Client Id by creating a project on the [Google Cloud Console](https://console.cloud.google.com/).
   - Configure the OAuth consent screen with the necessary information.
   - Create credentials and copy the Client Id.
   - In the project, create a `.env` file at the root and add `REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID`.
5. Run the application: `npm start`
6. Open your browser and visit `http://localhost:3000`.
