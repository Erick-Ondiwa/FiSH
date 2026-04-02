import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, MapPin, Phone, CheckCircle2 } from "lucide-react"; 
import { API_URL } from "../../../../../api";

const SupplierCard = ({ supplier, onViewProfile }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleStartChat = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    setIsConnecting(true);
    try {
      const res = await axios.post(`${API_URL}/advisory/start/`, 
        { user_id: supplier.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // We pass the supplier info in the 'state' object.
      // This allows ChatPage to show the name/avatar instantly.
      navigate(`/chat/${res.data.conversation_id}`, { 
        state: { 
          partnerName: supplier.name, 
          partnerAvatar: supplier.profile_image 
        } 
      });
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Could not start a conversation. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
      
      {/* Verification Badge */}
      {supplier.is_verified && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle2 size={12} /> Verified
        </div>
      )}

      {/* Header Info */}
      <div className="flex gap-4 mb-4">
        <div className="relative">
          <img
            src={supplier.profile_image || "/default-avatar.png"}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-50 bg-slate-100"
            alt={supplier.name}
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {supplier.name}
          </h3>
          <p className="text-sm font-medium text-blue-500 bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1">
            {supplier.supplier_type?.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={16} className="text-slate-400" />
          <span>{supplier.county}{supplier.subcounty && `, ${supplier.subcounty}`}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Phone size={16} className="text-slate-400" />
          <span>{supplier.contact_phone}</span>
        </div>
      </div>

      {/* Species Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {supplier.fish_species?.slice(0, 3).map((s, i) => (
          <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
            {typeof s === 'string' ? s : s.name}
          </span>
        ))}
        {supplier.fish_species?.length > 3 && (
          <span className="text-[11px] text-slate-400 self-center">
            +{supplier.fish_species.length - 3} more
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onViewProfile(supplier)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={handleStartChat}
          disabled={isConnecting}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 disabled:opacity-70 transition-all shadow-sm active:scale-95"
        >
          <MessageSquare size={16} /> {isConnecting ? "Connecting..." : "Chat"}
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;