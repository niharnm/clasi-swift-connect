
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Moon, 
  Sun, 
  Heart, 
  Bug, 
  LogOut, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';

interface MenuViewProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
}

const MenuView: React.FC<MenuViewProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  onToggleDarkMode, 
  onSignOut 
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: isDarkMode ? Sun : Moon,
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: onToggleDarkMode,
      color: 'text-blue-500'
    },
    {
      icon: Heart,
      label: 'Donate',
      onClick: () => console.log('Donate clicked'),
      color: 'text-red-500'
    },
    {
      icon: Bug,
      label: 'Report Bug',
      onClick: () => console.log('Report bug clicked'),
      color: 'text-orange-500'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
      color: 'text-gray-500'
    },
    {
      icon: HelpCircle,
      label: 'Help & FAQ',
      onClick: () => console.log('Help clicked'),
      color: 'text-green-500'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <Card className="w-80 h-full rounded-none rounded-r-lg bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Clasi Settings</p>
          </div>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              onClick={item.onClick}
              variant="ghost"
              className="w-full justify-start p-4 h-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
              <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onSignOut}
            variant="ghost"
            className="w-full justify-start p-4 h-auto rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </Card>
      
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default MenuView;
