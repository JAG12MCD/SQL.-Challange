const mysql = require('mysql2/promise');
const { dbConfig } = require('./config');

module.exports = class Db {
	constructor() {
		this.connection = null;
	}

	async createConnection() {
		this.connection = await mysql.createConnection(dbConfig);
	}

	async createTables() {
		try {
			// Check if the tables exist
			const [departmentTable] = await this.connection.execute(
				"SHOW TABLES LIKE 'department'"
			);
			const [roleTable] = await this.connection.execute(
				"SHOW TABLES LIKE 'role'"
			);
			const [employeeTable] = await this.connection.execute(
				"SHOW TABLES LIKE 'employee'"
			);

			if (
				departmentTable.length === 0 ||
				roleTable.length === 0 ||
				employeeTable.length === 0
			) {
				// Create the tables based on the given schema
				await this.connection.execute(`
              CREATE TABLE IF NOT EXISTS department (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(30)
              )
            `);

				await this.connection.execute(`
              CREATE TABLE IF NOT EXISTS role (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(30),
                salary DECIMAL,
                department_id INT,
                FOREIGN KEY (department_id) REFERENCES department(id)
              )
            `);

				await this.connection.execute(`
              CREATE TABLE IF NOT EXISTS employee (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(30),
                last_name VARCHAR(30),
                role_id INT,
                manager_id INT,
                FOREIGN KEY (role_id) REFERENCES role(id),
                FOREIGN KEY (manager_id) REFERENCES employee(id)
              )
            `);

				console.log('Tables created successfully.');
			} else {
				console.log('Tables already exist.');
			}
		} catch (error) {
			console.error('Error creating tables:', error);
		}
	}

	async addDepartment(name) {
		try {
			const [result] = await this.connection.execute(
				'INSERT INTO department (name) VALUES (?)',
				[name]
			);
			console.log(`Department added with ID: ${result.insertId}`);
		} catch (error) {
			console.error('Error executing query:', error);
		}
	}

	async addRole(title, salary, departmentId) {
		try {
			const [result] = await this.connection.execute(
				'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
				[title, salary, departmentId]
			);
			console.log(`Role added with ID: ${result.insertId}`);
		} catch (error) {
			console.error('Error executing query:', error);
		}
	}

	async addEmployee(firstName, lastName, roleId, managerId) {
		try {
			const [result] = await this.connection.execute(
				'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
				[firstName, lastName, roleId, managerId]
			);
			console.log(`Employee added with ID: ${result.insertId}`);
		} catch (error) {
			console.error('Error executing query:', error);
		}
	}

	async getAllDepartments() {
		try {
			const [results] = await this.connection.execute(
				'SELECT * FROM department'
			);
			return results;
		} catch (error) {
			console.error('Error executing query:', error);
			return [];
		}
	}

	async getAllRoles() {
		try {
			const [results] = await this.connection.execute(
				`SELECT r.id as id, r.title as title, r.salary as salary, d.name as department  FROM role r
				LEFT JOIN department d ON r.id = d.id`
			);
			return results;
		} catch (error) {
			console.error('Error executing query:', error);
			return [];
		}
	}

	async getAllEmployees() {
		try {
			const query = `
			SELECT
			  e.id AS 'id',
			  e.first_name AS 'first_name',
			  e.last_name AS 'last_name',
			  r.title AS 'title',
			  r.salary AS 'salary',
			  CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
			FROM
			  employee e
			  INNER JOIN role r ON e.role_id = r.id
			  LEFT JOIN employee m ON e.manager_id = m.id
		  `;

			const [results] = await this.connection.execute(query);
			return results;
		} catch (error) {
			console.error('Error executing query:', error);
			return [];
		}
	}

	async updateEmployeeRole(employeeId, roleId) {
		try {
			const [result] = await this.connection.execute(
				'UPDATE employee SET role_id = ? WHERE id = ?',
				[roleId, employeeId]
			);
			console.log(`Employee role updated for ID: ${employeeId}`);
		} catch (error) {
			console.error('Error executing query:', error);
		}
	}
};
