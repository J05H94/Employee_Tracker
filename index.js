const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require('mysql2');
const cTable = require('console.table');
let sql;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BingChillin!',
    database: 'tracker_db'
  });

function start(){
  inquirer.prompt([
    {
      type: "list",
      name: "options",
      message: "Which department would you like to view: ",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ])
  .then((answers) => {
    // all employees - returns a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to (needs join for title and salaries, and join for manager)
    // update employee - prompted to select an employee to update and their new role and this information is updated in the database
    switch (answers.options) {
      case "View all departments":
          viewDepartments()
        break;
      case "View all roles":
          viewRoles()
        break;
      case "View all employees":
          viewEmployees()
        break;
      case "Add a department":
          addDepartment();
        break;
      case "Add a role":
          addRole();
        break;
      case "Add an employee":
          addEmployee()
        break;
      case "Update an employee role":
          updateEmployee()
      default:
        console.log("No value found: ", answers);
    }
  });
};

function viewDepartments(){
  sql = `SELECT * FROM department`
  db.query(sql, (err, res) => {
    console.table(res)
  })
}

function viewRoles(){
  sql = `SELECT roles.title, roles.id, department.department_name, roles.salary 
  FROM roles 
  JOIN department ON roles.department_id = department.id;`
  db.query(sql, (err, res) => {
    console.table(res)
  })
}

function viewEmployees(){
  sql = `SELECT employee.id, employee.firstName, employee.lastName, roles.title, roles.salary, employee.manager_id 
  FROM employee
  JOIN roles ON employee.roles_id = roles.id 
  JOIN department ON roles.department_id = department.id;`
  db.query(sql, (err, res) => {
    console.table(res)
  })
}

function addDepartment(){
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What will this department be called: ",
    },
  ])
  .then((answers) => {
    console.log(answers)
    sql = `INSERT INTO department (department_name) 
    VALUES ("${answers.name}")`
    db.query(sql, (err, res) => {
      viewDepartments()
    })
  })
}

async function addRole(){
  let departmentArr = [];
  sql = `SELECT department_name FROM department`
  let deptList = await db.promise().query(sql);
  for(let i = 0; i < deptList[0].length; i++){
    departmentArr[i] = deptList[0][i].department_name;
  }
  // console.log(departmentArr);
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What will this roll be called: ",
    },
    {
      type: "input",
      name: "salary",
      message: "How much pay will this roll recive: ",
    },
    {
      type: "list",
      name: "department",
      message: "Which department will this roll be apart of: ",
      choices: departmentArr,
    },
  ])
  .then((answers) => {
    // console.log(answers)
    sql = `SELECT id FROM department WHERE department_name = '${answers.department}'`
    db.query(sql, (err, res) => {
      sql = `INSERT INTO roles (title, salary, department_id) 
      VALUES  ("${answers.title}", ${answers.salary}, ${res[0].id})`
      db.query(sql, (err, res) => {
        viewRoles()
      })
    })
  })
};

async function addEmployee(){
  let managerArr = [];
  sql = `SELECT firstName, lastName, employee.id FROM employee 
  JOIN roles ON employee.roles_id = roles.id 
  JOIN department ON roles.department_id = department.id
  WHERE department_name = 'Management';`
  let mngLst = await db.promise().query(sql);
  for(let i = 0; i < mngLst[0].length; i++){
    let name = mngLst[0][i].firstName + " " + mngLst[0][i].lastName
    managerArr[i] = {name, value: mngLst[0][i].id};
  }
  managerArr.push("None")

  let roleArr = [];
  sql = `SELECT title, id FROM roles;`
  let roleLst = await db.promise().query(sql);
  for(let i = 0; i < roleLst[0].length; i++){
    let name = roleLst[0][i].title;
    roleArr[i] = {name, value: roleLst[0][i].id};
  }

  inquirer.prompt([
    {
      type: "input",
      name: "fName",
      message: "What is the employees first name: ",
    },
    {
      type: "input",
      name: "lName",
      message: "What is the employees last name: ",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employees roll: ",
      choices: roleArr,
    },
    {
      type: "list",
      name: "manager",
      message: "Who will this employees report to, if any: ",
      choices: managerArr,
    },
  ])
  .then((answers) => {
    if(answers.manager == "None"){
      answers.manager = null;
    }
    let fName = answers.fName;
    let lName = answers.lName;
    sql = `SELECT id FROM roles WHERE title = '${answers.role}'`
    db.query(sql, (err, res) => {
      let roleID = res[0].id
      let mgrName = answers.manager.split(' ')
      sql = `SELECT id FROM employee WHERE firstName = '${mgrName[0]}'`
      db.query(sql, (err, res) => {
        let mgrID = res[0].id;
        sql = `INSERT INTO employee (firstName, lastName, roles_id, manager_id)
        VALUES  ("${fName}", "${lName}", ${roleID}, ${mgrID})`
        db.query(sql, (err, res) => {
          viewEmployees()
        })
      })      
    })
  })
}

async function updateEmployee(){
  let employeeArr = [];
  sql = `SELECT firstName, lastName, id FROM employee;`
  let list = await db.promise().query(sql);
  for(let i = 0; i < list[0].length; i++){
    let name = list[0][i].firstName + " " + list[0][i].lastName
    employeeArr[i] = {name, value: list[0][i].id};
  }
  // console.log(employeeArr)

  let roleArr = [];
  sql = `SELECT title, id FROM roles;`
  let roleLst = await db.promise().query(sql);
  for(let i = 0; i < roleLst[0].length; i++){
    let name = roleLst[0][i].title;
    roleArr[i] = {name, value: roleLst[0][i].id};
  }

  let managerArr = [];
  sql = `SELECT firstName, lastName, employee.id FROM employee 
  JOIN roles ON employee.roles_id = roles.id 
  JOIN department ON roles.department_id = department.id
  WHERE department_name = 'Management';`
  let mngLst = await db.promise().query(sql);
  for(let i = 0; i < mngLst[0].length; i++){
    let name = mngLst[0][i].firstName + " " + mngLst[0][i].lastName
    managerArr[i] = {name, value: mngLst[0][i].id};
  }
  managerArr.push("None")

  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Who is to be updated: ",
      choices: employeeArr,
    },
    {
      type: "input",
      name: "fName",
      message: "Update first name to (press enter to skip): ",
    },
    {
      type: "input",
      name: "lName",
      message: "Update last name to (press enter to skip): ",
    },
    {
      type: "list",
      name: "role",
      message: "Update role to: ",
      choices: roleArr,
    },
    {
      type: "list",
      name: "manager",
      message: "Update manager to: ",
      choices: managerArr,
    },
  ])
  .then((answers) => {
    console.log(answers)
    
    if(answers.manager == 'None'){
      answers.manager = null;
    }  
    
    sql = `UPDATE employee SET firstName = "${answers.fName}", lastName = "${answers.lName}", roles_id = ${answers.role}, manager_id = ${answers.manager}
    WHERE employee.id = ${answers.employee}`
    console.log(sql)
    db.query(sql, (err, res) => {
      console.log(res, err)
    })
  })
}

start();