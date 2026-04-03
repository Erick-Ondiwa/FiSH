import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Send, ArrowLeft, MoreVertical, Paperclip, Smile } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { API_URL } from "../../../../../api";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // Grab the passed data from SupplierCard

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Initialize partner using the passed state for an "instant" UI feel
  const [partner, setPartner] = useState(state ? {
    name: state.partnerName,
    profile_image: state.partnerAvatar
  } : null);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("access_token");
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/advisory/${conversationId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      
      // Update partner info from real server data if it wasn't in state
      if (res.data.length > 0) {
        const otherUser = res.data.find(m => m.sender?.id !== currentUserId);
        if (otherUser) setPartner(otherUser.sender);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: input,
      sender: { id: currentUserId },
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    const tempInput = input;
    setInput("");

    try {
      await axios.post(
        `${API_URL}/advisory/${conversationId}/send/`,
        { content: tempInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to send", err);
      setMessages(messages.filter(m => m.id !== newMessage.id));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* --- MODERN HEADER --- */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              {partner?.profile_image ? (
                <img 
                  src={partner.profile_image} 
                  alt="" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                  {partner?.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                {partner?.name || "Loading..."}
              </h2>
              <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider mt-1">
                Online
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* --- MESSAGES AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        <div className="flex justify-center my-4">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100/50 px-3 py-1 rounded-full uppercase tracking-tighter">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender?.id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!isMe && (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center mb-1 overflow-hidden">
                   {partner?.profile_image ? (
                     <img src={partner.profile_image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     msg.sender?.name?.charAt(0)
                   )}
                </div>
              )}
              <div className={`group relative max-w-[75%] md:max-w-md px-4 py-2.5 rounded-2xl transition-all
                  ${isMe 
                    ? "bg-slate-900 text-white rounded-tr-none shadow-md shadow-slate-200" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm"}
                `}>
                <p className="text-[14px] leading-relaxed font-normal">{msg.content}</p>
                <p className={`text-[9px] mt-1 font-medium ${isMe ? "text-slate-400" : "text-slate-500"} text-right`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* --- FLOATING INPUT BAR --- */}
      <footer className="p-4 bg-transparent">
        <form 
          onSubmit={sendMessage}
          className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-200 p-2 rounded-2xl shadow-xl shadow-slate-200/40"
        >
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Paperclip size={20} />
          </button>
          
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 placeholder:text-slate-400"
          />

          <button type="button" className="p-2 text-slate-400 hover:text-yellow-500 transition-colors hidden sm:block">
            <Smile size={20} />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl transition-all shadow-lg ${
              input.trim() 
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200" 
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;