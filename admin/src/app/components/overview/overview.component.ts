import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ChartModule } from "primeng/chart"
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { DropdownModule } from "primeng/dropdown"
import { FormsModule } from "@angular/forms"
import { OverviewApiService } from "../../services/overview-api.service"

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule, ButtonModule, DropdownModule, FormsModule],
    templateUrl:"./overview.component.html",
    styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
    summaryStats = [
        {
            label: "Total Users",
            value: "",
            icon: "fas fa-users",
            iconBg: "bg-indigo-500",
        },
        {
            label: "Total Courses",
            value: "",
            icon: "fas fa-chalkboard-user",
            iconBg: "bg-indigo-500",
        },
        {
            label: "Total Major",
            value: "",
            icon: "fas fa-graduation-cap",
            iconBg: "bg-indigo-500",
        },
    ]
    TrafficCoursesData: any
    MajorData: any
    chartOptions: any
    pieChartOptions: any

    constructor(private overviewAPI: OverviewApiService) {}

    ngOnInit() {
        this.initChartOptions()

        this.overviewAPI.getTotal().subscribe({
            next: (data) => {
                // console.log("get total data", data)
                this.summaryStats[0].value = data.users
                this.summaryStats[1].value = data.courses
                // this.summaryStats[2].value = data.total_major
            },
            error: (err) => console.error("get total error", err),
        });

        this.overviewAPI.getMajorStatistics().subscribe({
            next: (data) => {
                // console.log("get major statistics data", data)
                this.MajorData = {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            // backgroundColor: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                        },
                    ],
                }
                data.map((item: any) => {
                    this.MajorData.labels.push(item.major.split("-").join(" "))
                    this.MajorData.datasets[0].data.push(item.count_1)
                });
            },
            error: (err) => console.error("get major statistics error", err),
        })

        this.overviewAPI.getCourseEnrollment().subscribe({
            next: (data) => {
                // console.log("get course enrollment data", data)
                this.TrafficCoursesData = {
                    labels: [],
                    datasets: [
                        {
                            label: "Course Enrollment",
                            data: [],
                            backgroundColor: "#6366f1",
                            // borderColor: "#6366f1",
                            // tension: 0.4,
                        },
                    ],
                }
                data.map((item: any) => {
                    this.TrafficCoursesData.labels.push(item.course_name)
                    this.TrafficCoursesData.datasets[0].data.push(item.enrollment_count)
                });
            },
            error: (err) => console.error("get course enrollment error", err),
        })

        this.overviewAPI.getMajors().subscribe({
            next: (data) => {
                // console.log("get majors data", data)
                this.summaryStats[2].value = data.length
            },
            error: (err) => console.error("get majors error", err),
        })
    }

    initChartOptions() {
        this.chartOptions = {
            plugins: {
                legend:  null
            },
            scales: {
                x: {
                grid: {
                    display: false,
                },
                },
                y: {
                grid: {
                    borderDash: [2, 2],
                },
                beginAtZero: true,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            }

            this.pieChartOptions = {
            plugins: {
                legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                    size: 12,
                    },
                },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    }
}
