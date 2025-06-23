
import { Course } from '@/types/Course';

export class ClassroomAPI {
  private static instance: ClassroomAPI;
  
  static getInstance(): ClassroomAPI {
    if (!ClassroomAPI.instance) {
      ClassroomAPI.instance = new ClassroomAPI();
    }
    return ClassroomAPI.instance;
  }

  async fetchCourses(): Promise<Course[]> {
    try {
      // In a real implementation, this would call the Google Classroom API
      // For demo purposes, we'll return mock data
      console.log('Fetching courses from Google Classroom API...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock course data
      const mockCourses: Course[] = [
        {
          id: '1',
          name: 'Advanced Mathematics',
          section: 'Period 3',
          description: 'Calculus and advanced mathematical concepts for senior students.'
        },
        {
          id: '2',
          name: 'English Literature',
          section: 'Period 1',
          description: 'Exploring classic and contemporary literature through critical analysis.'
        },
        {
          id: '3',
          name: 'Computer Science',
          section: 'Period 5',
          description: 'Introduction to programming concepts and software development.'
        },
        {
          id: '4',
          name: 'Biology',
          section: 'Period 2',
          description: 'Study of living organisms and their interactions with the environment.'
        }
      ];
      
      return mockCourses;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw new Error('Failed to fetch courses from Google Classroom');
    }
  }

  async fetchCourseDetails(courseId: string): Promise<Course | null> {
    try {
      console.log(`Fetching details for course ${courseId}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const courses = await this.fetchCourses();
      return courses.find(course => course.id === courseId) || null;
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      return null;
    }
  }
}
