import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { getAllProblems } from "../services/problem.service";
import { Button } from "primereact/button";

const ProblemsTable = () => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<any>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await getAllProblems();
        setProblems(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  const hiddenProblems = problems.filter((problem: any) => problem.is_hidden);
  const privateProblems = problems.filter((problem: any) => problem.is_private);

  return (
      <DataTable 
        className="problems-table" 
        value={(showHidden ? hiddenProblems : showPrivate ? privateProblems : problems)} 
        paginator 
        rows={10} 
        sortField="name" 
        sortOrder={1}
        footer={
          <div className="flex justify-center gap-[10px]">
            <Button 
              className={`p-mr-2 ${showHidden ? 'button-active' : 'button-inactive'}`} 
              label="Show Hidden Problems" 
              onClick={() => {
                setShowHidden(!showHidden);
                if (showPrivate) {
                  setShowPrivate(false);
                }
              }} 
            />
            <Button 
              className={`${showPrivate ? 'button-active' : 'button-inactive'}`} 
              label="Show Private Problems" 
              onClick={() => {
                setShowPrivate(!showPrivate);
                if (showHidden) {
                  setShowHidden(false);
                }
              }} 
            />
          </div>
        }
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="description" header="Description"></Column>
        <Column field="num_of_points" header="Points" sortable></Column>
        <Column field="created_on" header="Created Date" sortable></Column>
      </DataTable>
    );
};

export default ProblemsTable;
