import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface SectionProps {
  notificationsSettings: {
    showNotifications: boolean;
    playSound: boolean;
  };
  setNotificationsSettings: (settings: { showNotifications: boolean; playSound: boolean }) => void;
}

const SettingsNotificationSection: React.FC<SectionProps> = (props) => {
  return (
    <div>
      <div className='my-2 flex items-center gap-2'>
        <Switch.Root
          defaultChecked={props.notificationsSettings.showNotifications}
          onCheckedChange={(val) =>
            props.setNotificationsSettings({
              ...props.notificationsSettings,
              showNotifications: val,
            })
          }
          className='w-[42px] h-[25px] rounded-full relative dark:bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default'
        >
          <Switch.Thumb className='block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <h1>Show notifications</h1>
      </div>
      <div className='my-2 flex items-center gap-2'>
        <Switch.Root
          defaultChecked={props.notificationsSettings.playSound}
          onCheckedChange={(val) =>
            props.setNotificationsSettings({
              ...props.notificationsSettings,
              playSound: val,
            })
          }
          className='w-[42px] h-[25px] rounded-full relative dark:bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default'
        >
          <Switch.Thumb className='block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <h1>Play notification sound</h1>
      </div>
    </div>
  );
};

export default SettingsNotificationSection;
