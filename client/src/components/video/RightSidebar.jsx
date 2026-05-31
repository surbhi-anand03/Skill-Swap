import { useState } from "react";

export default function RightSidebar() {

  const [tab, setTab] =
    useState("participants");

  return (
    <div className="w-[320px] bg-white border-l shadow-sm flex flex-col">

      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold">
          Session Panel
        </h2>
      </div>

      <div className="flex border-b">

        <button
          onClick={() =>
            setTab("participants")
          }
          className={`flex-1 p-4 ${
            tab === "participants"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Participants
        </button>

        <button
          onClick={() =>
            setTab("chat")
          }
          className={`flex-1 p-4 ${
            tab === "chat"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Chat
        </button>

        <button
          onClick={() =>
            setTab("notes")
          }
          className={`flex-1 p-4 ${
            tab === "notes"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Notes
        </button>

      </div>

      <div className="flex-1 p-5 overflow-y-auto">

        {tab === "participants" && (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-xl p-4">
              You
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              Participant
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div className="text-gray-500">
            Chat UI coming next
          </div>
        )}

        {tab === "notes" && (
          <textarea
            placeholder="Write notes..."
            className="w-full h-full border rounded-xl p-4 resize-none outline-none"
          />
        )}

      </div>
    </div>
  );
}