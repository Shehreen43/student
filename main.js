import inquirer from 'inquirer';
import chalk from 'chalk';
let students = [];
let idCounter = 1000;
async function generateStudentID() {
    return `ST${++idCounter}`;
}
async function addStudent() {
    const answers = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: chalk.blue('Enter student name:'),
            validate: (input) => input !== ''
        },
        {
            name: 'qualification',
            type: 'checkbox',
            message: chalk.blue('Select your qualification:'),
            choices: ['Matric', 'Intermediate', 'Graduate', 'Masters'],
            validate: (input) => input.length > 0
        },
        {
            name: 'email',
            type: 'input',
            message: chalk.blue('Enter your email:'),
            validate: (input) => /\S+@\S+\.\S+/.test(input) || "Please enter a valid email address."
        }
    ]);
    const student = {
        studentID: await generateStudentID(),
        name: answers.name,
        email: answers.email,
        qualification: answers.qualification,
        courses: [],
        tuitionBalance: 500,
    };
    students.push(student);
    console.log(chalk.green(`\nStudent ${student.name} with the student ID: ${student.studentID} added successfully!`));
}
async function enrollStudent() {
    const student = await selectStudent();
    if (student) {
        const answers = await inquirer.prompt([
            {
                name: 'course',
                type: 'list',
                message: chalk.blue('Select a course to enroll:'),
                choices: ['Typescript', 'Python', 'React.js', 'CSS Tailwind', 'HTML']
            }
        ]);
        student.courses.push(answers.course);
        console.log(chalk.green(`\nStudent ${student.name} has been enrolled in the course ${answers.course}.`));
    }
}
async function viewBalance() {
    const student = await selectStudent();
    if (student) {
        console.log(chalk.magenta(`\nTuition balance for student ${student.name}: $${student.tuitionBalance}`));
    }
}
async function payTuition() {
    const student = await selectStudent();
    if (student) {
        const answers = await inquirer.prompt([
            {
                name: 'amount',
                type: 'number',
                message: chalk.blue('Enter the amount to pay:')
            }
        ]);
        student.tuitionBalance -= answers.amount;
        console.log(chalk.green(`Tuition payment of $${answers.amount} has been made for student ${student.name}. New tuition balance: $${student.tuitionBalance}`));
    }
}
async function showStudents() {
    if (students.length === 0) {
        console.log(chalk.yellow('\nNo students available.'));
        return;
    }
    console.log(chalk.blue('List of Students:'));
    students.forEach((student) => {
        console.log(chalk.blue(`Student ID: ${student.studentID}, Name: ${student.name}, Courses Enrolled: ${student.courses.join(', ')}, Balance: $${student.tuitionBalance}`));
    });
}
async function updateStudent() {
    const student = await selectStudent();
    if (student) {
        const answers = await inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: chalk.blue('Enter student name:'),
                default: student.name
            },
            {
                name: 'qualification',
                type: 'checkbox',
                message: chalk.blue('Select your qualification:'),
                choices: ['Matric', 'Intermediate', 'Graduate', 'Masters'],
                default: student.qualification
            },
            {
                name: 'email',
                type: 'input',
                message: chalk.blue('Enter your email:'),
                default: chalk.redBright(student.email)
            }
        ]);
        student.name = answers.name;
        student.qualification = answers.qualification;
        student.email = answers.email;
        console.log(chalk.green(`\nStudent ${student.name} with the student ID: ${student.studentID} updated successfully!`));
    }
}
async function selectStudent() {
    if (students.length === 0) {
        console.log(chalk.yellow('\nNo students available.'));
        return undefined;
    }
    const answers = await inquirer.prompt([
        {
            name: 'studentID',
            type: 'list',
            message: chalk.blue('Select a student:'),
            choices: students.map(student => ({ name: student.name, value: student.studentID }))
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
                message: chalk.blue('Select an action:'),
                choices: [chalk.cyan('Add Student', 'Enroll in a Course', 'View Balance', 'Pay Tuition', 'Update Student', 'Show Students', 'Exit')]
            }
        ]);
        switch (answers.action) {
            case 'Add Student':
                await addStudent();
                break;
            case 'Enroll in a Course':
                await enrollStudent();
                break;
            case 'View Balance':
                await viewBalance();
                break;
            case 'Pay Tuition':
                await payTuition();
                break;
            case 'Update Student':
                await updateStudent();
                break;
            case 'Show Students':
                await showStudents();
                break;
            case 'Exit':
                console.log(chalk.bold.bgCyan('Exiting the application...'));
                return;
        }
    }
}
mainMenu().catch(error => {
    console.error(chalk.red("An error occurred: "), error);
});
