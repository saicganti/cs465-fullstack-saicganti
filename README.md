# CS465-saicganti

Q - Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).

A - Since the front-end is served with HTML created using Express with Handlebars, the server side will fill the templates with trips before serving each page to the user. The JavaScript will be responsible for adding dynamic behaviors to the pages. Angular Admin is a single page application and it uses components and routing at client side.


Q - Why did the backend use a NoSQL MongoDB database?

A - Both the trips and users are stored as documents in MongoDB, which is more natural since they can be represented using JSON-like objects. The Mongoose schema continues to define the fields for the trips, while MongoDB is more flexible should there be any need to change the data model.


Q - How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?

A - JavaScript is a programming language, while JSON is a format of text used for representing and transferring data. JSON is sent by the front end as part of the API calls, and the backend in Express will receive it, manipulate the MongoDB documents, and send JSON in its replies.


Q - Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

A - This project has a single source where all the API calls take place in the form of TripDataService, and a single login/registration function in addition to splitting up trip listing code into an Angular TripCardComponent. An Express-based website also utilizes Handlebars header and footer partials.


Q - Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

A - The API methods indicate the operation to perform, whereas the endpoints indicate the resources and routes that will process the request. In this case, GET /api/trips gets the trips, POST /api/trips creates a trip, and PUT /api/trips/:tripCode modifies a trip. The endpoints should be tested with valid and invalid input, validating both the results and the status codes. Another dimension of testing will be security, which requires validation of the authorization tokens. Thus, it will be important to test the endpoints with no token, an invalid token, and a valid token, along with whether the authorized user is allowed to do that specific thing.


Q - How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

A - The knowledge acquired through this course enabled me to acquire hands-on full-stack skills which are important for my career objective of becoming a software developer. I have learned how to link the Angular front-end to the Express API and MongoDB, how to design and test REST endpoints, as well as authentication. In addition, I have also acquired skills on how to structure code to use services and components, and debugging. These skills enable me to participate in the development of projects which require development on both ends.
