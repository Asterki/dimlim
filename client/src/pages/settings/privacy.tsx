import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface SectionProps {
  privacySettings: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    showReadReceipts: boolean;
  };
  setPrivacySettings: (settings: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    showReadReceipts: boolean;
  }) => void;
}

const SettingsPrivacySection: React.FC<SectionProps> = (props) => {
  return (
    <div>
      <div className='my-2 flex items-center gap-2'>
        <Switch.Root
          defaultChecked={props.privacySettings.showOnlineStatus}
          onCheckedChange={(val) =>
            props.setPrivacySettings({
              ...props.privacySettings,
              showOnlineStatus: val,
            })
          }
          className='w-[42px] h-[25px] rounded-full relative dark:bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default'
        >
          <Switch.Thumb className='block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <h1>Show online status</h1>
      </div>
      <div className='my-2 flex items-center gap-2'>
        <Switch.Root
          defaultChecked={props.privacySettings.showLastSeen}
          onCheckedChange={(val) =>
            props.setPrivacySettings({
              ...props.privacySettings,
              showLastSeen: val,
            })
          }
          className='w-[42px] h-[25px] rounded-full relative dark:bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default'
        >
          <Switch.Thumb className='block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <h1>Show last seen</h1>
      </div>
      <div className='my-2 flex items-center gap-2'>
        <Switch.Root
          defaultChecked={props.privacySettings.showReadReceipts}
          onCheckedChange={(val) =>
            props.setPrivacySettings({
              ...props.privacySettings,
              showReadReceipts: val,
            })
          }
          className='w-[42px] h-[25px] rounded-full relative dark:bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default'
        >
          <Switch.Thumb className='block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <h1>Show read receipts</h1>
      </div>
    </div>
  );
};

export default SettingsPrivacySection;
