import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse, IQuestion } from '../../../shared/interfaces/Instructor_questions/IQuestions'
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class InstructorQuestionsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.baseURL}`;

    // Get courses for a specific instructor
    getCourses(instructorId: number): Observable<ICourse[]> {
        return this.http.get<ICourse[]>(`${this.apiUrl}Instructors/${instructorId}/courses`);
    }

    // Get questions for a specific course
    getQuestionsByCourse(courseId: number): Observable<IQuestion[]> {
        return this.http.get<IQuestion[]>(`${this.apiUrl}Questions/by-course/${courseId}`);
    }

    // Add new question
    c(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}Questions/add-with-choices`, payload);
    }
}