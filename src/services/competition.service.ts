import { ModifyCompetition, CreateCompetition, Competition } from "../Models"
import requests from "../requests"

const createCompetition = async (competition: CreateCompetition) => {
    const formData = new FormData()
    formData.append("name", competition.name)
    formData.append("description", competition.description)
    formData.append("start_time", competition.startTime)
    formData.append("end_time", competition.endTime)
    for (let i = 0; i < competition.problems.length; i++) {
        formData.append("problems", competition.problems[i])
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

    const response = await requests.post("/competitions", formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

const modifyCompetition = async (id: string, competition: ModifyCompetition, oldValue: ModifyCompetition) => {
    const formData = new FormData()
    if (competition.name !== oldValue.name) {
        formData.append("name", competition.name)
    }
    if (competition.description !== oldValue.description) {
        formData.append("description", competition.description)
    }
    if (competition.startTime.replace("T", " ") !== oldValue.startTime.replace("T", " ")) {
        formData.append("start_time", competition.startTime)
    }
    if (competition.endTime.replace("T", " ") !== oldValue.endTime.replace("T", " ")) {
        formData.append("end_time", competition.endTime)
    }
    if (competition.problems.length > 0) {
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

const getAllCompetitionsForOrganiser = async (organiserId?: string, trophies: boolean = false) => {
    const response = await requests.get(`/competitions/competitions-by-organiser/${organiserId}?trophies=${trophies}`)
    return response
}

const getCompetition = async (competitionId: string) => {
    const response = await requests.get(`/competitions/${competitionId}`)
    return response
}

const createVirtualCompetition = async (competitionId: string) => {
    const response = await requests.post("/competitions/virtual", undefined, {
        params: { parent_competition_id: competitionId },
    })
    return response
}

const getRandomCompetition = async () => {
    const response = await requests.get("/competitions/random")
    return response
}

const getAllCompetitions = async (trophies: boolean = false) => {
    const response = await requests.get(`/competitions?trophies=${trophies}`)
    return response
}

const getCompetitionResults = async (competitionId: string) => {
    const response = await requests(`/competitions/${competitionId}/results`)
    return response
}

const getVirtualCompetitionResults = async (competitionId: string) => {
    const response = await requests(`/competitions/virtual/${competitionId}/results`)
    return response
}

export {
    createCompetition,
    getAllCompetitionsForOrganiser,
    modifyCompetition,
    getCompetition,
    getAllCompetitions,
    createVirtualCompetition,
    getRandomCompetition,
    getCompetitionResults,
    getVirtualCompetitionResults,
}
