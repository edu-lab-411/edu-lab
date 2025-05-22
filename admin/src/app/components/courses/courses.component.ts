import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CoursesApiService } from '../../services/courses-api.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { OverviewApiService } from '../../services/overview-api.service';

interface Major {
  name: string;
  code: string;
}

@Component({
  selector: 'app-courses',
  imports: [
    FormsModule,
    Select,
    ButtonModule,
    InputIcon,
    IconField,
    InputTextModule,
    CommonModule,
    Toast
  ],
  templateUrl: './courses.component.html',
  providers: [MessageService],
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  courses: any[] = [];
  majors: Major[] | undefined;
  filteredCourses: any[] = [];
  selectedMajor: Major | undefined;

  constructor(
    private router: Router,
    private CoursesAPI: CoursesApiService,
    private messageService: MessageService,
    private overviewAPI: OverviewApiService
  ) {}

  ngOnInit() {
    this.overviewAPI.getMajors().subscribe({
      next: (data) => {
          // console.log('get majors data', data);
          this.majors = data.map((major: any) => ({
              name: major.major_name.split("-").join(" "),
              code: major.major_name
          }));
          this.majors?.unshift({ name: 'All', code: 'all' });
      },
      error: (err) => {
          console.error('get majors error', err);
      }
    });

    this.CoursesAPI.getCourses().subscribe({
      next: (data) => {
        // console.log('get courses data', data);
        this.courses = data;
        this.filteredCourses = data;
      },
      error: (err) => console.error('get courses error', err)
    });
  }

  goToEditor() {
    this.router.navigate(['/editor']);
  }

  viewCourse(courseID: number) {
    this.router.navigate(['/editor', courseID]);
  }

  deleteCourse(courseID: number) {
    this.CoursesAPI.deleteCourse(courseID).subscribe({
      next: (data) => {
        // console.log('delete course data', data);
        this.courses = this.courses.filter(course => course.id !== courseID);
        this.filteredCourses = this.courses;
        this.selectedMajor = undefined;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course deleted successfully' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Something wrong, try again' });
        console.error('delete course error', err);
      }
    });
  }

  selectMajor(){
    console.log('selected major', this.selectedMajor);
    if(this.selectedMajor){
      if(this.selectedMajor.code === 'all'){
        this.filteredCourses = this.courses;
        return;
      }
      let filteredCourses = this.courses;
      this.filteredCourses = filteredCourses.filter(course => course.course_major.split(", ").includes(this.selectedMajor?.code));
    }
  }

  handleSearch(e:any) {
    if(e.target.value === ''){
      this.filteredCourses = this.courses;
      return;
    }
    this.filteredCourses = this.courses.filter((course) => course.course_name.toLowerCase().includes(e.target.value.toLowerCase()));
  }

}
