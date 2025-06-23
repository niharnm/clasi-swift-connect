
import React, { useState, useEffect } from 'react';
import SignInView from '@/components/SignInView';
import MenuView from '@/components/MenuView';
import CoursesList from '@/components/CoursesList';
import CourseDetailView from '@/components/CourseDetailView';
import ChatView from '@/components/ChatView';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';

type ViewType = 'signin' | 'menu' | 'courses' | 'course-detail' | 'chat';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string>('');

  const authService = AuthService.getInstance();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentView('menu');
    }
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const success = await authService.signInWithGoogle();
      if (success) {
        setIsAuthenticated(true);
        setCurrentView('menu');
        toast.success('Successfully signed in!');
      } else {
        setAuthError('Failed to sign in. Please try again.');
      }
    } catch (error) {
      setAuthError('An error occurred during sign in.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setIsAuthenticated(false);
    setCurrentView('signin');
    setSelectedCourseId(null);
    toast.success('Successfully signed out!');
  };

  const handleViewCourses = () => {
    setCurrentView('courses');
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-detail');
  };

  const handleOpenChat = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('chat');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCourseId(null);
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signin':
        return (
          <SignInView
            onSignIn={handleSignIn}
            isLoading={isLoading}
            error={authError}
          />
        );
      case 'menu':
        return (
          <MenuView
            onViewCourses={handleViewCourses}
            onSignOut={handleSignOut}
          />
        );
      case 'courses':
        return (
          <CoursesList
            onCourseSelect={handleCourseSelect}
            onBack={handleBackToMenu}
          />
        );
      case 'course-detail':
        return selectedCourseId ? (
          <CourseDetailView
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
            onOpenChat={handleOpenChat}
          />
        ) : null;
      case 'chat':
        return selectedCourseId ? (
          <ChatView
            courseId={selectedCourseId}
            onBack={() => setCurrentView('course-detail')}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
