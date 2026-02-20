# Email Decision Assistant 📧

A full-stack hackathon prototype that helps users quickly triage and decide how to act on incoming emails using AI-assisted analysis with a human approval step.

---

## 🛑 Problem
Teams and individuals often receive a mix of urgent, important, and low-priority emails. Manually deciding what needs immediate action creates cognitive overload and slows response time.

---

## 💡 Solution
Email Decision Assistant analyzes the content of an email and returns a **clear decision**:
- Urgency level
- Reasoning
- Suggested next action  

A human approval step ensures the user stays in control of the final decision.

---

## ⚙️ How It Works
1. User selects an email from the inbox.
2. Backend analyzes the email content.
3. The system returns:
   - Urgency (URGENT / IMPORTANT / IGNORE)
   - Reason (1 sentence)
   - Suggested action (1 sentence)
4. User approves the recommendation.
5. The task is marked as **Completed ✅**.

---

## 🛠 Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **AI:** Google Gemini (`@google/generative-ai` using `gemini-1.5-flash`)
- **Architecture:** Client–Server
- **Database / Auth:** None (Minimal MVP)

---

## 🤖 AI Integration & Reliability
The backend integrates Google Gemini for structured email analysis. 

To ensure reliable demos and avoid runtime failures, the system includes a **Fallback Mode**. If the AI service is unavailable or the API key is missing, a predefined structured response is returned so the application always works end-to-end.

---

## 📁 Project Structure
```text
dev_dash/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    └── package.json