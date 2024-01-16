import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { getAllCompetitionsForOrganiser } from "../services/competition.service";
import useAuth from "../hooks/useAuth";
import { Button } from "primereact/button";
import { ProgressSpinner } from 'primereact/progressspinner';

const CompetitionsTable = () => {
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<any>([]);
  const [showActive, setShowActive] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await getAllCompetitionsForOrganiser(auth?.id);
        setCompetitions(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchCompetitions();
  }, []);

  const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No users found."
        )
    }

  const activeCompetitions = competitions.filter((competition: any) => {
    const currentDate = new Date();
    const startDate = new Date(competition.start_time);
    const endDate = new Date(competition.end_time);
    return startDate <= currentDate && currentDate <= endDate;
  });
  const progressSpinner = renderProgressSpinner();

  return (
      <>
        {progressSpinner}
        {!loading && (
          <DataTable 
            className="problems-table" 
            value={showActive ? activeCompetitions : competitions} 
            paginator 
            rows={10} 
            sortField="name" 
            sortOrder={1}
            footer={
              <div className="p-d-flex p-jc-end">
                <Button 
                  className={`${showActive ? 'button-active' : 'button-inactive'}`} 
                  label="Show Active Competitions" 
                  onClick={() => setShowActive(!showActive)} 
                />
              </div>
            }
          >
            <Column field="name" header="Name" sortable></Column>
            <Column field="description" header="Description"></Column>
            <Column field="start_time" header="Start Time" sortable></Column>
            <Column field="end_time" header="End Time" sortable></Column>
          </DataTable>
        )}
      </>
    );
};

export default CompetitionsTable;
