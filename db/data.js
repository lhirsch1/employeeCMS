var connection = require('../connection.js')

console.log("howdy")
class ORM {
    constructor(connection) {
        this.connection = connection;
    }




    // select all from table
    selectAll(tableInput) {
        const queryString = "SELECT * FROM ?? ";
        return this.connection.query(queryString, [tableInput]);
        
    }

    selectWhere(colToSearch, valOfCol) {
        const queryString = ` SELECT e.id, CONCAT(e.first_name, ' ',e.last_name) as 'Full Name', CONCAT(m.first_name,' ', m.last_name) AS 'Manager', r.title AS 'Job Title', d.dept_name AS 'Department_Name' from employee as e INNER JOIN emp_role as r on e.role_id = r.id INNER JOIN department AS d on d.id = r.department_id LEFT OUTER JOIN employee as m on e.manager_id = m.id  WHERE ?? = ?;`;
        console.log("col ",colToSearch) 
        console.log("val ",valOfCol)
        //console.log('log ', this.connection.query(queryString, [colToSearch, valOfCol]))
        return this.connection.query(queryString, [colToSearch, valOfCol])
      }

    //     * //gets manager names for questions
    getManagerNames(){
        const queryString =`SELECT DISTINCT  m.first_name , m.last_name
        FROM employee AS e
        LEFT OUTER JOIN employee AS m ON e.manager_id = m.id
        WHERE m.first_name IS NOT NULL`
        return this.connection.query(queryString);
    }

    //gets info on employees for first screen
    getFullEmployeeData(){
        const queryString = `
        SELECT e.id, CONCAT(e.first_name, ' ',e.last_name) as 'Full Name', 
        CONCAT(m.first_name,' ', m.last_name) AS 'Manager', 
        r.title AS 'Job Title', d.dept_name AS 'Department Name' from employee as e 
        INNER JOIN emp_role as r on e.role_id = r.id 
        INNER JOIN department AS d on d.id = r.department_id
        LEFT OUTER JOIN employee as m on e.manager_id = m.id
        order BY d.id, e.last_name;
        `
        return this.connection.query(queryString)
    }


    //ORM insert function
    insert(table, columns, values) {
        console.log("insert");
        const queryString = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${this.printQuestionMarks(values.length)})`;

        console.log("query string" ,queryString);

        return this.connection.query(queryString, [table, ...values])
    }


//     * Delete departments, roles, and employees
// DELETE FROM ?? WHERE ? = ?



//     * View the total utilized budget of a department -- 
//       ie the combined salaries of all employees in that department
budget(dept){
    const queryString = `SELECT d.dept_name AS 'Department', SUM(r.salary) as 'budget'
                            FROM employee as e
                            INNER JOIN emp_role as r ON e.role_id = r.id
                            INNER JOIN department AS d on r.department_id = d.id
                            WHERE d.dept_name = "${dept}"`

        return this.connection.query(queryString,)

    }






}

module.exports = new ORM(connection);