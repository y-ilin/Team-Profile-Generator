const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

// Assume the user intends to add a new employee profile at the initiation of the application.
let addEmployee = "Yes";
// Begin with empty employees array
const employees = [];

// Ask user if they would like to add another employee.
function promptAddEmployee() {
    return inquirer.prompt([
        {
        type: "list",
        name: "addEmployee",
        message: "Would you like to add a new employee profile? ",
        choices: ["Yes", "No"]
        }
    ]);
}
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function promptEmployeeType() {
    return inquirer.prompt([
        {
        type: "list",
        name: "employeeType",
        message: "Select an employee type:",
        choices: ["Manager", "Engineer", "Intern"],
        default: "Manager"
        }
    ]);
}
// Prompt for all employees
function promptEmployee() {
    return inquirer.prompt([
        {
        type: "input",
        name: "name",
        message: "Employee's name: "
        },
        {
        type: "input",
        name: "id",
        message: "Employee's ID: "
        },
        {
        type: "input",
        name: "email",
        message: "Employee's email: "
        }
    ]);
}
// Prompt for new managers
function promptManager() {
    return inquirer.prompt([
        {
        type: "input",
        name: "officeNumber",
        message: "Manager's office number: "
        }
    ]);
}
// Prompt for new engineers
function promptEngineer() {
    return inquirer.prompt([
        {
        type: "input",
        name: "github",
        message: "Engineer's GitHub: "
        }
    ]);
}
// Prompt for new interns
function promptIntern() {
    return inquirer.prompt([
        {
        type: "input",
        name: "school",
        message: "Intern's school: "
        }
    ]);
}

async function generateEmployeeProfile() {
    // Prompt user for what type of employee to add
    const employeeType = (await promptEmployeeType()).employeeType;
    const employeeInfo = await promptEmployee();
    let newEmployee = {};

    // Depending on employee type, prompt for other relevant information
    if (employeeType === "Manager") {
        const employeeMoreInfo = await promptManager();
        newEmployee = new Manager(employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeMoreInfo.officeNumber)
    } else if (employeeType === "Engineer") {
        const employeeMoreInfo = await promptEngineer();
        newEmployee = new Engineer(employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeMoreInfo.github)
    } else if (employeeType === "Intern") {
        const employeeMoreInfo = await promptIntern();
        newEmployee = new Intern(employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeMoreInfo.school)
    }

    // Add new employee to employee array
    employees.push(newEmployee);
}

// Main function
async function init() {
    try {
        // Until user chooses to not add another employee profile, keep prompting to generate a new one
        while (addEmployee === "Yes") {
            await generateEmployeeProfile();
            addEmployee = (await promptAddEmployee()).addEmployee;
            console.log(addEmployee);
        }

        // When user chooses to stop adding employee profiles,
        // Call 'render' function to generate and return HTML including all employee info
        const htmlGenerated = await render(employees);
        
        // Write the returned HTML to a new file 'team.html'
        fs.writeFile("./output/team.html", htmlGenerated, function(error){
            if(error) {
                return console.log(error)
            }
        })
        
    } catch(error) {
        console.log(error);
    }
}

init();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.