import React from 'react';

import * as Select from '@radix-ui/react-select';

import { FaChevronCircleDown } from 'react-icons/fa';

interface SectionProps {
  generalSettings: {
    theme: string;
    language: string;
  };
  setGeneralSettings: (settings: { theme: string; language: string }) => void;
  page: React.RefObject<HTMLDivElement>;
}

const SettingsGeneralSection: React.FC<SectionProps> = (props) => {
  return (
    <div className='grid grid-cols-2'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl'>Theme</h1>

        <Select.Root
          value={props.generalSettings.theme}
          onValueChange={(val) => {
            props.setGeneralSettings({
              ...props.generalSettings,
              theme: val,
            });
          }}
        >
          <Select.Trigger className='flex w-7/12 justify-between rounded-md bg-slate-200 p-2 dark:bg-gray-800'>
            <Select.Value placeholder='Select a theme' />
            <Select.Icon className='ml-2'>
              <FaChevronCircleDown />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal container={props.page.current!}>
            <Select.Content
              side='bottom'
              align='end'
              className='z-50 rounded-md bg-slate-200 p-2 text-slate-700 shadow-md outline-none dark:bg-gray-800 dark:text-white'
            >
              <Select.Viewport className='flex flex-col gap-2'>
                <Select.Item
                  value='light'
                  className='hover:dark:bg-gray-700 p-2 rounded-md transition-all cursor-pointer data-[state=checked]:bg-blue-400 outline-none'
                >
                  <Select.ItemText>Light Theme</Select.ItemText>
                </Select.Item>
                <Select.Item
                  value='dark'
                  className='data-[state=checked]:bg-blue-400 hover:dark:bg-gray-700 p-2 rounded-md transition-all cursor-pointer outline-none'
                >
                  <Select.ItemText>Dark Theme</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl'>Language</h1>

        <Select.Root
          value={props.generalSettings.language}
          onValueChange={() => {
            props.setGeneralSettings({
              ...props.generalSettings,
            });
          }}
        >
          <Select.Trigger className='flex w-7/12 justify-between rounded-md bg-slate-200 p-2 dark:bg-gray-800'>
            <Select.Value placeholder='Select a language' />
            <Select.Icon className='ml-2'>
              <FaChevronCircleDown className='dark:text-white text-slate-700 inline-block' />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal container={props.page.current!}>
            <Select.Content
              side='bottom'
              align='end'
              className='z-50 w-full rounded-md bg-slate-200 p-2 text-slate-700 shadow-md outline-none dark:bg-gray-800 dark:text-white'
            >
              <Select.Viewport className='flex flex-col gap-2'>
                <Select.Item
                  value='en'
                  className='hover:dark:bg-gray-700 p-2 rounded-md transition-all cursor-pointer data-[state=checked]:bg-blue-400 outline-none'
                >
                  <Select.ItemText>English</Select.ItemText>
                </Select.Item>
                <Select.Item
                  value='es'
                  className='data-[state=checked]:bg-blue-400 dark:hover:bg-gray-700 p-2 rounded-md transition-all cursor-pointer outline-none'
                >
                  <Select.ItemText>Spanish</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};

export default SettingsGeneralSection;
