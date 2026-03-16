// Data
import games from "../data/games.data";

// Components
import GameCard from "../components/GameCard";
import BackHeader from "@/shared/components/layout/BackHeader";

const GamesPage = () => {
  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      {/* Back Header */}
      <BackHeader href="/dashboard" title="O'yinlar" className="mb-4" />

      {/* Game Cards */}
      <div className="grid grid-cols-2 gap-4 container">
        {games.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
