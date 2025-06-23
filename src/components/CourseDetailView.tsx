
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, Bell, FileText, BarChart3 } from 'lucide-react';
import { Course } from '@/types/Course';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onOpenChat: (courseId: string) => void;
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ 
  course, 
  onBack, 
  onOpenChat 
}) => {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {course.name}
          </h1>
          {course.section && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {course.section}
            </p>
          )}
        </div>
        <Button 
          onClick={() => onOpenChat(course.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>

      {course.description && (
        <Card className="p-4">
          <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Announcements</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grades</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="mt-4">
          <Card className="p-6 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Announcements from your teacher will appear here
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-4">
          <Card className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No assignments yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Course assignments will be displayed here
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="grades" className="mt-4">
          <Card className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Grades coming soon
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Grade tracking will be available in a future update
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetailView;
