import React from 'react';
import { TopHeader } from './TopHeader';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar = () => {} }) => {
  return <TopHeader onToggleSidebar={onToggleSidebar} />;
};
