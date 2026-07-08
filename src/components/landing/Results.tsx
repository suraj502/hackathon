import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award, Sparkles, RefreshCw, Radio } from "lucide-react";

import { fetchResults, type TeamRecord } from "@/lib/hackathon-api";
import { getHackathonSocket } from "@/lib/socket";

type ResultsState = {
  round1: TeamRecord[];
  round2: TeamRecord[];
  winners: TeamRecord[];
};

const PODIUM = [
  { place: "1st", icon: Trophy, label: "Champion" },
  { place: "2nd", icon: Medal, label: "Runner-up" },
  { place: "3rd", icon: Award, label: "Third Place" },
];

function TeamGrid({ teams, announceDate }: { teams: TeamRecord[]; announceDate: string }) {
  return (
    <Card className="border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Shortlisted teams
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Compact view for rounds with many selections.
          </div>
        </div>
        <div className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary/80">
          <Sparkles className="h-3 w-3" /> {announceDate}
        </div>
      </div>

      <div className="mt-4 max-h-80 overflow-y-auto pr-1">
        {teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-8 text-center text-sm text-muted-foreground">
            Awaiting announcement. Teams will appear here once admins publish results.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{team.teamName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{team.collegeName}</div>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {team.status}
                  </span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Leader: <span className="text-foreground">{team.leader.name}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Track: <span className="text-foreground">{team.track}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function PodiumGrid({ teams, announceDate }: { teams: TeamRecord[]; announceDate: string }) {
  const topTeams = teams.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {PODIUM.map((podium, index) => {
          const team = topTeams[index];
          const Icon = podium.icon;

          return (
            <Card
              key={podium.place}
              className={`relative overflow-hidden border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6 ${
                index === 0 ? "sm:-translate-y-2 sm:border-primary/40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {podium.place}
                </span>
                <Icon className={`h-5 w-5 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="mt-6 font-mono text-2xl font-bold text-foreground">
                {team ? team.teamName : "TBA"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {team ? team.collegeName : podium.label}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary/80">
                <Sparkles className="h-3 w-3" /> {announceDate}
              </div>
            </Card>
          );
        })}
      </div>

      {teams.length > 3 && (
        <Card className="border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Additional winners
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.slice(3).map((team) => (
              <div key={team._id} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                <div className="text-sm font-semibold text-foreground">{team.teamName}</div>
                <div className="mt-1 text-xs text-muted-foreground">{team.collegeName}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function Results() {
  const [results, setResults] = useState<ResultsState>({
    round1: [],
    round2: [],
    winners: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let alive = true;
    const socket = getHackathonSocket();

    const syncResults = async () => {
      try {
        setError(null);
        const [round1, round2, winners] = await Promise.all([
          fetchResults("round1"),
          fetchResults("round2"),
          fetchResults("winner"),
        ]);

        if (!alive) return;

        setResults({
          round1: round1.teams,
          round2: round2.teams,
          winners: winners.teams,
        });
      } catch (requestError) {
        if (!alive) return;
        setError(requestError instanceof Error ? requestError.message : "Failed to load results");
      } finally {
        if (alive) setLoading(false);
      }
    };

    const handleStatusUpdate = () => {
      void syncResults();
    };

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("statusUpdated", handleStatusUpdate);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    void syncResults();

    return () => {
      alive = false;
      socket.off("statusUpdated", handleStatusUpdate);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <section id="results" className="relative py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 grid-bg opacity-20" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            [ RESULTS_FEED ]
          </div>
          <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Results &amp; Announcements
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Live updates land here as each round closes. Bookmark this section.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Radio className={`h-3.5 w-3.5 ${isConnected ? "text-emerald-400" : "text-muted-foreground"}`} />
            {isConnected ? "Live Socket Connected" : "Socket Connecting"}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
        </motion.div>

        <Tabs defaultValue="r1" className="w-full">
          <TabsList className="mx-auto mb-8 grid h-auto w-full max-w-md grid-cols-3 gap-1 bg-card/60 p-1 backdrop-blur sm:mb-10">
            <TabsTrigger value="r1" className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider">
              Round 1
            </TabsTrigger>
            <TabsTrigger value="r2" className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider">
              Round 2
            </TabsTrigger>
            <TabsTrigger value="final" className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-wider">
              Finals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="r1">
            <div className="mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center">
              <h3 className="font-mono text-lg font-bold text-foreground">Round 1 · Shortlist</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Announces 8 Aug
              </span>
            </div>
            {loading ? <LoadingPanel /> : error ? <ErrorPanel message={error} /> : <TeamGrid teams={results.round1} announceDate="8 Aug" />}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {results.round1.length > 0
                ? "Round 1 selections are live from the backend."
                : "Awaiting announcement. Shortlisted teams will be listed here in a compact grid."}
            </p>
          </TabsContent>

          <TabsContent value="r2">
            <div className="mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center">
              <h3 className="font-mono text-lg font-bold text-foreground">Round 2 · Finalists</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Announces 20 Aug
              </span>
            </div>
            {loading ? <LoadingPanel /> : error ? <ErrorPanel message={error} /> : <TeamGrid teams={results.round2} announceDate="20 Aug" />}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {results.round2.length > 0
                ? "Finalists are synced from the backend in real time."
                : "Awaiting announcement. Finalists will appear as team-name boxes instead of large cards."}
            </p>
          </TabsContent>

          <TabsContent value="final">
            <div className="mb-6 flex flex-col items-start justify-between gap-1.5 sm:flex-row sm:items-center">
              <h3 className="font-mono text-lg font-bold text-foreground">Finals · Champions</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Announces 29 Aug
              </span>
            </div>
            {loading ? <LoadingPanel /> : error ? <ErrorPanel message={error} /> : <PodiumGrid teams={results.winners} announceDate="29 Aug" />}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {results.winners.length > 0
                ? "Winners are now streamed from the backend and Socket.IO updates will refresh this section instantly."
                : "Awaiting announcement. Champions will be revealed live on Demo Day."}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function LoadingPanel() {
  return (
    <Card className="border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-40 rounded bg-muted/60" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-24 rounded-2xl bg-muted/50" />
          <div className="h-24 rounded-2xl bg-muted/50" />
          <div className="h-24 rounded-2xl bg-muted/50" />
        </div>
      </div>
    </Card>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive sm:p-6">
      {message}
    </Card>
  );
}
