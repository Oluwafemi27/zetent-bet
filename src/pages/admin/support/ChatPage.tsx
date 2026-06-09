import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { MessageSquare, Send } from "lucide-react";

const ChatPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadTickets = async () => {
    const { data } = await supabase.from("support_tickets").select("*, profiles:user_id(full_name, email)").eq("status", "in_progress").order("updated_at", { ascending: false });
    setTickets(data || []);
  };

  const loadMessages = async (ticketId: string) => {
    const { data } = await supabase.from("live_chat").select("*, profiles:sender_id(full_name, email)").eq("ticket_id", ticketId).order("created_at", { ascending: true });
    setMessages(data || []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => { loadTickets(); }, []);

  useEffect(() => {
    if (!selectedTicket) return;
    loadMessages(selectedTicket.id);
    const c = supabase.channel("chat-" + selectedTicket.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "live_chat", filter: `ticket_id=eq.${selectedTicket.id}` }, () => loadMessages(selectedTicket.id)).subscribe();
    return () => { supabase.removeChannel(c); };
  }, [selectedTicket]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("live_chat").insert({ ticket_id: selectedTicket.id, sender_id: user?.id, message: newMessage, is_admin: true });
      setNewMessage("");
    } catch (err: any) { toast({ title: "Error sending message", description: err.message, variant: "destructive" }); }
    finally { setSending(false); }
  };

  return (
    <AdminPageShell title="Live Chat" description="Real-time support conversations with users.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        <Card className="border border-border/50 overflow-hidden">
          <CardHeader className="pb-3 border-b"><CardTitle className="text-sm font-bold">Active Chats ({tickets.length})</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-y-auto h-[520px]">
            {tickets.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm"><MessageSquare className="h-8 w-8 mx-auto opacity-20 mb-2" /><p>No active chats</p></div> :
              tickets.map(t => (
                <div key={t.id} className={`p-4 cursor-pointer border-b hover:bg-primary/5 transition-colors ${selectedTicket?.id === t.id ? "bg-primary/10 border-l-2 border-l-primary" : ""}`} onClick={() => setSelectedTicket(t)}>
                  <p className="font-medium text-sm">{t.profiles?.full_name || t.profiles?.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="border border-border/50 overflow-hidden md:col-span-2">
          {selectedTicket ? (
            <>
              <CardHeader className="pb-3 border-b"><CardTitle className="text-sm font-bold">{selectedTicket.subject} — {selectedTicket.profiles?.full_name || selectedTicket.profiles?.email}</CardTitle></CardHeader>
              <CardContent className="p-0 flex flex-col h-[520px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.is_admin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs rounded-lg px-4 py-2 text-sm ${m.is_admin ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                        <p>{m.message}</p>
                        <p className={`text-xs mt-1 ${m.is_admin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <Button onClick={sendMessage} disabled={sending}><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full text-muted-foreground"><div className="text-center"><MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-3" /><p>Select a chat to start</p></div></CardContent>
          )}
        </Card>
      </div>
    </AdminPageShell>
  );
};
export default ChatPage;
