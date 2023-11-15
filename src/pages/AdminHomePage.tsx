import { Navbar } from "../components"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ProgressSpinner } from "primereact/progressspinner"
import requests from "../requests"
import { useCallback, useEffect, useState } from "react"
import { Button } from "primereact/button"
import { FilterMatchMode } from "primereact/api"
import { TriStateCheckbox } from "primereact/tristatecheckbox"
import { classNames } from "primereact/utils"
import { Dropdown } from "primereact/dropdown"
import "./AdminHomePage.css"

const AdminHomePage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [users, setUsers] = useState<any>([])
    const [filters, setFilters] = useState({
        approved_by_admin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const fetchUsers = useCallback(async () => {
        await requests
            .get("/admin/list-users", {
                withCredentials: true,
            })
            .then((res) => {
                setUsers(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [])

    const updateOrganiser = useCallback(async (username: any) => {
        await requests
            .post(`/admin/confirm-organiser/${username}`)
            .then(() => {
                fetchUsers()
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [])

    const changeUserRole = useCallback(async (username: string, role: string) => {
        await requests
            .post(`/admin/change-role/${username}/${role}`)
            .then(() => {
                fetchUsers()
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [])

    const verifiedFilterTemplate = (options: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    Verified
                </label>
                <TriStateCheckbox id="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        )
    }
    const approvedBodyTemplate = (rowData: any) => {
        return (
            <i
                className={classNames("pi", {
                    "true-icon pi-check-circle text-green-500": rowData.approved_by_admin,
                    "false-icon pi-times-circle text-red-400": !rowData.approved_by_admin,
                })}></i>
        )
    }

    const verifiedBodyTemplate = (rowData: any) => {
        return (
            <i
                className={classNames("pi", {
                    "true-icon pi-check-circle text-green-500": rowData.is_verified,
                    "false-icon pi-times-circle text-red-400": !rowData.is_verified,
                })}></i>
        )
    }

    const approveButtonBodyTemplate = (rowData: any): React.ReactNode => {
        if (rowData.approved_by_admin) {
            return <Button type="button" icon="pi pi-check" className="p-button-success p-0.5 bg-green-200 border-green-200" disabled />
        } else {
            return (
                <Button
                    type="button"
                    icon="pi pi-check"
                    className="p-button-success p-0.5"
                    onClick={() => {
                        updateOrganiser(rowData.username)
                    }}
                />
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
                className="h-11 text-xs w-40"
                value={rowData.role}
                options={roles}
                onChange={(e) => changeUserRole(rowData.username, e.value)}></Dropdown>
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h1 className="text-2xl">Users List</h1>
            </div>
        )
    }

    const header = renderHeader()
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchUsers} />
    const paginatorRight = <Button type="button" className="hidden" />

    return (
        <div>
            <Navbar />
            <div className="p-2">
                {loading ? (
                    <ProgressSpinner />
                ) : (
                    <DataTable
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
                        className="my-10 mx-32"
                        stripedRows
                        sortField="name"
                        sortOrder={1}
                        emptyMessage="No users found."
                        header={header}>
                        <Column field="username" sortable header="Username"></Column>
                        <Column field="name" sortable header="Name"></Column>
                        <Column field="surname" sortable header="Surname"></Column>
                        <Column field="email" sortable header="Email"></Column>
                        <Column
                            field="is_verified"
                            header="Verified Email"
                            body={verifiedBodyTemplate}
                            style={{ maxWidth: "8rem", textAlign: "center" }}
                            headerClassName="centered-column-header"></Column>
                        <Column field="role" header="Role" dataType="boolean" body={roleBodyTemplate}></Column>
                        <Column
                            field="approved_by_admin"
                            header="Approved By Admin"
                            filter
                            body={approvedBodyTemplate}
                            filterElement={verifiedFilterTemplate}
                            style={{ maxWidth: "8rem", textAlign: "center" }}
                            showFilterMatchModes={false}
                            headerClassName="centered-column-header"></Column>
                        <Column
                            field="approve"
                            header="Approve"
                            body={approveButtonBodyTemplate}
                            style={{ textAlign: "center" }}
                            headerClassName="centered-column-header"></Column>
                    </DataTable>
                )}
            </div>
        </div>
    )
}

export default AdminHomePage
