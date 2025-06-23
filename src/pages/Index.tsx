
import React, { useState, useEffect } from 'react';
import SignInView from '@/components/SignInView';
import MenuView from '@/components/MenuView';
import CoursesList from '@/components/CoursesList';
import CourseDetailView from '@/components/CourseDetailView';
import ChatView from '@/components/ChatView';
import { AuthService } from '@/services/auth';
import { ChatService } from '@/services/chatService';
import { Course } from '@/types/Course';
import { ChatMessage } from '@/types/ChatMessage';
import { toast } from 'sonner';

type ViewType = 'signin' | 'menu' | 'courses' | 'course-detail' | 'chat';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState('john.doe@example.com');

  // Mock courses data
  const mockCourses: Course[] = [
    {
      id: 'course-1',
      name: 'Mathematics 101',
      section: 'Section A',
      description: 'Introduction to basic mathematics concepts',
      teacherProfile: {
        name: 'Dr. Smith',
        emailAddress: 'dr.smith@school.edu'
      }
    },
    {
      id: 'course-2',
      name: 'English Literature',
      section: 'Section B',
      description: 'Exploring classic and modern literature',
      teacherProfile: {
        name: 'Prof. Johnson',
        emailAddress: 'prof.johnson@school.edu'
      }
    }
  ];

  const authService = AuthService.getInstance();
  const chatService = ChatService.getInstance();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentView('menu');
    }
  }, []);

  useEffect(() => {
    // Subscribe to chat messages when a course is selected
    if (selectedCourse && currentView === 'chat') {
      const unsubscribe = chatService.subscribeToMessages(selectedCourse.id, (courseMessages) => {
        setMessages(courseMessages);
      });
      return unsubscribe;
    }
  }, [selectedCourse, currentView]);

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
    setSelectedCourse(null);
    setIsMenuOpen(false);
    toast.success('Successfully signed out!');
  };

  const handleViewCourses = () => {
    setCurrentView('courses');
    setIsMenuOpen(false);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const handleOpenChat = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCurrentView('chat');
    }
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCourse(null);
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSendMessage = async (text: string) => {
    if (selectedCourse) {
      try {
        await chatService.sendMessage(selectedCourse.id, text, currentUser);
      } catch (error) {
        toast.error('Failed to send message');
        console.error('Failed to send message:', error);
      }
    }
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
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-foreground">Clasi</h1>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 hover:bg-accent rounded-full"
                >
                  ☰
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleViewCourses}
                  className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Courses
                </button>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <CoursesList
            onCourseSelect={handleCourseSelect}
            onBack={handleBackToMenu}
          />
        );
      case 'course-detail':
        return selectedCourse ? (
          <CourseDetailView
            course={selectedCourse}
            onBack={handleBackToCourses}
            onOpenChat={handleOpenChat}
          />
        ) : null;
      case 'chat':
        return selectedCourse ? (
          <ChatView
            courseId={selectedCourse.id}
            courseName={selectedCourse.name}
            messages={messages}
            onBack={() => setCurrentView('course-detail')}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      <MenuView
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default Index;
