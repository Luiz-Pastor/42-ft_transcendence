/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Player, TournamentView } from "@/types/tournamentTypes";
import InviteFriendWithCode from "./InviteFriendWithCode";
import { useTournament } from "@/hooks/useTournament";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useNavigate } from "react-router";

interface Friend {
  id: number;
  alias: string;
  avatar?: string;
}

interface CreateViewProps {
  setCurrentView: (view: TournamentView) => void;
  t: (key: any) => string;
  user: any;
  friends: Friend[];
  addNotification: (msg: string, type: "success" | "error") => void;
  validatedUsers: Set<number>;
  setValidatedUsers: React.Dispatch<React.SetStateAction<Set<number>>>;
  participants: Player[];
  setParticipants: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedPlayers: number;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<number>>;
  apiUrl: string;
}

interface gameSettings {
  default_value: boolean;
  points_to_win: string;
  serve_delay: string;
  ball_color: string;
  stick_color: string;
  field_color: string;
}

interface createTournamentData {
  configuration: gameSettings;
  players: number[];
}

// {
// 	"configuration": {
// 		"default_value": true,
// 		"points_to_win": "5",
// 		"serve_delay": "3",
// 		"ball_color": "FFFFFF",
// 		"stick_color": "FFFFFF",
// 		"field_color": "FFFFFF"
// 	},
// 	"players": [ 1, 2, 3, 4 ]
// }

const CreateView: React.FC<CreateViewProps> = ({
  setCurrentView,
  t,
  user,
  friends,
  addNotification,
  validatedUsers,
  setValidatedUsers,
  participants,
  setParticipants,
  selectedPlayers,
  setSelectedPlayers,
  apiUrl,
}) => {
  // Hooks
  const { createTournament } = useTournament();
  const { defaultValue, score, serveDelay, bgColor, barColor, ballColor } =
    useGameSettings();
  const navigate = useNavigate();

  // Handle onClick for creating a tournament
  const handleCreateTournament = async () => {
    // If not all participants
    if (participants.length < selectedPlayers) {
      addNotification(t("tournament_not_enough_players"), "error");
      return;
    }

    // Data to create the tournament
    const TournamentData: createTournamentData = {
      configuration: {
        default_value: defaultValue,
        points_to_win: score,
        serve_delay: serveDelay,
        ball_color: ballColor,
        stick_color: barColor,
        field_color: bgColor,
      },
      players: participants.map((p) => p.id),
    };

    // Create tournament
    const newTournamentId = await createTournament(TournamentData);

    // If no tournament ID returned
    if (!newTournamentId) {
      addNotification(t("tournament_create_error"), "error");
      return;
    }

    // Navigate to the new tournament
    addNotification(t("tournament_create_success"), "success");
    navigate(`/tournament/${newTournamentId}`);
  };

  return (
    <div className="px-4 py-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-background-secondary rounded-xl p-8 border border-border-primary">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView("main")}
              className="text-text-secondary hover:text-text-primary mr-4 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-text-primary">
              {t("create_tournament")}
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-text-primary font-semibold mb-3">
                {t("tournament_players")}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[4, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedPlayers(num)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-colors ${
                      selectedPlayers === num
                        ? "border-text-tertiary bg-opacity-10 text-text-tertiary"
                        : "border-border-secondary text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    <div className="text-2xl font-bold">{num}</div>
                    <div className="text-sm">{t("tournament_players")}</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Lista de amigos */}
            <div className="bg-background-primary rounded-lg p-6 border border-border-primary mb-6">
              <h3 className="text-text-primary font-semibold mb-4">
                {t("home_friends")}
              </h3>
              <div className="mb-2 text-text-secondary font-mono">
                {t("tournament_players_label")
                  .replace("{current}", String(participants.length))
                  .replace("{max}", String(selectedPlayers))}
              </div>
              {friends.length === 0 ? (
                <div className="text-text-secondary">
                  {t("tournament_no_friends")}
                </div>
              ) : (
                <ul className="space-y-3">
                  {friends.map((friend) => (
                    <InviteFriendWithCode
                      key={friend.id}
                      friend={friend}
                      user={user}
                      apiUrl={apiUrl}
                      addNotification={addNotification}
                      validatedUsers={validatedUsers}
                      setValidatedUsers={setValidatedUsers}
                      isFull={participants.length >= selectedPlayers}
                      setParticipants={setParticipants}
                      t={t}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCreateTournament}
                disabled={participants.length < selectedPlayers}
                className="flex-1 bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {t("create_tournament")}
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              {t("tournament_disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateView;
