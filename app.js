import unirest from 'unirest';

const url = process.env.TEST_SIMPLICITE_URL;
console.log(`URL: ${url}`);
const username = process.env.TEST_SIMPLICITE_ADMIN_USERNAME;
console.log(`Username: ${username}`);
const password = process.env.TEST_SIMPLICITE_ADMIN_PASSWORD;
const debug = false;

const headers = { 'Accept': 'application/json' };

(async () => {
	try {
		let res = await unirest.get(`${url}/health?_output=json`).headers(headers);
		if (debug) console.log(res.body);
		console.info(`Health check status: ${res.body.platform.status}`);

		res = await unirest.get(`${url}/api/login?_output=json`).headers(headers).auth(username, password);
		if (debug) console.log(res.body);
		headers['Authorization'] = `Bearer ${res.body.authtoken}`;
		console.log(`Hello ${res.body.login}`);

		res = await unirest.get(`${url}/api/rest/SystemParam`).query({ sys_code: 'VERSION' }).headers(headers);
		if (debug) console.log(res.body);
		console.log(`Version: ${res.body[0].sys_value}`);

		res = await unirest.get(`${url}/api/rest/Module`).query({ mdl_name: 'Application' }).headers(headers);
		if (debug) console.log(res.body);
		const mdlId = res.body[0].row_id;
		console.log(`Application module ID: ${mdlId}`);

		res = await unirest.post(`${url}/api/rest/SystemParam`).query({ sys_code: `TEST-${new Date().getTime()}`, sys_value: 'Test', row_module_id: mdlId }).headers(headers);
		if (debug) console.log(res.body);
		if (res.body.error) throw new Error(res.body.error);
		const sysId = res.body.row_id;
		console.log(`Created system param with ID: ${sysId} = ${res.body.sys_code} = ${res.body.sys_value}`);

		res = await unirest.get(`${url}/api/rest/SystemParam/${sysId}`).headers(headers);
		if (debug) console.log(res.body);
		console.log(`Get system parameter after create: ${res.body.sys_code} = ${res.body.sys_value}`);

		res = await unirest.put(`${url}/api/rest/SystemParam/${sysId}`).query({ sys_value: 'Test (updated)' }).headers(headers);;
		if (debug) console.log(res.body);
		console.log(`Updated system parameter: ${res.body.sys_code} = ${res.body.sys_value}`);

		res = await unirest.get(`${url}/api/rest/SystemParam/${sysId}`).headers(headers);
		if (debug) console.log(res.body);
		console.log(`Get system parameter after update: ${res.body.sys_code} = ${res.body.sys_value}`);

		res = await unirest.delete(`${url}/api/rest/SystemParam/${sysId}`).headers(headers);
		if (debug) console.log(res.body);
		console.log(`Deleted system parameter for ID: ${res.body.row_id}`);

		res = await unirest.get(`${url}/api/logout?_output=json`).headers(headers);
		if (debug) console.log(res.body);
		delete headers['Authorization'];
		console.log(`Bye ${res.body.login}`);
	} catch (err) {
		console.error(err);
	}
})();

