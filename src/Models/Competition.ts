export default interface Competition {
    id: string,
    name: string,
    description: string,
    start_time: string,
    end_time: string,
    parent_id: string,
    organiser_id: string,
    problems: any[],
    trophies?: any[],
}
