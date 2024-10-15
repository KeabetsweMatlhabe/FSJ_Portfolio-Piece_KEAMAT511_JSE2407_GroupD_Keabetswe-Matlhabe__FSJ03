# Next.js E-Commerce Project

## Project Description

This project is a Progressive Web Application (PWA) built with Next.js. It leverages Firebase for data management and implements offline capabilities, allowing users to interact with the app seamlessly, even without an internet connection. The app features a user-friendly interface and optimizes data caching to enhance performance.

## Technologies Used

- **Next.js**: A React framework for server-rendered applications.
- **Firebase**: Used for database management, user authentication, and real-time data synchronization.
- **next-pwa**: A plugin for adding PWA functionality to Next.js applications.
- **React**: A JavaScript library for building user interfaces.
- **IndexedDB / Local Storage**: For caching data locally to support offline usage.
- **CSS**: For styling the application, including responsive design.

## How to Set Up the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

## Features

- **Offline Support**: Users can access cached data and utilize features even without an internet connection.
- **Data Synchronization**: Changes made while offline will be automatically synced with Firebase once the app is back online.
- **Responsive Design**: The application is mobile-friendly and adjusts to various screen sizes.
- **PWA Functionality**: Users are prompted to install the app on supported devices, enhancing engagement.
- **Error Handling**: The app gracefully handles errors related to offline mode and provides fallback content when data is unavailable.
- **User Notifications**: Users receive notifications when new versions of the app are available.


## Install Dependencies

Make sure you have Node.js installed, then run:

- bash
- Copy code
- npm install
- Configure Firebase
- Create a .env.local file in the root of the project and add your Firebase configuration:

## bash
NEXT_PUBLIC_API_KEY=your-api-key
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_APP_ID=your-app-id
Hosted Application
You can view the live application at https://fsj-portfolio-piece-keamat-511-jse-2407-group-d-keab-5o6s8tk55.vercel.app .
Vercel Deployment: https://vercel.com/keabetswes-projects/fsj-portfolio-piece-keamat-511-jse-2407-group-d-keabetswe-matlhabe-fsj-03-zro2?status=building%2Cerror%2Cinitializing%2Cqueued%2Cready

## Features
- Offline Support: The application caches data locally, allowing users to interact even without an internet connection.
- Data Synchronization: Changes made while offline will sync with Firebase once the app is back online.
- Responsive Design: The UI is designed to be user-friendly and works well on different devices.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
