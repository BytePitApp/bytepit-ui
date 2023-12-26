import requests from "../requests"

const createCompetition = async (
    name: string,
    description: string,
    startTime: string,
    endTime: string,
    problems: string[],
    firstPlaceTrophy: any | undefined,
    secondPlaceTrophy: any | undefined,
    thirdPlaceTrophy: any | undefined
) => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("start_time", startTime)
    formData.append("end_time", endTime)
    for (let i = 0; i < problems.length; i++) {
        formData.append("problems", problems[i])
    }
    if (firstPlaceTrophy) {
        formData.append("first_place_trophy", firstPlaceTrophy)
    }
    if (secondPlaceTrophy) {
        formData.append("second_place_trophy", secondPlaceTrophy)
    }
    if (thirdPlaceTrophy) {
        formData.append("third_place_trophy", thirdPlaceTrophy)
    }

    const response = await requests.post("/competitions", formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

export { createCompetition }
