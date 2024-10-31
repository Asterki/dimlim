// components/PageLayout.tsx
import React from 'react';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import NotificationComponent from '../components/NotificationComponent';
import PopUpLogin from '../components/PopUpLoginComponent';

import { useAuth } from '../features/auth';

interface LayoutProps {
  children: React.ReactNode;
  requiresLogin?: boolean;
  className?: string;
  notification?: {
    title: string;
    content: string;
    state: 'showing' | 'hidden';
    type: 'error' | 'success' | 'info' | 'warning';
  };
}

const PageLayout: React.FC<LayoutProps> = ({ children, requiresLogin = false, notification, className }) => {
  const { user } = useAuth();

  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <NavbarComponent user={user} />

      {notification && (
        <NotificationComponent
          content={notification.content}
          title={notification.title}
          state={notification.state}
          type={notification.type}
        />
      )}

      <main className='flex-grow'>{children}</main>

      <FooterComponent />

      {requiresLogin && !user && <PopUpLogin />}
    </div>
  );
};

export default PageLayout;