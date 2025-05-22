import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewApiService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  // Total statistics
  getTotal(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_total`);
  }

  // Major statistics
  getMajorStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_major_statistics`);
  }

  // Course statistics
  getCourseEnrollment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_course_enrollment`);
  }

  // Get Majors
  getMajors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_majors`);
  }
  
}
