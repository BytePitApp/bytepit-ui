import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { User } from "../Models"
import { Button } from "primereact/button"
import { FilterMatchMode } from "primereact/api"
import { ProgressSpinner } from "primereact/progressspinner"
import { Avatar } from "primereact/avatar"
import { Dropdown } from "primereact/dropdown"
import { TriStateCheckbox } from "primereact/tristatecheckbox"
import "../pages/AdminHomePage.css"

interface Props {
    users: User[]
    loading: boolean
    paginatorLeftFunction: () => any
    changeUserRoleHandler: (username: string, role: string) => any
    updateOrganiser: (username: string) => any
}

const UsersDataTable = ({ users, loading, paginatorLeftFunction, changeUserRoleHandler, updateOrganiser }: Props) => {
    const filters = { approved_by_admin: { value: null, matchMode: FilterMatchMode.CONTAINS } }

    const paginatorLeft = () => {
        return <Button icon="pi pi-refresh" text={true} onClick={paginatorLeftFunction} />
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            <p>No users found.</p>
        )
    }

    const imageBodyTemplate = (rowData: User): React.ReactNode => {
        if (rowData.image) {
            return (
                <div className="flex flex-col items-center">
                    <Avatar
                        className="transition-color ease-in-out duration-300 cursor-pointer hover:scale-105"
                        image={`data:image/jpeg;base64,${rowData.image}`}
                        size="normal"
                        pt={{ image: { className: "rounded-lg object-cover" } }}
                    />
                </div>
            )
        } else {
            return (
                <div className="flex flex-col items-center">
                    <Avatar
                        className="bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                        icon="pi pi-user"
                        size="normal"
                    />
                </div>
            )
        }
    }

    const booleanBodyTemplate = (value: boolean) => {
        return (
            <i
                className={
                    value ? "pi true-icon pi-check-circle text-green-500" : "pi false-icon pi-times-circle text-red-400"
                }
            ></i>
        )
    }

    const roleBodyTemplate = (rowData: User): React.ReactNode => {
        const roles = [
            { label: "Organiser", value: "organiser" },
            { label: "Admin", value: "admin" },
            { label: "Contestant", value: "contestant" },
        ]
        return (
            <Dropdown
                className="h-full w-full"
                value={rowData.role}
                options={roles}
                onChange={(e) => changeUserRoleHandler(rowData.username, e.value)}
                pt={{ input: { className: "p-1.5" }, list: { className: "text-xs" } }}
            />
        )
    }

    const approvedFilterTemplate = (options: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="approved-filter" className="font-bold">
                    Approved
                </label>
                <TriStateCheckbox
                    id="approved-filter"
                    value={options.value}
                    onChange={(e) => options.filterCallback(e.value)}
                />
            </div>
        )
    }

    const approveButtonBodyTemplate = (rowData: User): React.ReactNode => {
        if (rowData.approved_by_admin) {
            return (
                <Button
                    type="button"
                    icon="pi pi-check"
                    className="p-button-success p-0.5 bg-green-200 border-green-200"
                    disabled
                />
            )
        } else {
            return (
                <Button
                    type="button"
                    icon="pi pi-check"
                    className="p-button-success p-0.5 hover:scale-[103%] transition-all ease-in-out duration-300"
                    onClick={() => updateOrganiser(rowData.username)}
                />
            )
        }
    }

    return (
        <DataTable
            className="text-[1.5vh]"
            value={users}
            paginator
            rows={5}
            size={"small"}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            paginatorLeft={paginatorLeft()}
            paginatorRight={<div></div>}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            filters={filters}
            filterDisplay="menu"
            showGridlines={true}
            stripedRows
            sortField="name"
            sortOrder={1}
            emptyMessage={renderProgressSpinner()}
            header={<h2 className="px-2 text-2xl text-primary">Users List</h2>}
            paginatorClassName="rounded-b-[0.6rem] border-graydark"
            pt={{
                root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                header: { className: "rounded-t-[0.6rem]" },
                rowGroupHeader: { className: "text-xs" },
            }}
            cellClassName={() => "p-1"}
        >
            <Column field="image" body={imageBodyTemplate} style={{ maxWidth: "2.5rem" }} />
            <Column field="username" sortable header="Username" />
            <Column field="name" sortable header="Name" />
            <Column field="surname" sortable header="Surname" />
            <Column field="email" sortable header="Email" />
            <Column
                field="is_verified"
                header="Verified"
                body={(rowData: User) => booleanBodyTemplate(rowData.is_verified)}
                style={{ maxWidth: "4rem", textAlign: "center" }}
            />
            <Column
                field="role"
                header="Role"
                dataType="boolean"
                body={roleBodyTemplate}
                style={{ maxWidth: "8rem" }}
            />
            <Column
                field="approved_by_admin"
                header="Approved"
                filter
                pt={{
                    filterMenuButton: { className: "h-full" },
                }}
                body={(rowData: User) => booleanBodyTemplate(rowData.approved_by_admin)}
                filterElement={approvedFilterTemplate}
                style={{ maxWidth: "5.5rem", textAlign: "center" }}
                showFilterMatchModes={false}
            />
            <Column
                field="approve"
                header="Approve"
                body={approveButtonBodyTemplate}
                style={{ textAlign: "center", maxWidth: "5rem" }}
            />
        </DataTable>
    )
}

export default UsersDataTable
