
export interface Course {
  id: string;
  name: string;
  section?: string;
  description?: string;
  teacherProfile?: {
    name: string;
    emailAddress: string;
  };
  enrollmentCode?: string;
  courseState?: string;
  creationTime?: string;
  updateTime?: string;
}
