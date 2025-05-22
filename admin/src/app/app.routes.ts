import type { Routes } from "@angular/router"
import { OverviewComponent } from "./components/overview/overview.component"
import { CoursesComponent } from "./components/courses/courses.component"
import { CourseEditor } from "./components/courses/CourseEditor/courseEditor.component"
import { UsersComponent } from "./components/users/users.component"

export const routes: Routes = [
    { path: "", redirectTo: "overview", pathMatch: "full" },
    { path: "overview", component: OverviewComponent },
    { path: "courses", component: CoursesComponent },
    { path: "editor", component: CourseEditor },
    { path: "editor/:id", component: CourseEditor },
    { path: "users", component: UsersComponent },
    { path: "**", redirectTo: "" },
]