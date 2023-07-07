const inquirer = require('inquirer');

const choices = {
	VIEW_DEPARTMENT_ALL: 'View all departments',
	VIEW_ROLES_ALL: 'View all roles',
	VIEW_EMPLOYEES_ALL: 'View all employees',
	ADD_DEPARTMENT: 'Add a department',
	ADD_ROLE: 'Add a role',
	ADD_EMPLOYEE: 'Add an employee',
	UPDATE_EMPLOYEE_ROLE: "Update employee role",
	QUIT: "Quit"
};

const showPrompt = async () => {
	const { choice } = await inquirer.prompt([
		{
			type: 'list',
			name: 'choice',
			message: 'What would you like to do?',
			choices: Object.values(choices),
		},
	]);
	return Promise.resolve(choice);
};

const handleAddDepartment = async () => {
	const { departmentName } = await inquirer.prompt([
		{
			type: 'input',
			name: 'departmentName',
			message: 'What is the name of the department?',
		},
	]);
	return departmentName;
};

const handleAddRole = async (departments) => {
	const departmentNames = [];
	for (const d of departments) {
		departmentNames.push(d.name);
	}
	const { roleName, salary, departmentName } = await inquirer.prompt([
		{
			type: 'input',
			name: 'roleName',
			message: 'What is the name of the role?',
		},
		{
			type: 'input',
			name: 'salary',
			message: 'What is the salary of the role?',
		},
		{
			type: 'list',
			name: 'departmentName',
			message: 'Which department does the role belong to?',
			choices: departmentNames,
		},
	]);
	const departmentId = departments.find(
		(department) => department.name === departmentName
	)['id'];
	return { departmentId, roleName, salary };
};

const handleAddEmployee = async (roles, managers) => {
	const roleTitles = roles.map((role) => role.title);
	const managerNames = managers.map(
		(manager) => manager.first_name + ' ' + manager.last_name
	);

	managerNames.splice(0, 0, 'None');

	const questions = [
		{
			type: 'input',
			name: 'firstName',
			message: `What is the employee's first name?`,
		},
		{
			type: 'input',
			name: 'lastName',
			message: `What is the employee's last name?`,
		},
		{
			type: 'list',
			name: 'roleTitle',
			message: `What is the employee's role?`,
			choices: roleTitles,
		},
		{
			type: 'list',
			name: 'managerName',
			message: `What is the employee's manager?`,
			choices: managerNames,
		},
	];

	const { firstName, lastName, roleTitle, managerName } =
		await inquirer.prompt(questions);

	let managerId = null;
	if (managerName != 'None') {
		const [managerFirstName, managerLastName] = managerName.split(' ');

		managerId = managers.find(
			(manager) =>
				manager.first_name == managerFirstName &&
				manager.last_name === managerLastName
		)['id'];
	}
	const roleId = roles.find((role) => role.title === roleTitle)['id'];
	return { managerId, roleId, firstName, lastName };
};

const handleUpdateEmployeeRole = async (employees, roles) => {
	const roleTitles = roles.map((role) => role.title);
	const employeeNames = employees.map(
		(employee) => employee.first_name + ' ' + employee.last_name
	);

	const questions = [
		{
			type: 'list',
			name: 'employeeName',
			message: `Which employee's role do you want to update?`,
			choices: employeeNames,
		},
		{
			type: 'list',
			name: 'roleTitle',
			message: `Which role do you want to assign the selected employee?`,
			choices: roleTitles,
		},
	];

	const { employeeName, roleTitle } = await inquirer.prompt(questions);

	const [employeeFirstName, employeeLastName] = employeeName.split(' ');

	employeeId = employees.find(
		(employee) =>
			employee.first_name == employeeFirstName &&
			employee.last_name === employeeLastName
	)['id'];
	const roleId = roles.find((role) => role.title === roleTitle)['id'];
	return { employeeId, roleId };
};

module.exports = {
	showPrompt,
	choices,
	handleAddDepartment,
	handleAddRole,
	handleAddEmployee,
	handleUpdateEmployeeRole,
};
