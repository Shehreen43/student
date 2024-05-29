import inquirer from 'inquirer';

interface Student {
    studentID: string | number;
    name: string;
    courses: string[];
    tuitionBalance: number;
}

const students: Student[] = [];
let idCounter: number = 10000;  

function generateStudentID(): number {
    return idCounter++
}

async function addStudent() {
    const answers = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter student name:',
        }
    ]);

    const newStudent: Student = {
        studentID: generateStudentID(),
        name: answers.name,
        courses: [],
        tuitionBalance: 0,
    };

    students.push(newStudent);
    console.log(`Student ${answers.name} added with ID: ${newStudent.studentID}`);
}

async function deleteStudent() {
    const student = await selectStudent();
    if (student) {
        const index = students.findIndex(s => s.studentID === student.studentID);
        if (index !== -1) {
            students.splice(index, 1);
            console.log(`Student ${student.name} with ID ${student.studentID} has been deleted.`);
        }
    }
}

async function enrollStudent() {
    const student = await selectStudent();
    if (student) {
        const answers = await inquirer.prompt([
            {
                name: 'course',
                type: 'input',
                message: 'Enter course name:',
            }
        ]);
        student.courses.push(answers.course);
        student.tuitionBalance -= 600; // Assuming each course costs $600
        console.log(`Enrolled in course: ${answers.course}`);
    }
}

async function viewBalance() {
    const student = await selectStudent();
    if (student) {
        console.log(`Tuition Balance: $${student.tuitionBalance}`);
    }
}

async function payTuition() {
    const student = await selectStudent();
    if (student) {
        const answers = await inquirer.prompt([
            {
                name: 'amount',
                type: 'input',
                message: 'Enter payment amount:',
                validate: (input) => !isNaN(Number(input)) && Number(input) > 0,
            }
        ]);
        student.tuitionBalance += Number(answers.amount);
        console.log(`Payment of $${answers.amount} received.`);
    }
}

async function showStatus() {
    const student = await selectStudent();
    if (student) {
        console.log(`\nStudent ID: ${student.studentID}`);
        console.log(`Name: ${student.name}`);
        console.log(`Courses Enrolled: ${student.courses.join(", ")}`);
        console.log(`Balance: $${student.tuitionBalance}`);
    }
}

async function selectStudent(): Promise<Student | undefined> {
    if (students.length === 0) {
        console.log('No students available.');
        return;
    }

    const answers = await inquirer.prompt([
        {
            name: 'studentID',
            type: 'list',
            message: 'Select student:',
            choices: students.map(student => ({ name: student.name, value: student.studentID })),
        }
    ]);

    return students.find(student => student.studentID === answers.studentID);
}

async function mainMenu() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: 'Select an action:',
                choices: [
                    { name: 'Add Student', value: 'add' },
                    { name: 'Enroll Student in Course', value: 'enroll' },
                    { name: 'View Balance', value: 'balance' },
                    { name: 'Pay Tuition', value: 'pay' },
                    { name: 'Show Status', value: 'status' },
                    { name: 'Delete Student', value: 'delete' },
                    { name: 'Exit', value: 'exit' }
                ]
            }
        ]);

        switch (answers.action) {
            case 'add':
                await addStudent();
                break;
            case 'enroll':
                await enrollStudent();
                break;
            case 'balance':
                await viewBalance();
                break;
            case 'pay':
                await payTuition();
                break;
            case 'status':
                await showStatus();
                break;
            case 'delete':
                await deleteStudent();
                break;
            case 'exit':
                return;
        }
    }
}

mainMenu().catch(error => {
    console.error("An error occurred: ", error);
});
//tuples