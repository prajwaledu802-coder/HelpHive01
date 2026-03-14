import { motion } from 'framer-motion';
import { Bot, Send, User } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'admin', name: 'HelpHive Admin', text: 'Welcome to HelpHive! Your volunteer registration has been approved.', time: '10:00 AM' },
  { id: 2, sender: 'admin', name: 'HelpHive Admin', text: 'You have been assigned to the Flood Relief Camp in Assam. Please confirm your availability.', time: '10:15 AM' },
  { id: 3, sender: 'volunteer', name: 'You', text: 'Thank you! I confirm my availability for the Assam relief camp.', time: '10:20 AM' },
  { id: 4, sender: 'admin', name: 'HelpHive Admin', text: 'Great! Your deployment details: Report to Guwahati Base Camp by March 15, 6:00 AM. Travel kit will be provided.', time: '10:25 AM' },
  { id: 5, sender: 'volunteer', name: 'You', text: 'Understood. Is there anything I should prepare beforehand?', time: '10:30 AM' },
  { id: 6, sender: 'admin', name: 'HelpHive Admin', text: 'Please complete the First Aid training module in your profile before March 14. Also carry your ID proof and any medical certifications.', time: '10:35 AM' },
];

const VolunteerChatbotPage = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now(),
      sender: 'volunteer',
      name: 'You',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, userMsg]);
    setInput('');

    // Simulate admin auto-response
    setTimeout(() => {
      const responses = [
        'Thank you for your message! An admin will respond shortly.',
        'Your request has been noted. We\'ll get back to you within 24 hours.',
        'Got it! Check the Activity Log for updates on your assignments.',
        'Thanks for reaching out. Please visit the Events page for upcoming opportunities.',
      ];
      const botMsg = {
        id: Date.now() + 1,
        sender: 'admin',
        name: 'HelpHive Bot',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="flex h-[calc(100vh-130px)] flex-col pb-4">
      <PageHeader title="Messages" subtitle="Chat with admins and the HelpHive support bot" />

      {/* Chat Window */}
      <div className="glass mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border-muted)]">
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex gap-3 ${msg.sender === 'volunteer' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.sender === 'admin'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : 'bg-gradient-to-br from-indigo-500 to-blue-600'
              }`}>
                {msg.sender === 'admin' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                msg.sender === 'admin'
                  ? 'rounded-tl-md bg-[var(--card-elevated)] border border-[var(--border-muted)]'
                  : 'rounded-tr-md bg-gradient-to-br from-emerald-600/80 to-teal-600/80 text-white'
              }`}>
                <div className="mb-0.5 flex items-center gap-2">
                  <span className={`text-[10px] font-semibold ${msg.sender === 'admin' ? 'text-emerald-400' : 'text-emerald-100'}`}>
                    {msg.name}
                  </span>
                  <span className={`text-[10px] ${msg.sender === 'admin' ? 'text-[var(--text-muted)]' : 'text-emerald-200/70'}`}>
                    {msg.time}
                  </span>
                </div>
                <p className={`text-sm ${msg.sender === 'admin' ? 'text-[var(--text-primary)]' : 'text-white'}`}>
                  {msg.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 border-t border-[var(--border-muted)] bg-[var(--bg-elevated)] p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="cursor-pointer rounded-xl p-2.5 text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3a916d, #1a6b42)' }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default VolunteerChatbotPage;
