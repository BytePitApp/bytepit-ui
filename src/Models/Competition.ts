export default interface Competition {
    id: string,
    name: string,
    description: string,
    start_time: string,
    end_time: string,
    parent_id: string,
    problems: any[],
    trophies?: any[],
}
