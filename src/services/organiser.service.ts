import  requests  from "../requests";

const getOrganisersProblems = async (id : string) => {
    const response = await requests.get(`/organiser/${id}/problems`)
    return response
}

export { getOrganisersProblems }
