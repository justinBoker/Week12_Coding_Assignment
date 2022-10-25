// This class creates instances of Course with an empty array for students and a method to add students to each instance of Course
class Course {                                    
    constructor(name) {
        this.name = name;
        this.students = [];
    }
  
    addStudent(name, grade) {
        this.students.push(new Student(name, grade));
    }
}
 
// This class creates instances of Student with a name and grade
class Student {
    constructor(name, grade) {                        
        this.name = name;
        this.grade = grade;
    }
}
  
// This class handles all the API functions
class CourseService {
    static url = "https://635451b0e64783fa82832a18.mockapi.io/gradebook/api/course";
  
    static getAllCourses() {
        return $.get(this.url);
    }
  
    static getCourse(id) {
        return $.get(this.url + `/${id}`);
    }
  
    static createCourse(course) {
        return $.post(this.url, course);
    }
  
    static updateCourse(course) {
        return $.ajax({
            url: this.url + `/${course._id}`,
            dataType: "json",
            data: JSON.stringify(course),
            contentType: "application/json",
            type: "PUT"
        });
    }
  
    static deleteCourse(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

// This class handles all the different functions that affect the DOM
class DOMManager {
    static courses;
  
    static getAllCourses() {
        CourseService.getAllCourses().then(courses => this.render(courses));
    }
  
    static createCourse(name) {
        CourseService.createCourse(new Course(name))
            .then(() => {
                return CourseService.getAllCourses();
            })
            .then((courses) => this.render(courses));
    }
  
    static deleteCourse(id) {
        CourseService.deleteCourse(id)
            .then(() => {
                return CourseService.getAllCourses();
            })
            .then((courses) => this.render(courses));
    }
  
    static addStudent(id) {
        for (let course of this.courses) {
            if (course._id == id) {
                course.students.push(new Student($(`#${course._id}-student-name`).val(), $(`#${course._id}-student-grade`).val()));
                CourseService.updateCourse(course)
                    .then(() => {
                        return CourseService.getAllCourses();
                    })
                    .then((courses) => this.render(courses));
            }
        }
    }
  
    static deleteStudent(courseId, studentId) {
        for (let course of this.courses) {
            if (course._id == courseId) {
                for (let student of course.students) {
                    if (student._id == studentId) {
                        course.students.splice(course.students.indexOf(student), 1);
                        CourseService.updateCourse(course)
                            .then(() => {
                                return CourseService.getAllCourses();
                            })
                            .then((courses) => this.render(courses));
                    }
                }
            }
        }
    }
  
    static render(courses) {
        this.courses = courses;
      
        $("#app").empty();
        for (let course of courses) {
            $("#app").prepend(
                `<div id="${course._id}" class="card">                      
                    <div class="card-header">
                            <h2>${course.name}<h2> 
                            <button class="btn btn-danger" onClick="DOMManager.deleteCourse('${course._id}')">Delete Course</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${course._id}-student-name" class="form-control" Placeholder="Student Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${course._id}-student-grade" class="form-control" Placeholder="Student Grade">
                                </div>
                            </div>
                            <button id="${course._id}-new-student" onClick="DOMManager.addStudent('${course._id}')" class="btn btn-primary form-control">Add Student</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let student of course.students) {
                $(`#${course._id}`).find(`.card-body`).append(
                    `<p>
                        <span id="name-${student._id}"><strong>Name: </strong> ${student.name}</span>
                        <span id="grade-${student._id}"><strong>Grade: </strong> ${student.grade}</span>
                        <button class="btn btn-danger" onClick="DOMManager.deleteStudent('${course._id}' , '${student.name}')">Delete Student</button>
                    </p>`
                );
            }
        }
    }
}

// Function that handles the click event listener to create a new team
$("#create-new-course").click(() => {
    DOMManager.createCourse($("#new-course-name").val());
    $("#new-course-name").val("");
});

// This calls the getAllCourses function
DOMManager.getAllCourses();