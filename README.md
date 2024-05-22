# Simple Chat App
This is a simple chat application built using Node.js, Socket.IO, and GIPHY API for sending GIFs. Users can log in with a nickname and a secret code, then chat with others who are online. The chat history is stored in a JSON file on the server.

## Features
* Login system with nickname and secret code
* Real-time messaging using Socket.IO
* Ability to send GIFs from GIPHY API
* Pagination for loading older messages
* Responsive design for both desktop and mobile devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simple-chat-app.git
```

2. Install dependencies:
```bash
cd simple-chat-app
npm install
```

3. Create a .env file in the root directory and add your GIPHY API key:
```makefile
GIPHY_API_KEY=YOUR_GIPHY_API_KEY
```

4. Start the server:
```bash
node server.js
```

5. Open your web browser and go to http://localhost:3000 to use the chat app.

## Usage
* Enter your nickname and secret code to log in.
* Type a message in the input field and press Enter or click Send to send a text message.
* Click the Search GIF button to search for GIFs from GIPHY and click on a GIF to send it.
* Scroll up to load older messages when the chat history is long.
  
## Collaboration
This project was developed collaboratively. Here's how the collaboration was managed:

1. Planning: We discussed the project requirements and features we wanted to implement.
2. Code Development: We divided the tasks among team members and worked on different parts of the codebase concurrently.
3. Version Control: We used Git and GitHub for version control. Each team member worked on a separate branch and created pull requests for review before merging changes into the main branch.
4. Code Review: Pull requests were reviewed by other team members to ensure code quality and consistency.
5. Testing: We tested the application locally to ensure it worked as expected before deploying it.
   
## Things to Consider
* Ensure that your GIPHY API key is kept confidential. Do not expose it in your code or share it publicly.
* Customize the styling and design of the chat app to match your preferences or branding.
* Consider implementing additional features such as user authentication, message encryption, or message moderation depending on your requirements.

## License
This project is licensed under the MIT License.

## Notes on ChatGPT collaboration
We instructed ChatGPT on what to build for us and our requirements, in different iterations. For example, it firstly built the app with the Express framework, but we instructed it to just use the Socket.IO framework. GIPHY API was added later, as well as saving the messages to a JSON file on the server. It provided the correct code but we had to copy and paste it into a file structure.

The text above in this README.md was based on the following prompt (in Swedish):

_"Kan du skapa en README.md med bra information för det här projektet, inklusive hur vi har samarbetat om koden och saker att tänka på, så att jag kan inkludera den i repositoriet där jag har koden på github? Skriv texten på engelska så att fler kan förstå."_

So the information in this file is partly true, part lies from ChatGPT. The notes in this README about Collaboration is just hallucinations or misunderstanding from ChatGPT, in that sense. We also had to add code about what port number to use (process.env.PORT || 3000) in order for it to work in an Azure App Service.

Also, the secret GIPHY API Key is finally exposed in index.html for anyone connecting to see, even if it's kept locally in ```.env``` for the backend. 
