DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL NOT NULL,
 department_id INT,
 FOREIGN KEY (department_id)
 REFERENCES department(id)
--  ON DELETE SET NULL
);

CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 firstName VARCHAR(30) NOT NULL,
 lastName VARCHAR(30) NOT NULL,
 roles_id INT NOT NULL,
 manager_id INT,
 FOREIGN KEY (roles_id)
 REFERENCES roles(id)
--  ON DELETE SET NULL
);

-- employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers