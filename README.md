# Install guide
**Run those commands below in the terminal to get things working!**
**Feel free to change** 
  
## Frontend
**npm install**  
**npm run dev**  
  
## Backend
**cd backend**  
**python3 -m venv venv**  
**source venv/bin/activate**  
**pip3 install -r requirements.txt**  
**copy .env.example .env**  
**set GEMINI_API_KEY in .env**  
**uvicorn main:app --reload**  
  
## Scoring
**Scoring logic lives in /scoring and is imported by the backend.**  