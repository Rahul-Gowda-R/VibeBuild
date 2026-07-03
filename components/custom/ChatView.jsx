"use client";

import React, { useState, useEffect, useContext } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { ArrowRight, Link, Loader2Icon, Send } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const updateMessages = useMutation(api.workspace.UpdateWorkspace);

  // Load workspace messages
  useEffect(() => {
    if (id) fetchWorkspaceMessages();
  }, [id]);

  const fetchWorkspaceMessages = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setMessages(result?.messages || []);
    } catch (error) {
      console.error("Error fetching workspace messages:", error);
    }
  };

  // Trigger AI response when last message is from user
  useEffect(() => {
    if (!messages?.length || isGenerating) return;
  
    const lastMessage = messages[messages.length - 1];
  
    if (lastMessage.role === "user") {
      generateAiResponse(lastMessage.content);
    }
  }, [messages]);

  const generateAiResponse = async (userPrompt) => {
    if (isGenerating) return;
  
    setIsGenerating(true);
    setLoading(true);
  
    try {
      const prompt = `
  ${Prompt.CHAT_PROMPT}
  
  User Request:
  ${userPrompt}
  `;
  
      const result = await axios.post("/api/ai-chat", {
        prompt,
      });
  
      const aiMessage = {
        role: "ai",
        content: result.data?.result || "No response received.",
      };
  
      const updatedMessages = [...messages, aiMessage];
  
      setMessages(updatedMessages);
  
      if (id) {
        await updateMessages({
          workspaceId: id,
          messages: updatedMessages,
        });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim() || loading || isGenerating) return;
  
    const userMessage = {
      role: "user",
      content: userInput.trim(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col bg-gray-900">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.role === "user"
                    ? "bg-gray-800/50 border border-gray-700"
                    : "bg-gray-800/30 border border-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {msg.role === "user" ? "You" : "AI"}
                  </div>
                  <ReactMarkdown className="prose prose-invert flex-1 overflow-auto">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

          {loading && (
            <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2Icon className="animate-spin h-5 w-5" />
                <p className="font-medium">Generating response...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
            <textarea
              placeholder="Type your message here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 transition-all duration-200"
            />
            <div className="flex justify-between items-center">
              <div />
              <button
                onClick={handleSend}
                disabled={!userInput?.trim()}
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-4 py-2 transition-all duration-200 disabled:opacity-50"
              >
                <Send className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
