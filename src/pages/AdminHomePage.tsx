import { Navbar } from "../components"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useCallback, useEffect, useState } from "react"
import { Button } from "primereact/button"
import { FilterMatchMode } from "primereact/api"
import { TriStateCheckbox } from "primereact/tristatecheckbox"
import { classNames } from "primereact/utils"
import { Dropdown } from "primereact/dropdown"
import { Avatar } from "primereact/avatar"
import { ProgressSpinner } from "primereact/progressspinner"
import "./AdminHomePage.css"
import { getAllUsers, confirmOrganiser, changeUserRole } from "../services/admin.service"

const AdminHomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const [users, setUsers] = useState<any>([])
    const filters = {
        approved_by_admin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true); 
            const response = await getAllUsers();
            setUsers(response.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong");
        }
    }, []);

    const updateOrganiser = useCallback(async (username: string) => {
        try {
            await confirmOrganiser(username)
            const response = await getAllUsers()
            setUsers(response.data)
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [])

    const changeUserRoleHandler = useCallback(async (username: string, newRole: string) => {
        try {
            await changeUserRole(username, newRole)
            fetchUsers()
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

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
    const approvedBodyTemplate = (rowData: any) => {
        return (
            <i
                className={classNames("pi", {
                    "true-icon pi-check-circle text-green-500": rowData.approved_by_admin,
                    "false-icon pi-times-circle text-red-400": !rowData.approved_by_admin,
                })}
            ></i>
        )
    }

    const verifiedBodyTemplate = (rowData: any) => {
        return (
            <i
                className={classNames("pi", {
                    "true-icon pi-check-circle text-green-500": rowData.is_verified,
                    "false-icon pi-times-circle text-red-400": !rowData.is_verified,
                })}
            ></i>
        )
    }

    const approveButtonBodyTemplate = (rowData: any): React.ReactNode => {
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
                    onClick={() => {
                        updateOrganiser(rowData.username)
                    }}
                />
            )
        }
    }

    const imageBodyTemplate = (rowData: any): React.ReactNode => {
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

    const roleBodyTemplate = (rowData: any): React.ReactNode => {
        const roles = [
            { label: "Organiser", value: "organiser" },
            { label: "Admin", value: "admin" },
            { label: "Contestant", value: "contestant" },
        ]

        return (
            <Dropdown
                className="h-7 w-full"
                value={rowData.role}
                options={roles}
                onChange={(e) => changeUserRoleHandler(rowData.username, e.value)}
                pt={{ input: { className: "text-xs p-1.5" }, list: { className: "text-xs" } }}
            />
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between px-2">
                <h2 className="text-2xl text-primary">Users List</h2>
            </div>
        )
    }

    const header = renderHeader()
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchUsers} />
    const paginatorRight = <Button type="button" className="hidden" />

    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <DataTable
                className="mt-[5%] mx-[5%] text-[2vh]"
                value={users}
                paginator
                rows={10}
                size={"small"}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
                filters={filters}
                filterDisplay="menu"
                showGridlines={true}
                stripedRows
                sortField="name"
                sortOrder={1}
                emptyMessage={
                    loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55px' }}>
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                        </div>
                    ) : (
                        "No users found."
                    )
                }
                header={header}
                paginatorClassName="rounded-b-[0.6rem] border-graydark"
                pt={{
                    root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                    header: { className: "rounded-t-[0.6rem]" },
                    rowGroupHeader: { className: "text-xs" },
                    // +: { className: "p-0" },
                }}
                cellClassName={(data) => "p-1"}
            >
                <Column
                    field="image"
                    headerClassName="centered-column-header text-sm"
                    body={imageBodyTemplate}
                    style={{ maxWidth: "2.5rem" }}
                ></Column>
                <Column field="username" sortable header="Username" headerClassName="text-sm"></Column>
                <Column field="name" sortable header="Name" headerClassName="text-sm"></Column>
                <Column field="surname" sortable header="Surname" headerClassName="text-sm"></Column>
                <Column field="email" sortable header="Email" headerClassName="text-sm"></Column>
                <Column
                    field="is_verified"
                    header="Verified"
                    body={verifiedBodyTemplate}
                    style={{ maxWidth: "4rem", textAlign: "center" }}
                    headerClassName="centered-column-header text-sm"
                ></Column>
                <Column
                    field="role"
                    header="Role"
                    dataType="boolean"
                    body={roleBodyTemplate}
                    style={{ maxWidth: "8rem" }}
                ></Column>
                <Column
                    field="approved_by_admin"
                    header="Approved"
                    filter
                    body={approvedBodyTemplate}
                    filterElement={approvedFilterTemplate}
                    style={{ maxWidth: "5.5rem", textAlign: "center" }}
                    showFilterMatchModes={false}
                    headerClassName="centered-column-header text-sm"
                ></Column>
                <Column
                    field="approve"
                    header="Approve"
                    body={approveButtonBodyTemplate}
                    style={{ textAlign: "center", maxWidth: "5rem" }}
                    headerClassName="centered-column-header text-sm"
                ></Column>
            </DataTable>
        </div>
    )
}

export default AdminHomePage
