//build query string based on input
const inquirer = require("inquirer");
const connection = require('./connection')
//ex ask which table to update
const ORM = require("./db/data");

//arrays are built to populate inquirer choices
let managerArray = [];
let employeeArray = [];
let deptArray = [];
let roleArray = []


//This function gets data to fill arrays in inquirer
function getEmpData() {
    //calling ORM method select all with parameter employee
    ORM.selectAll('employee')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                //adding full name to array
                employeeArray.push(`${res[i].first_name} ${res[i].last_name}`)
            }
        }
        ).catch(err => console.log(err));
    
    //method gets manager names
    ORM.getManagerNames()
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                managerArray.push(`${res[i].first_name} ${res[i].last_name}`)
            }
        }
        ).catch(err => console.log(err));
    //method gets departments
    ORM.selectAll('department')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                deptArray.push(`${res[i].dept_name}`)
            }
        }
        ).catch(err => console.log(err));
    //method gets roles
    ORM.selectAll('emp_role')
        .then(function (res) {
            for (i = 0; i < res.length; i++) {
                roleArray.push(`${res[i].title}`)
            }
        }
        ).catch(err => console.log(err));

}

//main application function
function cmsApp() {
    //get info for populating questions
    getEmpData();

    //initial prompt gives user many choices. will condense in future i.e. view folder, insert folder
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: "main",
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Update Employee Manager', 'View Budget By Department']
    })
        .then(function (answers) {

            //switch case to handle input
            //calls appropriate function
            switch (answers.main) {
                case 'View All Employees':
                    viewAllEmps();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Departments':
                    viewDepts();
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

                case 'Update Employee Manager':
                    updateManager();
                    break;
                case 'Update Employee Role':
                    updateEmpRole();
                    break;

                case 'View Budget By Department':
                    viewBudget();

                    break;

                default:
                    break;
            }



        })
        .catch(function (error) {
            console.log(error)
        })

}


//function calls ORM and returns full list of employees
function viewAllEmps() {
    ORM.selectAll('employee')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();
        }).catch(err => console.log(err))
}

//calls ORM method to get roles
function viewRoles() {
    ORM.selectAll('emp_role')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();

        })
}
//calls ORM to get depts
function viewDepts() {
    ORM.selectAll('department')
        .then(function (results, err) {
            if (err) throw err;
            console.table(results);
            console.log('\n');
            cmsApp();

        })
}

//function returns list of employees by dept
function viewEmpsByDepartment() {
    //prompt user for dept name
    inquirer.prompt([
        {
            type: "rawlist",
            message: "Choose a department",
            name: "dept_name",
            //use dept array to create choices
            choices: deptArray
        }
    ]).then(function (res) {
        //gets ID of dept by finding index and adding 1
        dept = (deptArray.indexOf(res.dept_name) + 1)
        //query string
        connection.query(
            `SELECT CONCAT(e.first_name, ' ', e.last_name) AS 'full_name', r.title, d.dept_name FROM employee AS e INNER JOIN emp_role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id WHERE d.id = ?`, dept
        ).then(results => console.table(results))
    }).catch(err => console.log(err))

}

//same logic as viewEmpsbyDept, but for managers
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

//insert function adds new employee
function insertIntoEmp() {
    inquirer
    //prompt user for info
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
            //sql query to add new employee
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

//same logic as insertIntoEmp
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

//same logic as other inserts
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
//function updates employee role
function updateEmpRole() {
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
    ]).then(function (res, err) {
        if (err) throw err;
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

//function updates manager
function updateManager() {
    inquirer.prompt([{
        type: "rawlist",
        message: "Select an employee to change role",
        name: "empName",
        choices: employeeArray
    },
    {
        type: "rawlist",
        message: "Select a new manager",
        name: "newManager",
        choices: managerArray
    }
    ]).then(function (res, err) {
        if (err) throw err;
        //get the emp id and manager id from sql table by adjusting array index
        let empID = (employeeArray.indexOf(res.empName) + 1)
        let managerID = (managerArray.indexOf(res.newManager) + 1)
        connection.query(
            `UPDATE employee SET manager_id = ${managerID} WHERE id = ${empID} `,
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows, ' 1 row affected \n')
                cmsApp()
            }
        )
    })
}

//function to calculate budget by department
function viewBudget() {

    inquirer.prompt([{
        type: "rawlist",
        message: "Select a department",
        name: "dept",
        choices: deptArray
    }]).then(function (res) {
        deptID = (deptArray.indexOf(res.dept) + 1);
        //calls ORM
        ORM.budget(deptID)
            .then(function (results, err) {
                if (err) throw err;
                console.table(results);
                console.log('\n');
                cmsApp();
            })
    }).catch(err => console.log(err))


}

cmsApp();