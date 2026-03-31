"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs text-[#8b8fa8] ml-2">AI is analyzing...</span>
    </div>
  );
}
