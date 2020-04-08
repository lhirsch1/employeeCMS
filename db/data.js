var connection = require('../connection.js')

console.log("howdy")
class ORM {
    constructor(connection) {
        this.connection = connection;
    }

    //     * Add departments, roles, employees

    insert(table, columns, values) {

        const queryString = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${this.printQuestionMarks(values.length)})`;

        console.log(queryString);

        return this.connection.query(queryString, [table, ...values])
    }


    //     * View departments, roles, employees
    viewAllEmps() {

        const querySTring = ``

    }
//     SELECT * FROM ??

//         //     * Update employee roles
//         UPDATE ?? SET ? WHERE ?

//             //   Bonus points if you're able to:

//             //     * Update employee managers
//             //select managers, make list update emp from there

//             //     * View employees by manager
//             SELECT e.id AS "Employee ID", CONCAT(e.first_name, ' ', e.last_name) as Emp_Name,
//                 r.title AS "Role", d.dept_name AS "Department" from employee as e
// INNER JOIN emp_role as r on e.role_id = r.id
// INNER JOIN department AS d on d.id = r.department_id
// LEFT OUTER JOIN employee as m on e.manager_id = m.id
// WHERE m.id = 8


//     * Delete departments, roles, and employees
// DELETE FROM ?? WHERE ? = ?

//     * View the total utilized budget of a department -- 
//       ie the combined salaries of all employees in that department
budget(dept){
    const queryString = `SELECT SUM(r.salary) as "budget"
                            FROM employee as e
                            INNER JOIN emp_role as r ON e.role_id = r.id
                            INNER JOIN department AS d on r.department_id = d.id
                            WHERE d.dept_name = "${dept}"`

        return this.connection.query(queryString,)
    }




selectWhere(tableInput) {
    console.log("selectWhere")
    const queryString = "SELECT * FROM ?? ";
    
    return this.connection.query(queryString, [tableInput]);
    console.log(query.sql)
}

}

module.exports = new ORM(connection);