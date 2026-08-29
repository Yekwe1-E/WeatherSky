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
    * [2.2 Historical Evolution of Meteorological Forecasting](#22-historical-evolution-of-meteorological-forecasting)
    * [2.3 The Web Revolution and API Integration](#23-the-web-revolution-and-api-integration)
    * [2.4 Server-Side Architectural Paradigms: Node.js vs Traditional Apache](#24-server-side-architectural-paradigms-nodejs-vs-traditional-apache)
    * [2.5 Security and Data Persistence in Web Applications](#25-security-and-data-persistence-in-web-applications)
    * [2.6 Review of Related Weather Information Systems](#26-review-of-related-weather-information-systems)

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study
The monitoring and forecasting of weather conditions have remained integral to human survival, agricultural planning, and socio-economic development for centuries (Ahrens & Henson, 2021). The dynamic nature of the Earth's atmosphere dictates that meteorological parameters such as temperature, humidity, wind velocity, and atmospheric pressure are in a constant state of flux. Consequently, capturing this data and delivering it promptly to the public is of paramount importance. According to the World Meteorological Organization (2019), timely access to accurate climatic data significantly mitigates the devastating impacts of extreme weather events and bolsters the operational efficiency of industries relying heavily on environmental predictability, such as aviation, maritime transport, and agriculture.

In the past, the dissemination of weather forecasts was strictly confined to traditional media platforms, including television broadcasts, radio waves, and print media (Gleick, 2018). While these mediums were effective for their time, they inherently lacked geographic specificity and real-time updates. A forecast broadcasted in the morning could easily become obsolete by the afternoon, leaving individuals unprepared for sudden atmospheric shifts. The transition from analog reporting to digital, web-centric dissemination marked a paradigm shift in meteorological science (Smith & Lawson, 2020). The rapid global expansion of the internet, coupled with the computational capabilities of modern servers, facilitated the development of interactive platforms capable of parsing and displaying astronomical datasets in fractions of a second (Kurose & Ross, 2017).

The integration of Application Programming Interfaces (APIs) has further revolutionized this domain. An API serves as a digital bridge, allowing disparate software architectures to communicate securely and asynchronously (Pressman, 2014). In the context of meteorology, APIs provided by global weather agencies allow independent developers to securely fetch live numerical weather predictions without needing to deploy physical sensory equipment (Rizwan, Ahmad, & Khan, 2018). This decoupling of data collection and data presentation birthed the era of dynamic web applications—platforms that do not merely display static web pages, but actively request and process JSON (JavaScript Object Notation) payloads based on user interactions (Flanagan, 2020). 

It is within this technological context that the proposed system, "WeatherSky," is situated. The project leverages the scalability of Node.js on the server-side, a relational MySQL database for data persistence, and the OpenWeatherMap API for fetching real-time datasets (Cantelon et al., 2014). By utilizing a Client-Server architecture, WeatherSky is hypothesized to provide a highly optimized, user-centric portal for real-time weather monitoring, effectively eliminating the information delays characteristic of legacy broadcasting methods.

## 1.2 Statement of the Problem
Despite the proliferation of digital forecasting platforms, significant architectural and user-experience issues persist across many contemporary applications. A critical examination of existing commercial forecasting websites reveals a heavy reliance on synchronous data fetching and excessive advertisement loading, which inherently degrades network performance and increases time-to-interactivity (Nielsen, 2019). When users require immediate weather updates during emergency storm tracking or rapid commuting decisions, latency introduced by bloated Graphical User Interfaces (GUIs) or inefficient backend queries can render the application effectively useless (Garrett, 2011). 

Furthermore, many of these platforms lack robust localization and personalization. Users frequently traverse identical user journeys every time they log in—manually typing out geographical coordinates or city strings to find relevant data—due to a lack of secure, database-driven preference management (Connolly & Begg, 2015). There is also a notable absence of decentralized, lightweight web applications that execute securely without demanding heavy client-side hardware processing. Therefore, there exists an acute necessity to engineer a streamlined, decoupled web application that prioritizes asynchronous data retrieval mechanisms, employs a normalized relational database for persistent user state management, and presents meteorological variables without the latency of commercial bloatware.

## 1.3 Aim and Objectives of the Study

**AIM**
TO DESIGN AND IMPLEMENT A REAL-TIME WEATHER FORECASTING WEB APPLICATION.

**OBJECTIVES**
1. To analyze the existing computational methodologies and web protocols related to the Design and Implementation of a Real-Time Weather Forecasting Web Application.
2. To investigate the architectural latencies and usability gaps present in the Design and Implementation of a Real-Time Weather Forecasting Web Application.
3. To Design and Implement a Real-Time Weather Forecasting Web Application using a Node.js runtime environment and a relational database.
4. To test the Real-Time Weather Forecasting Web Application against standard HTTP load thresholds and API parsing accuracies.
5. To recommend the Real-Time Weather Forecasting Web Application for broad institutional deployment and subsequent modification for localized municipal scaling.

## 1.4 Significance of the Study
The execution and deployment of this software system yield substantial practical and academic significance. From a practical standpoint, the resulting application offers the public an incredibly fast, highly responsive utility for daily climatic preparation. By introducing a secure authentication framework linked to a MySQL database, users are empowered to persistently save geographical coordinates, bypassing the necessity of recursive manual searches (Silberschatz, Korth, & Sudarshan, 2019). For municipal agencies or local agricultural sectors, the underlying decoupled architecture of the application serves as a prime template that can be quickly expanded to calculate local agricultural yield projections based on imminent rainfall data.

Academically, this study contributes to the expanding body of knowledge concerning full-stack software development. It provides a documented, empirically tested blueprint on how to successfully bind third-party RESTful APIs with non-blocking, event-driven server environments (like Node.js) while maintaining normalized CRUD (Create, Read, Update, Delete) operations on a relational database (Tilkov et al., 2015).

## 1.5 Scope of the Study
The parameters of this study encompass the software engineering lifecycle required to develop a functional web-based weather utility. Structurally, the scope is confined to the implementation of the frontend using HTML5, CSS3, and JavaScript, and the backend utilizing the Express.js framework on top of Node.js. The data handling scope is strictly limited to capturing, parsing, and rendering current weather variables (temperature, humidity, atmospheric pressure, and wind speed) and generating a mathematical 5-day predictive forecast. The project includes the construction of a persistent, encrypted user authentication module (via bcrypt hashing). However, the study does not extend to the manufacturing of hardware sensors, the physical deployment of meteorological balloons, or the algorithmic recalculation of the core OpenWeatherMap datasets.

## 1.6 Definition of Terms
*   **API (Application Programming Interface):** A structured set of communication protocols enabling different software applications to exchange data securely without sharing underlying source code.
*   **Asynchronous JavaScript and XML (AJAX):** A group of interconnected web development techniques used on the client-side to create asynchronous web applications, allowing data retrieval without interfering with the display and behavior of the existing page.
*   **Client-Server Architecture:** A distributed application structure that partitions functional tasks or workloads between the providers of a resource or service, called servers, and service requesters, called clients.
*   **Node.js:** A cross-platform, open-source server environment that executes JavaScript code entirely outside of a web browser context, utilizing an event-driven, non-blocking I/O model.
*   **MySQL:** An open-source relational database management system (RDBMS) based on Structured Query Language (SQL), used heavily for data persistence.
*   **JSON (JavaScript Object Notation):** A lightweight data-interchange format that is easily human-readable and computationally straightforward for machines to parse and generate.
*   **REST (Representational State Transfer):** A software architectural style that defines a set of constraints to be used for creating Web services.


---

# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction
The literature review critically evaluates the progression of meteorological systems, from primitive analog instrumentation to highly sophisticated digital arrays. It explores the theoretical constructs governing web architectures, data encapsulation, and relational databases. By reviewing the existing body of scholarly work concerning real-time data processing and human-computer interactions, this chapter contextualizes exactly why modern web frameworks represent the optimal modality for weather data delivery, ultimately exposing the gaps that justify the development of the "WeatherSky" system.

## 2.2 Historical Evolution of Meteorological Forecasting
Human reliance on weather prediction predates modern computation by millennia, initially dependent heavily on astrological observations and localized environmental indicators (Lynch, 2006). The conceptual formalization of weather forecasting as a rigid science began in the 19th century with the invention of the electric telegraph, which allowed for the instantaneous transmission of barometric readings across vast geographic distances (Gleick, 2018). However, the true quantum leap in accuracy occurred in the 1950s with the advent of Numerical Weather Prediction (NWP). As outlined by Edwards (2010), NWP fundamentally changed meteorology by processing atmospheric dynamics as complex mathematical equations solvable by the earliest electronic computers, such as the ENIAC.

Despite the mathematical triumphs of NWP, a bottleneck emerged in the distribution of this data to the general populace. Throughout the late 20th century, the public remained passive recipients of delayed broadcasts via television and print. According to Mass (2012), this top-down dissemination model hindered hyper-local preparation. The public could not dynamically query the weather for an exact coordinate, nor could they receive minute-by-minute updates surrounding localized storm cells.

## 2.3 The Web Revolution and API Integration
The proliferation of the World Wide Web dismantled the distribution bottlenecks of conventional media. Berners-Lee (1999) conceptualized the web not merely as a repository for static documents, but as a dynamic medium for data exchange. The evolution from static HTML structures (Web 1.0) to interactive, AJAX-driven frameworks (Web 2.0) allowed meteorological organizations to deliver raw datasets directly to global consumers (O'Reilly, 2007).

Central to this revolution was the conception of the Application Programming Interface (API). APIs function as regulated gateways, allowing third-party developers to access proprietary computational models without exposing server vulnerabilities. In modern software engineering, RESTful APIs serve as the gold standard for web connectivity (Tilkov et al., 2015). REST operates statelessly, meaning every HTTP request from a client contains all the necessary contextual data for the server to fulfill the request. This statelessness drastically improves server scalability during massive traffic load spikes—such as during severe weather alerts—because the server does not need to retain session memory regarding the API requester (Fielding, 2000).

Moreover, the utilization of JSON as the primary payload format over HTTP requests has optimized parsing speeds. As Crockford (2006) explains, JSON’s strict key-value structuring permits natively rapid execution within JavaScript environments, circumventing the heavier XML parsing algorithms utilized in earlier decades.

## 2.4 Server-Side Architectural Paradigms: Node.js vs Traditional Apache
The choice of backend architecture heavily influences the responsiveness of real-time applications. Traditional architectures, primarily represented by Apache HTTP Servers handling PHP scripts, operate on a multi-threaded, blocking Input/Output (I/O) model. Under this model, each incoming client request spawns a new thread consuming distinct memory allocation (Cantelon et al., 2014). In high-traffic scenarios, such as thousands of users concurrently querying neighborhood rainfall predictions, thread exhaustion can cause severe server latency and eventual HTTP 503 timeout errors.

In contrast, Node.js operates on a completely different paradigm. Developed by Ryan Dahl in 2009, Node.js runs on a single-threaded, event-driven, non-blocking I/O model (Dahl, 2009). When a Node.js server receives a request that requires a time-consuming database lookup or third-party API fetch, it does not halt execution. Instead, the task is pushed asynchronously to a callback queue. Consequently, the main thread remains unobstructed and capable of instantaneously receiving hundreds of other concurrent incoming queries. Tilkov (2015) mathematically demonstrates that for applications characterized by heavy I/O operations and lightweight computational loads—which is the exact profile of an application acting as a proxy for an external weather API—Node.js overwhelmingly outperforms traditional multi-threaded servers in throughput efficiency.

## 2.5 Security and Data Persistence in Web Applications
Data persistence—the ability of an application to retain user state beyond a single browser session—requires a robust relational database. Relational Database Management Systems (RDBMS) like MySQL arrange data in strict, normalized tabular schemas governed by algebraic relations (Codd, 1970). According to Silberschatz, Korth, and Sudarshan (2019), SQL databases enforce Atomicity, Consistency, Isolation, and Durability (ACID properties), which guarantees data integrity even in the event of abrupt hardware failure. 

However, storing user variables implies the management of sensitive credentials. The widespread vulnerabilities surrounding SQL injections and plaintext password leaks mandate cryptographic intervention. Modern applications employ specific hashing algorithms deliberately engineered to be computationally expensive, thereby deterring brute-force decryption attacks. The `bcrypt` encryption schema utilized in the proposed system incorporates "salting"—the integration of randomized data to the password before hashing—effectively immunizing the database against pre-computed rainbow table attacks (Provos & Mazières, 1999).

## 2.6 Review of Related Weather Information Systems
Numerous web applications occupy the contemporary meteorological space, each demonstrating specific architectural trade-offs:
*   **The Weather Channel (Web):** Although it provides highly accurate Doppler radar integrations, its client-side load is immensely heavy. Analyzing its DOM (Document Object Model) load structure reveals significant render-blocking scripts prioritizing advertising over core functional weather metrics.
*   **Dark Sky (Legacy) / Apple Weather:** Recognized globally for its pioneering work algorithmic "nowcasting"—predicting weather variables down to the minute. While technologically superior, its backend methodologies remained proprietary and highly gated until commercial acquisition, completely restricting open-source integrations (Mass, 2012).
*   **AccuWeather:** AccuWeather offers detailed hourly datasets but its application suffers from poor spatial organization on mobile viewport outputs.

These related systems expose a distinct vacancy in the digital landscape: the necessity for a highly performant, open-ended web utility that leverages the speed of Node.js and the structural integrity of MySQL to deliver raw, ad-free meteorological intelligence. The design proposed in this study deliberately avoids synchronous script blocking and client-heavy DOM manipulations to ensure maximum performance across all internet connection capabilities.

---
(Note: References will be compiled in Chapter 5 in the final compilation)
