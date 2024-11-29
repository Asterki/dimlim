import { Message } from "../../../../../shared/types/models";

interface ComponentProps {
  message: Message;
  userID: string;
}

const MessageComponent: React.FC<ComponentProps> = (props) => {
  return (
    <div className={`p-2 rounded-lg ${props.message.senderId === props.userID ? 'bg-blue-500' : 'bg-gray-800'}`}>
      <div>{props.message.content}</div>
      <div className='text-sm text-white/50'>{new Date(props.message.createdAt).toLocaleTimeString()}</div>
    </div>
  );
};

export default MessageComponent;
