import { Message } from "../../../../../shared/types/models";

import { FaCheck, FaEye, FaPaperPlane, FaClock, FaTimes } from "react-icons/fa";

interface ComponentProps {
  message: Message;
  userID: string;
  messageStatus: "sent" | "delivered" | "read" | "waiting" | "error";
}

const MessageComponent: React.FC<ComponentProps> = (props) => {
  let icon = <FaPaperPlane />
  
  switch (props.messageStatus) {
    case "sent":
      icon = <FaPaperPlane />;
      break;
    case "delivered":
      icon = <FaCheck />;
      break;
    case "read":
      icon = <FaEye />;
      break
    case "waiting":
      icon = <FaClock />;
      break;
    case "error":
      icon = <FaTimes />;
      break;
  }

  return (
    <div className={`p-2 rounded-lg ${props.message.senderId === props.userID ? 'bg-blue-500' : 'bg-gray-800'}`}>
      <div>{props.message.content}</div>
      <div className='text-sm text-white/50 flex items-center justify-start gap-[2px]'>{icon} {new Date(props.message.createdAt).toLocaleTimeString()}</div>
    </div>
  );
};

export default MessageComponent;
