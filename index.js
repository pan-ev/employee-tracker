const mysql = require("mysql2");
const inquirer = require("inquirer");
const queries = require("./lib/queries.js");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employee_db",
});

class Role {
  constructor(title, salary, department) {
    this.title = title;
    this.salary = salary;
    this.department = department;
  }
}

class Employee {
  constructor(firstName, lastName, role, manager) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.manager = manager;
  }
}

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then((data) => {
      if (data.action === "View All Departments") {
        queries.viewDepartments(db);
      } else if (data.action === "View All Roles") {
        queries.viewRoles(db);
      } else if (data.action === "View All Employees") {
        queries.viewEmployees(db);
      } else if (data.action === "Add a Department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department_name",
              message: "Please enter the department name",
            },
          ])
          .then((input) => {
            queries.addDepartment(db, input.department_name);
          });
      } else if (data.action === "Add a Role") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "job_title",
              message: "Please enter the role title",
            },
            {
              type: "input",
              name: "salary",
              message: "Please enter the salary for the role",
            },
          ])
          .then((input) => {
            const newRole = new Role(input.job_title, input.salary);
            db.query("SELECT * FROM department", function (err, result) {
              var departmentList = result.map(({ name, id }) => ({
                name: name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Select the role's department",
                    name: "depChoice",
                    choices: departmentList,
                  },
                ])
                .then((data) => {
                  newRole.department = data.depChoice;
                  queries.addRole(db, newRole);
                });
            });
          });
      } else if (data.action === "Add an Employee") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "Please enter the employee's first name",
            },
            {
              type: "input",
              name: "last_name",
              message: "Please enter the employee's last name",
            },
          ])
          .then((input) => {
            const newEmployee = new Employee(
              input.first_name,
              input.last_name,
              null,
              null
            );
            db.query("SELECT * FROM role", function (err, result) {
              var roleList = result.map(({ title, id }) => ({
                name: title,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Select the employee's role",
                    name: "roleChoice",
                    choices: roleList,
                  },
                ])
                .then((roleInput) => {
                  newEmployee.role = roleInput.roleChoice;
                  db.query("SELECT * FROM employee", function (err, result) {
                    var managerList = result.map(
                      ({ first_name, last_name, id }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id,
                      })
                    );
                    managerList.push({ name: "Not Applicable", value: null });
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          message: "Select the employee's manager",
                          name: "managerChoice",
                          choices: managerList,
                        },
                      ])
                      .then((managerInput) => {
                        newEmployee.manager = managerInput.managerChoice;
                        queries.addEmployee(db, newEmployee);
                      });
                  });
                });
            });
          });
      } else if (data.action === "Update an Employee Role") {
        queries.updateEmployeeRole(db);
      } else if (data.action === "Quit") {
        process.exit();
      }
    })
    .then(() => {
      init();
    });
}

init();
