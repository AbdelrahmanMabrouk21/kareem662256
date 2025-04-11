import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "./components/ui/toaster";
import { FormEvent, useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">الدردشة</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">الدردشة</h1>
        <Authenticated>
          <ChatRoom />
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">سجل دخول للبدء</p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}

function ChatRoom() {
  const messages = useQuery(api.messages.list) ?? [];
  const sendMessage = useMutation(api.messages.send);
  const [newMessage, setNewMessage] = useState("");

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage({ content: newMessage });
    setNewMessage("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[60vh] overflow-y-auto border rounded-lg p-4 flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message._id} className="flex flex-col">
            <span className="text-sm text-gray-500">{message.email}</span>
            <p className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
              {message.content}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="اكتب رسالة..."
          dir="rtl"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
          disabled={!newMessage.trim()}
        >
          إرسال
        </button>
      </form>
    </div>
  );
}
