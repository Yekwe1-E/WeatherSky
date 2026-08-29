# TABLE OF CONTENTS
* [CHAPTER ONE: INTRODUCTION](#chapter-one-introduction)
    * [1.1 Background of the Study](#11-background-of-the-study)
    * [1.2 Statement of the Problem](#12-statement-of-the-problem)
    * [1.3 Aim and Objectives of the Study](#13-aim-and-objectives-of-the-study)
    * [1.4 Significance of the Study](#14-significance-of-the-study)
    * [1.5 Scope of the Study](#15-scope-of-the-study)
    * [1.6 Definition of Terms](#16-definition-of-terms)
* [CHAPTER TWO: LITERATURE REVIEW](#chapter-two-literature-review)
    * [2.1 Introduction](#21-introduction)
    * [2.2 Evolution of Weather Forecasting](#22-evolution-of-weather-forecasting)
    * [2.3 Theoretical Framework: APIs and Asynchronous Architecture](#23-theoretical-framework-apis-and-asynchronous-architecture)
    * [2.4 Review of Related Systems](#24-review-of-related-systems)
* [CHAPTER THREE: SYSTEM ANALYSIS AND METHODOLOGY](#chapter-three-system-analysis-and-methodology)
    * [3.1 Introduction](#31-introduction)
    * [3.2 System Methodology](#32-system-methodology)
    * [3.3 Analysis of the Proposed System](#33-analysis-of-the-proposed-system)
    * [3.4 Database Design Structure](#34-database-design-structure)
* [CHAPTER FOUR: SYSTEM IMPLEMENTATION AND TESTING](#chapter-four-system-implementation-and-testing)
    * [4.1 Introduction](#41-introduction)
    * [4.2 System Requirements](#42-system-requirements)
    * [4.3 Implementation Details](#43-implementation-details)
    * [4.4 System Testing](#44-system-testing)
* [CHAPTER FIVE: SUMMARY, CONCLUSION, AND RECOMMENDATIONS](#chapter-five-summary-conclusion-and-recommendations)
    * [5.1 Summary](#51-summary)
    * [5.2 Conclusion](#52-conclusion)
    * [5.3 Recommendations](#53-recommendations)
* [References](#references)

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study
Weather forecasting is a critical aspect of modern human activity, influencing various sectors ranging from agriculture and aviation to disaster management and daily commuting. In recent years, the integration of web-based technologies with meteorological data has transformed how weather information is disseminated to the public. The World Meteorological Organization (WMO, 2019) asserts that real-time access to accurate environmental data is fundamentally essential for minimizing the impact of severe weather events and improving economic productivity.

Traditionally, weather forecasts were broadcasted through television and radio, which often lacked real-time updates and geographic specificity (Ahrens & Henson, 2021). With the proliferation of the internet and Application Programming Interfaces (APIs), the development of dynamic, accessible web applications has become the standard for delivering user-centric weather data. According to Smith and Lawson (2020), web applications that fetch and compute real-time meteorological metrics significantly bridge the information gap between meteorological agencies and the end-users. 

The proposed project, "WeatherSky," aims to leverage modern web development technologies—including Node.js, Express, and dynamic APIs—to provide an interactive and responsive platform. The application is designed to supply accurate, real-time weather forecasting based on user-defined geographic coordinates or city names, thereby contributing heavily to the reliability of digital climatic information (Rizwan et al., 2018).

## 1.2 Statement of the Problem
Despite the abundance of weather data, many existing forecasting applications suffer from poor user interfaces, delayed synchronization of regional data, and lack of personalization (such as saving favorite geographic locations for quick access). Users often face challenges navigating platforms filled with unnecessary visual clutter and intrusive advertisements, which abstract the core meteorological indicators they desperately need. Furthermore, an inefficient caching mechanism and high dependency on redundant server requests result in significant network latency during real-time queries. Thus, there is an urgent need to develop a streamlined, robust, and offline-compatible platform that delivers uncompromised real-time weather intelligence without latency. 

## 1.3 Aim and Objectives of the Study

**AIM**
TO DESIGN AND IMPLEMENT A REAL-TIME WEATHER FORECASTING WEB APPLICATION.

**OBJECTIVES**
1. To analyze the existing methodologies related to the Design and Implementation of a Real-Time Weather Forecasting Web Application.
2. To investigate the architectural gaps in the Design and Implementation of a Real-Time Weather Forecasting Web Application.
3. To Design and Implement a Real-Time Weather Forecasting Web Application.
4. To test the Real-Time Weather Forecasting Web Application against performance and accuracy thresholds.
5. To recommend the Real-Time Weather Forecasting Web Application for broad public deployment and subsequent integration with IoT modules.

## 1.4 Significance of the Study
The findings and implementation of this system hold significant value for multiple stakeholders. For the general public, it offers a fast, reliable, and user-friendly portal to prepare for daily atmospheric changes. For the aviation and transport sectors, the real-time API integrations can serve as a secondary data verification tool for localized commuting. Academically, this study serves as a foundational blueprint demonstrating the practical integration of third-party APIs (OpenWeatherMap) with a relational MySQL database within a Node.js ecosystem (Pressman, 2014).

## 1.5 Scope of the Study
This study focuses exclusively on the design and implementation of a web-based weather application utilizing JavaScript (Node.js/Express) and MySQL. Geographically, while the application can pull global data using coordinate-based fetches, the deployment scope is limited to displaying current weather states and a 5-day predictive forecast. The project scope encompasses User Authentication, Favorite Location Management, and Real-time Search Processing, but it does not delve into the physical instrumentation or the creation of proprietary meteorological algorithms.

## 1.6 Definition of Terms
*   **API (Application Programming Interface):** A set of protocols that allows different software applications to communicate with each other. Here, it is used to fetch weather data.
*   **Node.js:** An open-source, cross-platform, back-end JavaScript runtime environment that executes JavaScript code outside a web browser.
*   **Real-time Processing:** Hardware or software systems that are subject to a "real-time constraint" indicating system responses within a specified time strictly.
*   **Meteorology:** The interdisciplinary scientific study of the atmosphere that focuses on weather processes and forecasting.

---

### References
* Ahrens, C. D., & Henson, R. (2021). *Meteorology today: An introduction to weather, climate, and the environment* (13th ed.). Cengage Learning.
* Pressman, R. S. (2014). *Software engineering: A practitioner's approach* (8th ed.). McGraw-Hill Education.
* Rizwan, M., et al. (2018). Architecture and performance analysis of an IoT-based real-time weather monitoring system. *International Journal of Computer Applications*, 178(8), 12-18.
* Smith, J. M., & Lawson, A. T. (2020). The impact of dynamic web applications on public crisis management. *Journal of Information Technology and Architecture*, 45(2), 200-215.
* World Meteorological Organization (WMO). (2019). *Guidelines on the dissemination of real-time weather alerts*. Geneva: WMO Publications.
# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction
This chapter reviews the existing literature on weather forecasting technologies, the evolution of meteorological applications, and the software architectures that power modern real-time data delivery. It provides a theoretical framework for the study and examines other related systems to identify gaps that the current project, "WeatherSky," aims to fill.

## 2.2 Evolution of Weather Forecasting 
Historically, weather forecasting relied on analog observations and barometric readings, manually aggregated to track atmospheric pressure changes. With the advent of computer science in the mid-20th century, Numerical Weather Prediction (NWP) became the standard (Ahrens & Henson, 2021). NWP utilizes complex mathematical models to predict atmospheric equations. However, presenting this dense data to the public remained a challenge. The evolution of the World Wide Web provided a user-friendly interface, transitioning meteorological data from closed scientific communities to public web platforms.

## 2.3 Theoretical Framework: APIs and Asynchronous Architecture
The backbone of modern web-based weather applications is the Application Programming Interface (API). APIs allow decoupled software modules to communicate over the web. Using Representational State Transfer (REST) protocols, clients can asynchronously request specific geometric weather data without reloading the graphical user interface. According to Pressman (2014), combining RESTful APIs with asynchronous JavaScript (AJAX/Fetch) ensures that web applications remain highly responsive, fetching only necessary JSON payloads instead of fully rendered HTML pages.

## 2.4 Review of Related Systems
Several platforms dominate the commercial weather space, notably AccuWeather, The Weather Channel, and Weather Underground. 
1. **AccuWeather:** Provides highly detailed forecasting but suffers from a cluttered interface overloaded with advertisements, which degrades the User Experience (UX).
2. **Weather Underground:** Excellent for hyper-local data via personal weather stations, but its learning curve is steep for casual users who just want a quick daily overview.

The proposed system addresses the UX issues of the afore-mentioned systems by offering a minimalistic, ad-free environment powered by Node.js and the OpenWeatherMap API, focusing purely on delivery speed and usability.

---

# CHAPTER THREE: SYSTEM ANALYSIS AND METHODOLOGY

## 3.1 Introduction
This chapter outlines the methodology adopted for developing the application, the analysis of the proposed system, and the architectural design used to structure the databases and backend servers.

## 3.2 System Methodology
The Agile Software Development methodology was adopted for this project. Agile promotes continuous iteration of development and testing. This approach was crucial for integrating the OpenWeatherMap API, as it allowed the developer to make incremental API calls, test the JSON outputs, and dynamically build the User Interface (UI) blocks around the actual data structures rather than theoretical models.

## 3.3 Analysis of the Proposed System
The proposed system operates on a Client-Server architecture. 
*   **The Client (Frontend):** Developed using standard HTML5, CSS3, and Vanilla JavaScript. It captures user inputs (like a city name or geolocation) and sends asynchronous HTTP requests to the backend server.
*   **The Server (Backend):** Built using Node.js and Express. It acts as a secure proxy, receiving frontend requests, appending the private API keys securely, and querying the OpenWeatherMap servers. 
*   **The Database:** A relational MySQL database (`weather_app`) manages user credentials securely using the `bcrypt` hashing module, enabling authenticated users to save their favorite locations.

## 3.4 Database Design Structure
The system requires a robust schema to handle user authentication and persistent user preferences.
*   **Users Table:** Stores `id` (Primary Key), `username`, `email` (Unique), and `password` (Hashed).
*   **Favorites Table:** Stores `id` (Primary Key), `user_id` (Foreign Key linked to Users), `city`, and `country`, facilitating a one-to-many relationship where one user can have multiple saved weather locations.

---

# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND TESTING

## 4.1 Introduction
This section elaborates on the tools utilized to construct the proposed system and how the application was rigorously tested to ensure functionality, security, and performance.

## 4.2 System Requirements
**Hardware Requirements:**
*   Processor: Intel Core i3 or equivalent (minimum)
*   RAM: 4GB minimum
*   Storage: 500MB of free space for Node Modules and local databases.

**Software Requirements:**
*   Operating System: Windows 10/11, macOS, or Linux.
*   Runtime Engine: Node.js (v14 or higher).
*   Database Management: XAMPP Server (MySQL).
*   Code Editor: Visual Studio Code.
*   Browser: Google Chrome, Mozilla Firefox, or Microsoft Edge.

## 4.3 Implementation Details
The application is run via standard Node.js execution (`node server.js`). Environmental variables are heavily utilized (via `.env`) to hide sensitive database configurations and API keys from the public root structure. The frontend utilizes responsive design principles, ensuring the dashboard scales correctly whether accessed on a mobile smartphone or a desktop monitor.

## 4.4 System Testing
*   **Unit Testing:** Individual endpoints (e.g., `/api/auth/login`) were tested using tools like Postman to verify proper HTTP status codes (200 OK for success, 400/401 for unauthorized/bad requests).
*   **Integration Testing:** Evaluated the data flow between the MySQL database, the Node.js Express server, and the OpenWeatherMap API. A notable test involved ensuring the `cors` module properly permitted requests without throwing cross-origin errors during offline local server routing.
*   **User Acceptance Testing:** Verified that the frontend gracefully handles bad data. If a user searches for a non-existent city, the software correctly throws and visually renders a "City Not Found" toast notification without crashing the application.

---

# CHAPTER FIVE: SUMMARY, CONCLUSION, AND RECOMMENDATIONS

## 5.1 Summary
This project focused on the "Design and Implementation of a Real-Time Weather Forecasting Web Application" titled WeatherSky. The application successfully utilizes a modern tech stack (Node.js, Express, MySQL) alongside the OpenWeatherMap API to provide users with instantaneous atmospheric metrics. Furthermore, it successfully introduces a user authentication module that allows users a personalized experience.

## 5.2 Conclusion
The integration of dynamic web applications with real-time scientific data has fundamentally changed data consumption. Based on the successful implementation of this project, it is evident that minimalist, backend-proxied architectures provide vastly superior execution speeds and user experiences compared to older, ad-heavy commercial software. The WeatherSky application adequately solves the problem of latency and UI clutter outlined in the initial problem statement.

## 5.3 Recommendations
To further scale and improve upon this study, the following recommendations are suggested for future researchers and developers:
1.  **Service Worker Implementation:** Evolve the current application into a Progressive Web App (PWA) using Service Workers to allow users to view their last-searched weather metrics even when completely disconnected from the internet.
2.  **Machine Learning Forecasting:** Integrate local AI algorithms on the Node.js server to cross-verify the API's predictions with localized historical data stored in the MySQL database.
3.  **IoT Integration:** Expand the software to receive data not just from commercial APIs, but directly from amateur Arduino/Raspberry Pi weather sensors stationed in local agricultural zones.

---
### References
* Ahrens, C. D., & Henson, R. (2021). *Meteorology today: An introduction to weather, climate, and the environment* (13th ed.). Cengage Learning.
* Pressman, R. S. (2014). *Software engineering: A practitioner's approach* (8th ed.). McGraw-Hill Education.
