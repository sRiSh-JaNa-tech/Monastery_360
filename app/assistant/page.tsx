
"use client"

import { useState, useRef, useEffect } from "react"
import Head from "next/head"
import { SiteHeader } from "@/components/site-header"

// Interface for chat messages
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Simulate AI response with typing effect
  const getMockResponse = async (userInput: string): Promise<string> => {
    console.log("User input:", userInput) // Debug
    const lowerInput = userInput.toLowerCase()
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    if (lowerInput.includes("monastery")) {
      return "Rumtek Monastery in Sikkim is a must-visit, known for its stunning architecture and serene vibe. Open 6 AM to 6 PM, entry is ₹10. Want details on how to get there?"
    } else if (lowerInput.includes("route") || lowerInput.includes("plan")) {
      return "For a route from Gangtok to Tsomgo Lake, take NH10 for 38 km (about 1.5 hours). Best to hire a taxi or join a guided tour. Need a full itinerary?"
    } else if (lowerInput.includes("food") || lowerInput.includes("local")) {
      return "Try momos and thukpa at Taste of Tibet in Gangtok! Avg cost: ₹150-200 per person. Want more restaurant suggestions?"
    } else {
      return "I can help with travel plans, monastery facts, or local food in Sikkim. Try asking about 'monasteries,' 'routes,' or 'food' for specific info!"
    }
  }

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return
    setIsLoading(true)

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate typing effect for assistant response
    const response = await getMockResponse(newMessage.content)
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: "", // Start empty for typing effect
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, assistantMessage])

    // Simulate typing by adding characters gradually
    let currentText = ""
    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30)) // Adjust speed (30ms per char)
      currentText += response[i]
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, content: currentText } : msg
        )
      )
    }

    console.log("Assistant response:", response) // Debug
    setIsLoading(false)
  }

  // Handle quick reply buttons
  const handleQuickReply = async (query: string) => {
    setInput(query)
    await handleSend()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend()
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    setMessages([])
    console.log("Chat history cleared") // Debug
    inputRef.current?.focus()
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
          Chat with our AI to explore monasteries, plan travel routes, or discover local food in Sikkim.
        </p>
        <div className="mt-6 rounded-xl border bg-gradient-to-br from-emerald-50 to-indigo-50 p-6 shadow-sm">
          {/* Chat container */}
          <div
            className="flex h-[500px] flex-col rounded-lg border bg-white shadow-md"
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
                    Start chatting about travel plans, monasteries, or local food!
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
                          : "bg-indigo-100 text-foreground"
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
                  <div className="max-w-[70%] rounded-lg bg-indigo-100 p-3 flex items-center gap-2">
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
            {/* Input area */}
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