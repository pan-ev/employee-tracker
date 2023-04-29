function viewDepartments(db) {
  db.query("SELECT * FROM department", function (err, result) {
    console.log("\n");
    console.table(result);
  });
}

function viewRoles(db) {
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id",
    function (err, result) {
      console.log("\n");
      console.table(result);
    }
  );
}

function viewEmployees(db) {
  let queryText = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name," ",manager.last_name) AS manager 
    FROM employee 
    JOIN role 
        ON employee.role_id = role.id 
    JOIN department 
        ON role.department_id = department.id 
    LEFT OUTER JOIN employee manager 
        ON employee.manager_id = manager.id;`;
  db.query(queryText, function (err, result) {
    console.log("\n");
    console.table(result);
  });
}

function addDepartment(db, department) {
  db.query(
    `INSERT INTO department (name) VALUES (?)`,
    department,
    function (err) {
      console.log("\n");
      console.table(`${department} has been added to Departments`);
    }
  );
}

function addRole(db, newRole) {
  db.query(
    `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`,
    [newRole.title, newRole.salary, newRole.department],
    function (err) {
      console.table(`${newRole.title} has been added to Departments`);
    }
  );
}

function addEmployee(db, newEmployee) {
  db.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
    [
      newEmployee.firstName,
      newEmployee.lastName,
      newEmployee.role,
      newEmployee.manager,
    ],
    function (err) {
      console.table(`${newEmployee.firstName} ${newEmployee.lastName} has been added to Employees`);
    }
  );
}

function updateEmployeeRole(db) {
  db.query("", function (err, result) {
    console.table(result);
  });
}

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
