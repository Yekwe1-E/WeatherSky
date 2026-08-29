# TABLE OF CONTENTS
* [1.1 Background of the Study](#11-background-of-the-study)
* [1.2 Statement of the Problem](#12-statement-of-the-problem)
* [1.3 Aim and Objectives of the Study](#13-aim-and-objectives-of-the-study)
* [1.4 Significance of the Study](#14-significance-of-the-study)
* [1.5 Scope of the Study](#15-scope-of-the-study)
* [1.6 Definition of Terms](#16-definition-of-terms)
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
