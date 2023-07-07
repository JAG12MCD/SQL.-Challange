const {
	showPrompt,
	choices,
	handleAddDepartment,
	handleAddRole,
	handleAddEmployee,
	handleUpdateEmployeeRole,
} = require('./inquirer');
const Db = require('./db');
const CMS = require('./cms');

const main = async () => {
	// create db
	const db = new Db();
	await db.createConnection();
	await db.createTables();

	// create cms object
	const cms = new CMS(db);

	while (true) {
		const choice = await showPrompt();

		if (choice === choices.VIEW_DEPARTMENT_ALL) {
			await cms.viewAllDepartments();
		} else if (choice === choices.VIEW_ROLES_ALL) {
			await cms.viewAllRoles();
		} else if (choice === choices.VIEW_EMPLOYEES_ALL) {
			await cms.viewAllEmployees();
		} else if (choice === choices.ADD_DEPARTMENT) {
			const department = await handleAddDepartment();
			await cms.addDepartment(department);
		} else if (choice === choices.ADD_ROLE) {
			const departments = await db.getAllDepartments();
			const { departmentId, roleName, salary } = await handleAddRole(
				departments
			);
			await cms.addRole(roleName, salary, departmentId);
		} else if (choice === choices.ADD_EMPLOYEE) {
			const roles = await db.getAllRoles();
			const managers = await db.getAllEmployees();
			const { firstName, lastName, roleId, managerId } =
				await handleUpdateEmployeeRole(roles, managers);
			await cms.addEmployee(firstName, lastName, roleId, managerId);
		} else if (choice === choices.UPDATE_EMPLOYEE_ROLE) {
			const { employeeId, roleId } = await handleUpdateEmployeeRole(
				await db.getAllEmployees(),
				await db.getAllRoles()
			);
			await cms.updateEmployeeRole(employeeId, roleId);
		} else {
			break;
		}
	}
};

(async () => {
	await main();
})();
