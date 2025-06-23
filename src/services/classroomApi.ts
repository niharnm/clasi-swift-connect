
import { Course } from '@/types/Course';
import { AuthService } from './auth';

export class ClassroomAPI {
  private static instance: ClassroomAPI;
  private authService = AuthService.getInstance();
  
  static getInstance(): ClassroomAPI {
    if (!ClassroomAPI.instance) {
      ClassroomAPI.instance = new ClassroomAPI();
    }
    return ClassroomAPI.instance;
  }

  async fetchCourses(): Promise<Course[]> {
    try {
      const accessToken = this.authService.getAccessToken();
      
      if (!accessToken || accessToken.startsWith('mock-access-token')) {
        console.log('Using mock data - no real Google access token available');
        return this.getMockCourses();
      }

      console.log('Fetching courses from Google Classroom API...');
      
      const response = await fetch('https://classroom.googleapis.com/v1/courses', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Google Classroom API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform Google Classroom API response to our Course interface
      const courses: Course[] = (data.courses || []).map((course: any) => ({
        id: course.id,
        name: course.name,
        section: course.section,
        description: course.description,
        teacherProfile: course.teacherFolder ? {
          name: course.teacherFolder.title || 'Teacher',
          emailAddress: course.ownerId || ''
        } : undefined,
        enrollmentCode: course.enrollmentCode,
        courseState: course.courseState,
        creationTime: course.creationTime,
        updateTime: course.updateTime
      }));

      console.log(`Successfully fetched ${courses.length} courses from Google Classroom`);
      return courses;
      
    } catch (error) {
      console.error('Failed to fetch courses from Google Classroom:', error);
      console.log('Falling back to mock data...');
      return this.getMockCourses();
    }
  }

  private getMockCourses(): Course[] {
    return [
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
      },
      {
        id: 'course-3',
        name: 'Computer Science',
        section: 'Section C',
        description: 'Introduction to programming and software development',
        teacherProfile: {
          name: 'Mr. Davis',
          emailAddress: 'mr.davis@school.edu'
        }
      }
    ];
  }

  async fetchCourseDetails(courseId: string): Promise<Course | null> {
    try {
      const accessToken = this.authService.getAccessToken();
      
      if (!accessToken || accessToken.startsWith('mock-access-token')) {
        const mockCourses = this.getMockCourses();
        return mockCourses.find(course => course.id === courseId) || null;
      }

      console.log(`Fetching details for course ${courseId}...`);
      
      const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Google Classroom API error: ${response.status}`);
      }

      const course = await response.json();
      
      return {
        id: course.id,
        name: course.name,
        section: course.section,
        description: course.description,
        teacherProfile: course.teacherFolder ? {
          name: course.teacherFolder.title || 'Teacher',
          emailAddress: course.ownerId || ''
        } : undefined,
        enrollmentCode: course.enrollmentCode,
        courseState: course.courseState,
        creationTime: course.creationTime,
        updateTime: course.updateTime
      };
      
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      const mockCourses = this.getMockCourses();
      return mockCourses.find(course => course.id === courseId) || null;
    }
  }
}
