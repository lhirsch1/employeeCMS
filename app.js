//build query string based on input
const inquirer = require("inquirer");
const connection = require('./connection')
//ex ask which table to update
const ORM = require("./db/data");

let running = 0;
let managerArray = [];
let employeeArray = [];
let deptArray = [];
let roleArray = []

function getEmpData() {
    ORM.selectAll('employee')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                employeeArray.push(`${res[i].first_name} ${res[i].last_name}`)
            }
        }
        ).catch(err => console.log(err));

    ORM.getManagerNames()
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                managerArray.push(`${res[i].first_name} ${res[i].last_name}`)
            }
        }
        ).catch(err => console.log(err));

    ORM.selectAll('department')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                deptArray.push(`${res[i].dept_name}`)
            }
        }
        ).catch(err => console.log(err));

        ORM.selectAll('emp_role')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                roleArray.push(`${res[i].title}`)
            }
        }
        ).catch(err => console.log(err));


}
// function getManagerData(){
//     ORM.getManagerNames().then(function(res){console.log(res)})
// }

function cmsApp() {
    //get info for populating questions
    getEmpData();
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: "main",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Add Role', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'View Budget By Department']
    })
        .then(function (answers) {

            switch (answers.main) {
                case 'View All Employees':
                    viewAllEmps();
                    break;
                case 'View All Employees By Department':
                    viewEmpsByDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewEmpsbyManager();
                    break;

                case 'Add Employee':
                    insertIntoEmp();
                    break;

                case 'Add Role':
                    insertIntoRole();
                    break;

                case 'Add Department':
                    insertIntoDepartment();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Remove Role':
                    removeRole();
                    break;
                case 'Remove Department':
                    removeDept();
                    break;
                case 'Update Employee Manager':
                    updateManager();
                    break;
                case 'Update Employee Role':
                    updateEmpRole();
                    break;

                case 'Update Employee Manager':
                    updateEmpManager();
                    break;

                case 'View All Roles':
                    viewRoles();


                    break;

                case 'View Budget By Department':
                    ORM.budget('Engineering')
                        .then(results => console.table(results))
                        .catch(err => console.log(err));

                    break;

                default:
                    break;
            }



        })
        .catch(function (error) {
            console.log(error)
        })

}


cmsApp();

function viewAllEmps() {
    ORM.selectAll('employee')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();
        })
}

function viewRoles() {
    ORM.selectAll('emp_role')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();

        })
}

function viewDepts() {
    ORM.selectAll('department')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();

        })
}

function viewEmpsByDepartment(dept) {

    inquirer.prompt([
        {
            type: "rawlist",
            message: "Choose a department",
            name: "dept_name",
            choices: deptArray
        }
    ]).then(function (res) {
        dept = (deptArray.indexOf(res.dept_name) + 1)

        connection.query(
            `SELECT CONCAT(e.first_name, ' ', e.last_name) AS 'full_name', r.title, d.dept_name FROM employee AS e INNER JOIN emp_role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id WHERE d.id = ?`, dept
        ).then(results => console.table(results))
    }).catch(err => console.log(err))

}

function viewEmpsbyManager() {

    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'Select a manager',
            choices: managerArray,
            name: 'manager_id'
        }
    ]).then(function (res) {

        res.manager_id = (managerArray.indexOf(res.manager_id) + 1);

        console.log("res ", res)
        connection.query(
            ` SELECT CONCAT(e.first_name, ' ', e.last_name) AS "Full Name"
            FROM employee AS e
            LEFT OUTER JOIN employee AS m ON e.manager_id = m.id
            WHERE m.id = ? `, res.manager_id,
            function (err, res) {
                if (err) throw err;
                console.table(res)
                console.log('\n');
                cmsApp();
            }
        )
    })
}

function insertIntoEmp() {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    message: `Enter the new employee's first name`,
                    name: 'first_name'
                },
                {
                    type: 'input',
                    message: `Enter new employee last name`,
                    name: 'last_name'
                },
                {
                    type: 'input',
                    message: `Enter the new employee's role ID`,
                    name: 'role_id'
                },
                {
                    type: 'input',
                    message: `Enter the new employee's manager ID`,
                    name: 'manager_id'
                },
            ]
        ).then(function (res) {
            // console.log(res);
            connection.query(
                'INSERT INTO employee SET ?', res,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows, ' 1 row affected \n')
                    cmsApp()
                }
            )



        })

}

function insertIntoRole() {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    message: `Enter the new role title`,
                    name: 'title'
                },
                {
                    type: 'input',
                    message: `Enter new role salary`,
                    name: 'salary'
                },
                {
                    type: 'rawlist',
                    message: `Enter the new role department id`,
                    name: 'department_id',
                    choices: deptArray
                }
            ]
        ).then(function (res) {
            //gets the index of department and adds one to match id in table
            res.department_id = (deptArray.indexOf(res.department_id) + 1);
            connection.query(
                'INSERT INTO emp_role SET ?', res,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows, ' 1 row affected \n')
                    cmsApp()
                }
            )


        })

}

function insertIntoDept() {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    message: `Enter the new department title`,
                    name: 'title'
                }
            ]
        ).then(function (res) {
            //gets the index of department and adds one to match id in table
            
            connection.query(
                'INSERT INTO emp_role SET ?', res,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows, ' 1 row affected \n')
                    cmsApp()
                }
            )
        })

}

function updateEmpRole(){
    inquirer.prompt([{
        type: "rawlist",
        message: "Select an employee to change role",
        name: "empName",
        choices: employeeArray
    },
    {
        type: "rawlist",
        message: "Select a new role",
        name: "newRole",
        choices: roleArray
    }
]).then(function(res,err){
    if(err) throw err;
    let empID = (employeeArray.indexOf(res.empName) + 1)
    let roleID = (roleArray.indexOf(res.newRole) + 1)
    connection.query(
        `UPDATE employee SET role_id = ${roleID} WHERE id = ${empID} `,
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows, ' 1 row affected \n')
            cmsApp()
        }
    )

})
}