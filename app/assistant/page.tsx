"use client"

import { useState, useRef, useEffect } from "react"
import Head from "next/head"
import { SiteHeader } from "@/components/site-header"
import OpenAI from "openai"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const API_KEY = "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" // Hardcoded API key (replace with your actual key for testing; note: hardcoding in client-side code is insecure for production)

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) // Allow browser for client-side usage (not recommended for production)

const SYSTEM_PROMPT = `
You are Voyage, a virtual tour guide for Sikkim. Greet users warmly and help with travel plans, monastery facts, routes, local food, festivals, and more. Keep responses engaging, informative, and concise. Use markdown for formatting when appropriate. Always suggest related topics or follow-up questions.
`

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!API_KEY || API_KEY === "your-openai-api-key-here") {
      console.warn("OpenAI API key is not set. Please replace the hardcoded API_KEY.")
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Error: API key not configured. Please set a valid OpenAI API key.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([errorMessage])
      return
    }

    try {
      const greeting: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Hi! I'm Voyage, your virtual tour guide. Where would you like to explore today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([greeting])
    } catch (error) {
      console.error("Failed to initialize:", error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Error: Failed to initialize. Check your API key or network connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([errorMessage])
    }
  }, [])

  // Scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const getResponse = async (userInput: string): Promise<string> => {
    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userInput },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: fullMessages }),
      });

      const data = await res.json();
      return data.reply?.content || "No response received.";
    } catch (error) {
      console.error("API call error:", error);
      return "Error: Unable to get response from AI. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: input, timestamp: new Date().toLocaleTimeString() },
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };
  const handleQuickReply = async (query: string) => {
    if (query === "start") return
    setInput(query)
    await handleSend()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend()
    }
  }

  const handleClearChat = () => {
    setMessages([])
    console.log("Chat history cleared")
    inputRef.current?.focus()
    const greeting: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: "Hi! I'm Voyage, your virtual tour guide. Where would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([greeting])
  }

  return (
    <main>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-3xl">Smart Guide Assistant</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ask travel questions, get monastery facts, plan routes and discover local food.
        </p>
        <div className="mt-6 rounded-xl border bg-card p-6">
          {/* Chat container */}
          <div
            className="flex h-[500px] flex-col rounded-lg border bg-white shadow-sm"
            role="region"
            aria-label="Chat window"
          >
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <svg
                    className="h-12 w-12 text-emerald-600 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start typing to ask about monasteries, routes, or food!
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Monastery Info", "Plan a Route", "Local Food"].map((query) => (
                      <button
                        key={query}
                        onClick={() => handleQuickReply(query)}
                        className="rounded-full bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 transition-colors"
                        aria-label={`Quick reply: ${query}`}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex animate-fade-in ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`flex max-w-[70%] items-start gap-2 rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <svg
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 1.79-7 4v2h14v-2c0-2.21-3.134-4-7-4z"
                          />
                        </svg>
                      )}
                      <div>
                        <p className="text-sm">{msg.content}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{msg.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-lg bg-muted p-3 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about monasteries, routes, or food..."
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-shadow"
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  aria-label="Send message"
                >
                  Send
                </button>
                <button
                  onClick={handleClearChat}
                  className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-300 transition-colors"
                  aria-label="Clear chat history"
                >
                  Clear
                </button>
              </div>
              {messages.length === 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Monastery Info", "Plan a Route", "Local Food"].map((query) => (
                    <button
                      key={query}
                      onClick={() => handleQuickReply(query)}
                      className="rounded-full bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700 transition-colors"
                      aria-label={`Quick reply: ${query}`}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  )
}