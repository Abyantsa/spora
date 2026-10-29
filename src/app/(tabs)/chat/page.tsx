'use client';
import { useState, Suspense } from 'react';
import { useAppStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ChatContent() {
  const { state, sendMessage } = useAppStore();
  const searchParams = useSearchParams();
  const paramSession = searchParams.get('session');

  // Filter sessions that user has joined or is hosting
  const mySessions = state.sessions.filter(s => state.joined.has(s.id) || s.host === 'Kamu');

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  // Derived active session ID: user selection > query param > first available session
  const activeSessionId = selectedSessionId 
    || paramSession 
    || (mySessions.length > 0 ? mySessions[0].id : '');

  const activeSession = state.sessions.find(s => s.id === activeSessionId);
  const messages = (activeSessionId && state.chatMessages[activeSessionId]) || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;
    sendMessage(activeSessionId, inputText);
    setInputText('');
  };

  if (mySessions.length === 0) {
    return (
      <div className="bg-white rounded-[14px] p-8 sm:p-12 text-center elev-raised flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#d4e9e2] text-[#00754A] grid place-items-center text-2xl mb-1">
          💬
        </div>
        <b className="text-[#006241] text-[18px]">Belum Ada Obrolan Sesi Mabar</b>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] max-w-[46ch] leading-relaxed">
          Ruang chat otomatis terbuka begitu kamu bergabung atau membuat sesi olahraga. Masuk ke sesi mabar untuk berkoordinasi langsung dengan kawan mainmu!
        </p>
        <Link
          href="/home"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#00754A] text-white font-semibold text-[14px] hover:bg-[#005c3b] transition-all mt-2 no-underline"
        >
          Cari Sesi di Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#006241] tracking-[-0.01em]">
          Chat & Koordinasi Sesi Mabar
        </h1>
        <p className="text-[14px] text-[rgba(0,0,0,0.58)] mt-1 max-w-[65ch] leading-relaxed">
          Ruang koordinasi privat antar pemain dan Host: tentukan nomor lapangan, perlengkapan bersama, dan titik kumpul tanpa perlu sebar nomor HP.
        </p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#d6dbde] elev-raised grid grid-cols-1 md:grid-cols-[300px_1fr] h-[600px] overflow-hidden">
        
        {/* Left: Session Groups List */}
        <div className="border-r border-[#d6dbde] flex flex-col bg-[#fafaf9]">
          <div className="p-3.5 border-b border-[#d6dbde] bg-white">
            <span className="text-[12px] font-bold text-[rgba(0,0,0,0.87)] uppercase tracking-wider block">
              Grup Sesi Aktif ({mySessions.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col p-2 gap-1">
            {mySessions.map(s => {
              const isActive = s.id === activeSessionId;
              const lastMsg = state.chatMessages[s.id]?.slice(-1)[0];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSessionId(s.id)}
                  className={`flex items-start gap-3 p-3 rounded-[12px] text-left transition-all cursor-pointer border-0 ${
                    isActive
                      ? 'bg-[#d4e9e2] text-[#006241] shadow-xs'
                      : 'bg-transparent hover:bg-[#edebe9] text-[rgba(0,0,0,0.87)]'
                  }`}
                >
                  <span className="w-9 h-9 rounded-full bg-white grid place-items-center text-[18px] shrink-0 border border-[#d6dbde]">
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <b className="text-[13.5px] font-bold truncate leading-tight block">
                        {s.sport}
                      </b>
                      {lastMsg && (
                        <span className="text-[10px] text-[rgba(0,0,0,0.58)] shrink-0">
                          {lastMsg.time}
                        </span>
                      )}
                    </div>
                    <span className="text-[11.5px] text-[rgba(0,0,0,0.58)] truncate block mt-0.5">
                      {s.venue}
                    </span>
                    <span className="text-[11px] text-[rgba(0,0,0,0.87)] truncate block mt-1 font-medium">
                      {lastMsg ? `${lastMsg.user_name}: ${lastMsg.text}` : 'Belum ada pesan. Mulai obrolan!'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Message Stream */}
        {activeSession ? (
          <div className="flex flex-col h-full bg-white">
            {/* Thread Header */}
            <div className="p-3.5 sm:p-4 border-b border-[#e7e7e7] flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-full bg-[#edebe9] grid place-items-center text-[20px] shrink-0">
                  {activeSession.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] sm:text-[16px] font-bold text-[#006241] truncate leading-tight">
                      {activeSession.sport} @ {activeSession.venue}
                    </h2>
                  </div>
                  <p className="text-[12px] text-[rgba(0,0,0,0.58)] truncate">
                    {activeSession.day}, {activeSession.time} · Host: <b>{activeSession.host}</b>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#d4e9e2] text-[#006241] text-[11px] font-bold shrink-0">
                {activeSession.joined}/{activeSession.min} Pemain
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3 bg-[#faf9f6]">
              <div className="text-center my-2">
                <span className="bg-[#edebe9] text-[rgba(0,0,0,0.58)] text-[11px] font-semibold px-3 py-1 rounded-full">
                  🛡️ Chat Koordinasi Resmi SPORA — Hormati sesama rekan mabar
                </span>
              </div>

              {messages.map(m => {
                const isMe = m.user_name === 'Kamu' || (state.user?.email && m.user_name === state.user.email.split('@')[0]);
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                      <span className="font-bold text-[rgba(0,0,0,0.87)]">{m.user_name}</span>
                      {m.is_host && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#006241] text-white font-semibold text-[9.5px]">
                          Host
                        </span>
                      )}
                      <span className="text-[rgba(0,0,0,0.45)] text-[10px]">{m.time}</span>
                    </div>

                    <div
                      className={`p-3 rounded-[14px] text-[13.5px] leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#00754A] text-white rounded-tr-xs'
                          : 'bg-white border border-[#d6dbde] text-[rgba(0,0,0,0.87)] rounded-tl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-3.5 border-t border-[#e7e7e7] bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Ketik pesan koordinasi lapangan..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#d6dbde] bg-[#edebe9] text-[14px] outline-none focus:bg-white focus:border-[#00754A] transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#00754A] hover:bg-[#005c3b] text-white grid place-items-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-[#006241] font-bold">Memuat Obrolan...</div>}>
      <ChatContent />
    </Suspense>
  );
}
