DROP DATABASE  IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int,
    PRIMARY KEY (id)
);

CREATE TABLE emp_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary decimal (12,2),
    department_id int,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Homer', 'Simpson', 1, 2),('Carl', 'Carlson', 2, 8),
('Lenny', 'Leonard', 4,2),('Waylon', 'Smithers',3,8),
('Frank', 'Grimes', 5,8),('Ralph','Wiggam', 6,5),
('Duff','Man',6,5),('C Montgomery', 'Burns',7,null);


INSERT INTO emp_role (title, salary, department_id) 
VALUES ('Safety Technician', 40000.00, 2), ('Lead Nuclear Engineer', 150000.00,2), 
('Personal Assistant', 60000.00,1), ('Junior Nuclear Engineer', 90000.00, 2),
('Lead Marketing Agent', 100000,3), ('Marketing Intern', 0, 3),('CEO',100000000,4);

INSERT INTO department (dept_name) VALUES ("Human Resources"), ("Engineering"),("Marketing"),("Executive");
zc

-- select CONCAT(e.first_name, ' ',e.last_name) as Emp_Name, CONCAT(m.first_name,' ', m.last_name) AS manager, r.title, d.dept_name from employee as e inner join emp_role as r on e.role_id = r.id 
-- INNER JOIN department AS d on d.id = r.department_id
-- LEFT OUTER JOIN employee as m on e.manager_id = m.id
-- order BY d.dept_name

-- INSERT INTO *table name + params* values(*values*);

-- UPDATE *tablename* SET ? WHERE ?
