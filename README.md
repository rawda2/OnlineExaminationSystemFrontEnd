# Online Examination System (ITI) — Frontend (Angular)

A modern **Angular** frontend for the ITI Online Examination System.  
Supports **Single Login** (Admin / Instructor / Student), **JWT Authentication**, and **Role-based UI**.

The frontend consumes the backend **.NET Web API (DB-First)** where business logic is implemented mainly in **SQL Stored Procedures**, and the API exposes endpoints for authentication and management.

---

## Features

### ✅ Authentication
- **Single Login** for Admin / Instructor / Student
- **JWT token storage**
- Auto attach token to requests using **HTTP Interceptor**
- Route protection using **Auth Guards**
- **Role-based access** (Admin / Instructor / Student)

### ✅ Students
- Register (creates account only, no token)
- Login (returns token)
- Update own profile (FullName / Email / Password) using token

### ✅ Instructors
- Instructor can fetch **own courses** (token-based)
- Admin can fetch **instructor courses** by instructor id

### ✅ Courses (Admin)
- Add / Update / Delete course
- Get all courses
- Get course by id

---

## Tech Stack

- **Angular**
- **TypeScript**
- **Angular Router**
- **RxJS**
- **Angular Forms (Reactive Forms)**
- **HTTP Client**
- **JWT Decode**
- **Tailwind**

---

## Project Structure

```txt
src/
 ├─ app/
 │
 │   ├─ core/
 │   │   ├─ environment/
 │   │   │   └─ environment.ts
 │   │   ├─ guards/
 │   │   ├─ interceptors/
 │   │   └─ services/
 │   │       ├─ Auth/
 │   │       ├─ Branches/
 │   │       ├─ Exams/
 │   │       ├─ Instructor/
 │   │       ├─ Instructor_exams/
 │   │       └─ Toast/
 │
 │   ├─ layouts/
 │   │   ├─ app-shell/
 │   │   └─ side-bar/
 │
 │   ├─ pages/
 │   │   ├─ dashboard/
 │   │   ├─ login/
 │   │   ├─ register/
 │   │   ├─ student/
 │   │   ├─ students_exam/
 │   │   ├─ instructor/
 │   │   ├─ Instructor_Exams/
 │   │   ├─ Instructor_questions/
 │   │   ├─ Exams_List/
 │   │   ├─ exam-result/
 │   │   └─ not-found/
 │
 │   ├─ shared/
 │   │   ├─ components/
 │   │   ├─ directives/
 │   │   ├─ pipes/
 │   │   └─ interfaces/
 │   │       ├─ Auth/
 │   │       ├─ Exams/
 │   │       ├─ Branch/
 │   │       ├─ Attemps/
 │   │       └─ Instructor_questions/
 │
 │   ├─ app.component.ts
 │   ├─ app.component.html
 │   ├─ app.component.css
 │   ├─ app.config.ts
 │   ├─ app.routes.ts
 │
 ├─ public/
 ├─ styles.css
 └─ main.ts

```
---

## Collaborators

**Rawda Ashour**  
📧 Email: ashrawda@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/rawda-ashor-abdelhady-168250304  

**Eman Shehata**  
📧 Email: emanshehata258@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/emanshehata  

 
---
