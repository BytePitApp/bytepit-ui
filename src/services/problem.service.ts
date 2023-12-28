import requests from "../requests"


const createProblem = async (
	name: string,
	points: number,
	description: string,
	runtimeLimit: number,
	exampleInput: string,
	exampleOutput: string,
	isPrivate: boolean,
	isHidden: boolean,
	testFiles?: any[]
) => {
	const formData = new FormData()

	formData.append("name", name)
	formData.append("num_of_points", points.toString())
	formData.append("description", description)
	formData.append("runtime_limit", runtimeLimit.toString())
	formData.append("example_input", exampleInput)
	formData.append("example_output", exampleOutput)
	formData.append("is_private", isPrivate.toString())
	testFiles?.forEach((file) => {
		formData.append("test_files", file)
	})
	formData.append("is_hidden", isHidden.toString())

	const response = await requests.post("/problems", formData, {
		headers: {
			ContentType: "multipart/form-data",
		},
	})
	console.log(response)
	return response
}

const modifyProblem = async (
	problem_id: string,
	name: string,
	points: number,
	description: string,
	runtimeLimit: number,
	exampleInput: string,
	exampleOutput: string,
	isPrivate: boolean,
	isHidden: boolean,
	testFiles?: any[]
) => {
	const formData = new FormData()

	formData.append("name", name)
	formData.append("num_of_points", points.toString())
	formData.append("description", description)
	formData.append("runtime_limit", runtimeLimit.toString())
	formData.append("example_input", exampleInput)
	formData.append("example_output", exampleOutput)
	formData.append("is_private", isPrivate.toString())
	testFiles?.forEach((file) => {
		formData.append("test_files", file)
	})
	formData.append("is_hidden", isHidden.toString())

	const response = await requests.patch(`/problems/${problem_id}`, formData, {
		headers: {
			ContentType: "multipart/form-data",
		},
	})

	return response
}

export { createProblem, modifyProblem }
