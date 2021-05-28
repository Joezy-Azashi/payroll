export const ConvertedEmployees = (data = []) => {
	const employeeConverted = [];

	data.forEach((emp) => {
		employeeConverted.push({ label: `${emp.lastName + " " + emp.firstName + " "}` + `${(emp.middleName === null ? "" : emp.middleName)}`, value: emp.employeeId, employeeNumber: emp.employeeNumber });
	});

	return employeeConverted;
};

