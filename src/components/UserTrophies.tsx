import React from 'react';

interface Trophy {
  icon: string;
  rank_in_competition?: number;
}

interface UserTrophiesProps {
  trophies: Trophy[];
}

const UserTrophies: React.FC<UserTrophiesProps> = ({ trophies }) => (
  <div className="inline-flex flex-col items-center justify-center bg-white rounded-lg p-4">
    <h2 className="text-2xl font-bold mb-4">Trophies</h2>
    <div className="flex flex-wrap justify-center">
      {trophies.map((trophy, index) => (
        <div key={index} className="m-2 flex flex-col items-center">
          <img src={`data:image/jpeg;base64,${trophy.icon}`} alt="trophy icon" style={{ width: '100px', height: '100px' }} />
          {trophy.rank_in_competition && <p>{trophy.rank_in_competition}.</p>}
        </div>
      ))}
    </div>
  </div>
);

export default UserTrophies;
