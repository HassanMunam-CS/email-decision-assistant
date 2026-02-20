import { useState } from "react";
import "./App.css";

// Three hardcoded fake emails for the demo
const EMAILS = [
    {
        id: 1,
        subject: "URGENT: Server Down in Production",
        sender: "ops-alert@company.com",
        body: "Our main production server has been unresponsive for the last 20 minutes. Customers are unable to access the service. We need immediate action to bring it back online or roll back to the previous deployment. All hands on deck.",
    },
    {
        id: 2,
        subject: "Q3 Budget Review Meeting",
        sender: "finance@company.com",
        body: "Hi team, just a reminder that our Q3 budget review is scheduled for next Thursday at 2pm. Please prepare your department's expense report and any forecasts for Q4. Attendance is expected for all department heads. Let me know if you have any conflicts.",
    },
    {
        id: 3,
        subject: "Office Pizza Party Friday!",
        sender: "fun-committee@company.com",
        body: "Hey everyone! We're hosting a pizza party this Friday at noon in the main break room. Come enjoy some free food and hang out with your colleagues. No RSVP needed — just show up and grab a slice! 🍕",
    },
];

export default function App() {
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [approved, setApproved] = useState(false);

    // When a new email is selected, reset analysis state
    function handleSelectEmail(email) {
        setSelectedEmail(email);
        setAnalysis(null);
        setApproved(false);
    }

    // Call the backend /analyze endpoint
    async function handleAnalyze() {
        if (!selectedEmail) return;
        setLoading(true);
        setAnalysis(null);
        setApproved(false);

        try {
            const response = await fetch("http://localhost:3001/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: selectedEmail.subject,
                    body: selectedEmail.body,
                }),
            });
            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setAnalysis({
                urgency: "IMPORTANT",
                reason: "Could not reach the backend server.",
                action: "Make sure the backend is running on port 3001.",
            });
        } finally {
            setLoading(false);
        }
    }

    // Urgency badge color mapping
    const URGENCY_CLASS = {
        URGENT: "badge badge-urgent",
        IMPORTANT: "badge badge-important",
        IGNORE: "badge badge-ignore",
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>📬 Email Decision Assistant</h1>
                <p>AI-powered email triage for your inbox</p>
            </header>

            <div className="main-layout">
                {/* LEFT PANEL – Email List */}
                <aside className="email-list">
                    <h2>Inbox</h2>
                    {EMAILS.map((email) => (
                        <div
                            key={email.id}
                            className={`email-item ${selectedEmail?.id === email.id ? "email-item--active" : ""}`}
                            onClick={() => handleSelectEmail(email)}
                        >
                            <div className="email-item-subject">{email.subject}</div>
                            <div className="email-item-sender">{email.sender}</div>
                        </div>
                    ))}
                </aside>

                {/* RIGHT PANEL – Detail + Analysis */}
                <main className="email-detail">
                    {!selectedEmail ? (
                        <div className="placeholder">
                            <span>👈 Select an email to get started</span>
                        </div>
                    ) : (
                        <>
                            {/* Email Details */}
                            <section className="email-view">
                                <div className="email-meta">
                                    <span className="email-meta-label">From:</span>
                                    <span>{selectedEmail.sender}</span>
                                </div>
                                <div className="email-meta">
                                    <span className="email-meta-label">Subject:</span>
                                    <span>{selectedEmail.subject}</span>
                                </div>
                                <p className="email-body">{selectedEmail.body}</p>
                            </section>

                            {/* Analyze Button */}
                            {!approved && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                >
                                    {loading ? "Analyzing…" : "🤖 Analyze with AI"}
                                </button>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <div className="loading-box">
                                    <div className="spinner" />
                                    <span>Asking Gemini AI…</span>
                                </div>
                            )}

                            {/* Analysis Result */}
                            {analysis && !loading && !approved && (
                                <section className="analysis-card">
                                    <h3>AI Analysis</h3>

                                    <div className="analysis-row">
                                        <span className="analysis-label">Urgency</span>
                                        <span className={URGENCY_CLASS[analysis.urgency] ?? "badge badge-important"}>
                                            {analysis.urgency}
                                        </span>
                                    </div>

                                    <div className="analysis-row">
                                        <span className="analysis-label">Reason</span>
                                        <span>{analysis.reason}</span>
                                    </div>

                                    <div className="analysis-row">
                                        <span className="analysis-label">Suggested Action</span>
                                        <span>{analysis.action}</span>
                                    </div>

                                    <button
                                        className="btn btn-approve"
                                        onClick={() => setApproved(true)}
                                    >
                                        ✅ Approve Action
                                    </button>
                                </section>
                            )}

                            {/* Approved State */}
                            {approved && (
                                <div className="approved-box">
                                    <span className="approved-icon">✅</span>
                                    <span>Action approved and marked as Completed!</span>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
