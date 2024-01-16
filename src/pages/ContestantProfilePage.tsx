import { Navbar, UserInfo } from "../components";
import useAuth from "../hooks/useAuth";
import { Avatar } from "primereact/avatar";
import { getCurrentUsersStatistics } from "../services/users.service";
import { useEffect, useState } from "react";
import { UserStatistics } from "../Models";
import { useCallback } from "react";
import { StatisticsChart } from "../components";
import { RankBarChart } from "../components";
import {UserTrophies} from "../components";
import { ProgressSpinner } from "primereact/progressspinner";

const ContestantProfilePage = () => {
    const { auth } = useAuth()
    const[loading, setLoading] = useState(true)
    const[statistics, setStatistics] = useState<UserStatistics>();

    const fetchStatistics = useCallback(async () => {
        try{
            setLoading(true)
            const response = await getCurrentUsersStatistics(auth?.id)
            const statistics: UserStatistics = response.data
            setStatistics(statistics)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [auth])

    useEffect(() => {
        fetchStatistics()
    }, [fetchStatistics])

    const rankCounts = statistics?.trophies.reduce((counts, trophy) => {
      const rank = trophy.rank_in_competition;
      if (rank >= 1 && rank <= 3) {
        counts[3 - rank].count += 1;
      }
      return counts;
    }, [
      { name: '3rd places', count: 0 },
      { name: '2nd places', count: 0 },
      { name: '1st places', count: 0 },
    ]) || [
      { name: '3rd places', count: 0 },
      { name: '2nd places', count: 0 },
      { name: '1st places', count: 0 },
    ];

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No users found."
        )
    }

    const progressSpinner = renderProgressSpinner()

    return (
    <>
      <Navbar />
      <UserInfo auth={auth} />
      <div className="flex h-[570px] justify-around p-[10px]">
          {loading ? progressSpinner : (
              <>
                  <div style={{ flexBasis: '48%', borderRadius: '20px' }} className="bg-white flex text-[25px] justify-center items-center">
                      <StatisticsChart statistics={statistics} />
                  </div>
                  <div style={{ flexBasis: '48%', borderRadius: '20px' }} className="bg-white flex text-[25px] justify-center items-center flex-col">
                      <RankBarChart data={rankCounts} />
                  </div>
              </>
          )}
      </div>
      <div className="flex flex-wrap justify-center">
      </div>
      <div className="p-[10px] flex justify-center">
          {loading ? progressSpinner : <UserTrophies trophies={statistics?.trophies ?? []} />}
      </div>
    </>
  );
}

export default ContestantProfilePage;