import { Dispatch, SetStateAction } from "react"
import { AdminViewEnum } from "../Models"
import { Button } from "primereact/button"

const getClassNames = (selectedView: AdminViewEnum, view: AdminViewEnum) => {
    return `border-2 border-primary hover:bg-primarylight ${
        selectedView === view ? "bg-primary" : "bg-transparent text-primary hover:text-white"
    }`
}

const AdminDashboardViewSelect: React.FC<{
    selectedView: AdminViewEnum
    setSelectedView: Dispatch<SetStateAction<AdminViewEnum>>
}> = ({ selectedView, setSelectedView }) => (
    <div className="grid grid-flow-row lg:grid-flow-col gap-4 lg:gap-20 transition-colors ease-in-out duration-300 mb-4 lg:mb-10">
        <Button
            className={getClassNames(selectedView, AdminViewEnum.USERS)}
            label="Users"
            onClick={() => setSelectedView(AdminViewEnum.USERS)}
        />
        <Button
            className={getClassNames(selectedView, AdminViewEnum.COMPETITIONS)}
            label="Competitions"
            onClick={() => setSelectedView(AdminViewEnum.COMPETITIONS)}
        />
        <Button
            className={getClassNames(selectedView, AdminViewEnum.PROBLEMS)}
            label="Problems"
            onClick={() => setSelectedView(AdminViewEnum.PROBLEMS)}
        />
    </div>
)

export default AdminDashboardViewSelect
