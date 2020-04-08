//build query string based on input
const inquirer = require("inquirer");
//ex ask which table to update
const ORM = require("./db/data");

function cmsApp() {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: "main",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles','View Budget By Department']
    })
        .then(function (answers) {

            switch (answers.main) {
                case 'View All Employees':
                    ORM.selectWhere('employee')
                    .then(results => console.log(results))
                    .catch(err => console.log(err));
                    break;

                case 'View All Employees By Department':
                    ORM.selectWhere('emp_role')
                    .then(results => console.log(results))
                    .catch(err => console.log(err));
                    break;
                case 'View All Employees By Manager':
                    ORM.selectWhere('emp_role')
                    .then(results => console.log(results))
                    .catch(err => console.log(err));
                    break;

                case 'Add Employee':
                    ORM.insert()
                    break;

                case 'Remove Employee':

                    break;
                case 'Update Employee Role':

                    break;

                case 'Update Employee Manager':

                    break;

                case 'View All Roles':
                    ORM.selectWhere('emp_role')
                    .then(results => console.log(results))
                    .catch(err => console.log(err));
                    break;

                case 'View Budget By Department':
                    ORM.budget('Engineering')
                    .then(results => console.log(results))
                    .catch(err => console.log(err));
                    break;

                default:
                    break;
            }


        })
        .catch(function(error){
            console.log(error)
        })
}


cmsApp();


function dog() {

    const mainSwitch = (answer) => ({
        "View All Employees": function (data) {
            console.log("hi!");

        },
        "View All Employees By Department": "Pit Bulls are good boys and girls.",
        "Add Employee": "Add emp",
        "Remove Employee": "cya",
        "View All Employees By Manager": "iown u",
        "Update Employee Role": "demotion",
        "Update Employee Manager": "raise",
        "View All Roles": "im on it"

    })[answer]

}
dog();

function sayHi() {
    console.log("hi!")
}