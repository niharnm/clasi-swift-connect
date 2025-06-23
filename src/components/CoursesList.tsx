
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageCircle, ArrowLeft } from 'lucide-react';
import { Course } from '@/types/Course';

interface CoursesListProps {
  courses?: Course[];
  onCourseSelect: (course: Course) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ 
  courses = [], 
  onCourseSelect, 
  onRefresh, 
  isLoading = false,
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Courses</h1>
            {onRefresh && (
              <Button 
                onClick={onRefresh}
                variant="outline"
                disabled={isLoading}
                className="rounded-full"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            )}
          </div>
          
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onCourseSelect(course)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {course.name}
                      </h3>
                    </div>
                    
                    {course.section && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        Section: {course.section}
                      </p>
                    )}
                    
                    {course.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {courses.length === 0 && !isLoading && (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Make sure you have access to Google Classroom courses
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
