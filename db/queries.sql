select 
    * 
from department;

select 
    role.id, 
    role.title, 
    department.name AS department, 
    role.salary 
from role 
JOIN department 
ON role.department_id = department.id;

select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title AS title, 
    department.name AS department, 
    role.salary, 
    CONCAT(manager.first_name," ",manager.last_name) AS manager 
    from employee 
    JOIN role 
    ON employee.role_id = role.id 
    JOIN department 
    ON role.department_id = department.id 
    LEFT OUTER JOIN employee manager 
    ON employee.manager_id = manager.id;

INSERT INTO role (id, title, salary, department_id)
VALUES
    (7, "Legal Team Lead", 250000, 4);

INSERT INTO department (id, name)
VALUES 
    (5, "Service");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, "John", "Doe", 1, null);