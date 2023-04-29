const mysql = require("mysql2");
const inquirer = require("inquirer");
const queries = require("./lib/queries.js");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "employee_db",
  },
);

class Role {
  constructor(title, salary, department) {
    this.title = title;
    this.salary = salary;
    this.department = department;
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
            const newRole = new Role(input.job_title, input.salary,);
            db.query("SELECT * FROM department", function (err, result) {
              var departmentList = result.map(({ name, id }) => ({
                name: name,
                value: id,
              }));

              inquirer.prompt([
                {
                  type: "list",
                  message: "Select the role's department",
                  name: "depChoice",
                  choices: departmentList,
                },
              ])
              .then((data) => {
                newRole.department = data.depChoice;
                queries.addRole(db,newRole);
              });
            });
          });
      } else if (data.action === "Add an Employee") {
        queries.addEmployee(db);
      } else if (data.action === "Update an Employee Role") {
        queries.updateEmployeeRole(db);
      } else if (data.action === "Quit") {
        process.exit();
      }
    });
}

var departmentList;

init();
