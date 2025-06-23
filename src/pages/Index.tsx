
import React, { useState, useEffect } from 'react';
import SignInView from '@/components/SignInView';
import MenuView from '@/components/MenuView';
import CoursesList from '@/components/CoursesList';
import CourseDetailView from '@/components/CourseDetailView';
import ChatView from '@/components/ChatView';
import { AuthService } from '@/services/auth';
import { ClassroomAPI } from '@/services/classroomApi';
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const authService = AuthService.getInstance();
  const classroomAPI = ClassroomAPI.getInstance();
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
      console.log('Starting sign-in process...');
      const success = await authService.signInWithGoogle();
      
      if (success) {
        console.log('Sign-in successful, updating UI...');
        setIsAuthenticated(true);
        setCurrentView('menu');
        toast.success('Successfully signed in!');
      } else {
        console.error('Sign-in failed');
        setAuthError('Failed to sign in. Please try again.');
        toast.error('Sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('An error occurred during sign in. Please check your internet connection and try again.');
      toast.error('Sign-in error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setIsAuthenticated(false);
    setCurrentView('signin');
    setSelectedCourse(null);
    setCourses([]);
    setIsMenuOpen(false);
    toast.success('Successfully signed out!');
  };

  const handleViewCourses = async () => {
    setCurrentView('courses');
    setIsMenuOpen(false);
    await loadCourses();
  };

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const fetchedCourses = await classroomAPI.fetchCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const handleOpenChat = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
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

  const handleRefreshCourses = async () => {
    await loadCourses();
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
                  View Your Google Classroom Courses
                </button>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <CoursesList
            courses={courses}
            onCourseSelect={handleCourseSelect}
            onBack={handleBackToMenu}
            onRefresh={handleRefreshCourses}
            isLoading={isLoadingCourses}
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
