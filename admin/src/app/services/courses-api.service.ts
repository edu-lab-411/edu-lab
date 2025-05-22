import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesApiService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  // Fetch all courses
  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_all_courses`);
  }

  // Delete a course
  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_course/${courseId}`);
  }

  // Add a new course
  addCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_course`, courseData);
  }

  // Get Course Details
  getCourseDetails(courseId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/courseDetails/${courseId}`);
  }
}
