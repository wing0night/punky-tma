"use client";

import Image from "next/image";
import ChatBoxUI from "@/assets/ui/chatbox.svg";
import PlayIcon from "@/assets/icons/play.svg";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/lib/chat";
import Message from "@/components/MainUI/message";
import {getChatResponse, getGaiaNetResponse} from "@/app/api/chat";
import LoadingAnimation from "@/components/loadingAnimation"; // 假设您有一个加载动画组件

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const content = currentMessage.trim();
      setMessages([...messages, { role: "user", content: content }]);
      setCurrentMessage("");
      setIsLoading(true);
      getGaiaNetResponse(content).then((reply) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: reply },
        ]);
        setIsLoading(false);
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log("touch");
    e.preventDefault();
    handleSendMessage();
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative w-full">
      {/** the message list is displayed here */}
      <div
        ref={messageListRef}
        className="absolute min-h-60 -translate-y-full w-full h-full overflow-y-auto p-3 bg-black bg-opacity-35"
      >
        {messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3 max-w-[80%] mr-auto mb-2">
            <LoadingAnimation />
          </div>
        )}
      </div>
      <div className="w-full flex flex-row pt-2">
        <div className="relative grow">
          <Image className="w-full" src={ChatBoxUI} alt="" />
          <input
            type="text"
            className="absolute -top-0.5 left-3 w-11/12 h-full bg-transparent text-black border-none outline-none"
            placeholder="Type your message here..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
        </div>
        <button
          className="ml-2 cursor-pointer z-50"
          onClick={handleSendMessage}
          onTouchStart={handleTouchStart}
        >
          <Image src={PlayIcon} alt="" />
        </button>
      </div>
    </div>
  );
}
