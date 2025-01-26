**Capx Portfolio**

Capx Portfolio is a simple portfolio tracking application that allows users to manage their stock holdings, track real-time stock prices, and view key portfolio metrics through an intuitive dashboard.

**Features**

Stock Management: Add, view, edit, and delete stock holdings.
Real-Time Updates: Fetch real-time stock prices using the Finnhub API.
Dashboard Metrics: View essential metrics like total portfolio value and individual stock performance.
Search Stocks: Search for stocks by symbol or name.
Tech Stack
Frontend: React
Backend: Spring Boot
API: Finnhub API for stock data
Getting Started
Prerequisites
Node.js and npm installed
Java (JDK 17 or higher) installed
Gradle installed

**Steps to Run Locally**

Frontend
Navigate to the frontend directory:
bash
Copy
Edit
cd frontend  
Install dependencies:
bash
Copy
Edit
npm install  
Start the development server:
bash
Copy
Edit
npm start  
Open http://localhost:3000 to view the app.
Backend
Navigate to the backend directory:
bash
Copy
Edit
cd backend  
Build the application using Gradle:
bash
Copy
Edit
./gradlew build  
Run the Spring Boot application:
bash
Copy
Edit
./gradlew bootRun  
The backend will be available at http://localhost:8080.
Deployment Links
Frontend: Live Deployment
Backend API Documentation: API Docs
Assumptions and Limitations
The application uses the free tier of the Finnhub API, which has a request limit.
Backend deployment assumes availability of a compatible environment like Render or Heroku.
The frontend is optimized for modern browsers.
Repository
Find the complete codebase here: Capx Portfolio GitHub Repository

License
This project is licensed under the MIT License.









