import { FormDataCompetition } from "../Models"
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

const modifyCompetition = async (id: string, competition: FormDataCompetition, oldValue: FormDataCompetition) => {
    const formData = new FormData()
    if (competition.name && competition.name !== oldValue.name) { 
        formData.append("name", competition.name)
    }
    if (competition.description && competition.description !== oldValue.description) { 
        formData.append("description", competition.description)
    }
    if (competition.startTime && competition.startTime !== oldValue.startTime?.replace("T", " ")) { 
        formData.append("start_time", competition.startTime) 
    }
    if (competition.endTime && competition.endTime !== oldValue.endTime?.replace("T", " ")) { 
        formData.append("end_time", competition.endTime) 
    }
    if (competition.problems && competition.problems.length > 0) {
        let problemsChanged = false
        for (let i = 0; i < competition.problems.length; i++) {
            if (competition.problems[i] !== oldValue.problems[i]) {
                problemsChanged = true
                break
            }
        }
        if (problemsChanged) {
            for (let i = 0; i < competition.problems.length; i++) {
                formData.append("problems", competition.problems[i])
            }
        }
    }
    if (competition.firstPlaceTrophyImage) {
        formData.append("first_place_trophy", competition.firstPlaceTrophyImage)
    }
    if (competition.secondPlaceTrophyImage) {
        formData.append("second_place_trophy", competition.secondPlaceTrophyImage)
    }
    if (competition.thirdPlaceTrophyImage) {
        formData.append("third_place_trophy", competition.thirdPlaceTrophyImage)
    }
    if (Array.from(formData.keys()).length === 0) {
        return null
    }
    const response = await requests.patch(`/competitions/${id}`, formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

const getAllCompetitions = async () => {
    const response = await requests("/competitions")
    return response
}

const getCompetition = async (competitionId: string) => {
    const response = await requests(`/competitions/${competitionId}`)
    return response
}

export { createCompetition, getAllCompetitions, modifyCompetition, getCompetition }
