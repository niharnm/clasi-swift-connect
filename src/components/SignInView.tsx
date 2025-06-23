
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface SignInViewProps {
  onSignIn: () => void;
  isLoading: boolean;
  error?: string;
}

const SignInView: React.FC<SignInViewProps> = ({ onSignIn, isLoading, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clasi</h1>
          <p className="text-gray-600 dark:text-gray-300">Your all-in-one Classroom companion</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onSignIn}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SignInView;
