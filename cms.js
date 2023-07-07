require('console.table');

module.exports = class CMS {
	constructor(db) {
		this.db = db;
	}

	async viewAllDepartments() {
		const departments = await this.db.getAllDepartments();
		console.table(departments);
		return;
	}

	async viewAllRoles() {
		const roles = await this.db.getAllRoles();
		console.table(roles);
		return;
	}

	async viewAllEmployees() {
		const employees = await this.db.getAllEmployees();
		console.table(employees);
		return;
	}

	async addDepartment(department) {
		await this.db.addDepartment(department);
		return;
	}

	async addRole(roleName, salary, departmentId) {
		await this.db.addRole(roleName, salary, departmentId);
		return;
	}

	async addEmployee(firstName, lastName, roleId, managerId) {
		await this.db.addEmployee(firstName, lastName, roleId, managerId);
		return;
	}

	async updateEmployeeRole(employeeId, roleId){
		await this.db.updateEmployeeRole(employeeId, roleId);
		return;
	}
};
