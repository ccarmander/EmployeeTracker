const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const db = require(".");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    startScreen();
});

function startScreen() {
    inquirer.prompt({
        type: "list",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View departments",
            "View employees",
            "Update employee role",
            "QUIT"
        ],
        message: "Please choose an option",
        name: "option"
    })
        .then(function (result) {
            console.log("You entered: " + result.option);

            switch (result.option) {
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "View departments":
                    viewDepartments();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "Update employee role":
                    updateEmployee();
                    break;
                default:
                    quit();

            }
        })
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the new department?",
        name: "deptName"
    }).then(function (answer) {

        connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName], function (err, res) {
            if (err) throw err;
            console.table(res)
            startScreen()
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the name of the role?",
            name: "roleName"
        }, {
            type: "input",
            message: "What is the salary of this role?",
            name: "salaryTotal"
        }, {
            type: "input",
            message: "What is the department id number?",
            name: "deptID"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function (err, res) {
            if (err) throw err;
            console.log(res);
            startScreen();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the first name of the new Employee?",
            name: "employeeFirstName",
        }, {
            type: "input",
            message: "What's the last name of the new Employee?",
            name: "employeeLastName"
        }, {
            type: "input",
            message: "What is the new employee's ID number",
            name: "roleID"
        }, {
            type: "input",
            message: "What is the manager ID number?",
            name: "mangerID"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.employeeFirstName, answer.employeeLastName, answer.roleID, answer.mangerID], function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();
        });
    });
}

function updateEmployee() {
    let allEmp = [];
    connection.query("SELECT * FROM employee", function (err, answer) {
        // console.log(answer);
        for (let i = 0; i < answer.length; i++) {
            let employeeString =
                answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
            allEmp.push(employeeString);
        }
        // console.log(allEmp)

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "updateEmpRole",
                    message: "select employee to update role",
                    choices: allEmp
                },
                {
                    type: "list",
                    message: "select new role",
                    choices: ["manager", "employee"],
                    name: "newrole"
                }
            ])
            .then(function (answer) {
                console.log("about to update", answer);
                const idToUpdate = {};
                idToUpdate.employeeId = parseInt(answer.updateEmpRole.split(" ")[0]);
                if (answer.newrole === "Manager") {
                    idToUpdate.role_id = 1;
                } else if (answer.newrole === "Employee") {
                    idToUpdate.role_id = 2;
                }
                connection.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [idToUpdate.role_id, idToUpdate.employeeId],
                    function (err, data) {
                        startScreen();
                    }
                );
            });
    });
}

function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startScreen();
    });
}

function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startScreen();
    });
}

function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startScreen();
    });
}

function quit() {
    connection.end();
    process.exit();
}