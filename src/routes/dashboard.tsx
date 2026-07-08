import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  clearAdminSession,
  deleteTeamById,
  fetchDashboardStats,
  fetchTeams,
  getAdminProfile,
  getAdminToken,
  updateTeamStatus,
  UnauthorizedError,
  type AdminProfile,
  type DashboardStats,
  type TeamRecord,
  type TeamStatus,
  type TeamsPage,
} from "@/lib/hackathon-api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — NexTerra Orbit Hackathon" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const STATUS_OPTIONS: { value: TeamStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "round1", label: "Round 1" },
  { value: "round2", label: "Round 2" },
  { value: "winner", label: "Winner" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES: Record<TeamStatus, string> = {
  pending: "border-border/60 bg-muted/40 text-muted-foreground",
  round1: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  round2: "border-violet-500/40 bg-violet-500/10 text-violet-400",
  winner: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
};

const PAGE_SIZE = 10;

function Dashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [teamsPage, setTeamsPage] = useState<TeamsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<TeamStatus | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyTeamId, setBusyTeamId] = useState<string | null>(null);

  const logout = useCallback(() => {
    clearAdminSession();
    void navigate({ to: "/admin" });
  }, [navigate]);

  const handleAuthError = useCallback(
    (requestError: unknown) => {
      if (requestError instanceof UnauthorizedError) {
        logout();
        return true;
      }
      return false;
    },
    [logout],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, teamsData] = await Promise.all([
        fetchDashboardStats(),
        fetchTeams({
          page,
          limit: PAGE_SIZE,
          status: statusFilter === "all" ? "" : statusFilter,
          search,
        }),
      ]);
      setStats(statsData);
      setTeamsPage(teamsData);
    } catch (requestError) {
      if (handleAuthError(requestError)) return;
      setError(requestError instanceof Error ? requestError.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, handleAuthError]);

  useEffect(() => {
    if (!getAdminToken()) {
      void navigate({ to: "/admin" });
      return;
    }
    setAdmin(getAdminProfile());
    setReady(true);
  }, [navigate]);

  useEffect(() => {
    if (!ready) return;
    void loadData();
  }, [ready, loadData]);

  const handleStatusChange = async (team: TeamRecord, status: TeamStatus) => {
    if (team.status === status) return;
    setBusyTeamId(team._id);
    try {
      await updateTeamStatus(team._id, status);
      await loadData();
    } catch (requestError) {
      if (handleAuthError(requestError)) return;
      setError(requestError instanceof Error ? requestError.message : "Failed to update status");
    } finally {
      setBusyTeamId(null);
    }
  };

  const handleDelete = async (team: TeamRecord) => {
    setBusyTeamId(team._id);
    try {
      await deleteTeamById(team._id);
      await loadData();
    } catch (requestError) {
      if (handleAuthError(requestError)) return;
      setError(requestError instanceof Error ? requestError.message : "Failed to delete team");
    } finally {
      setBusyTeamId(null);
    }
  };

  const statCards = useMemo(
    () =>
      stats
        ? [
            { label: "Total Teams", value: stats.totalTeams },
            { label: "Pending", value: stats.pending },
            { label: "Round 1", value: stats.round1 },
            { label: "Round 2", value: stats.round2 },
            { label: "Winners", value: stats.winners },
            { label: "Rejected", value: stats.rejected },
          ]
        : [],
    [stats],
  );

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  const pagination = teamsPage?.pagination;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 grid-bg opacity-10" />

      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              [ MISSION_CONTROL ]
            </div>
            <h1 className="mt-1 font-mono text-xl font-bold tracking-tight sm:text-2xl">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {admin && (
              <div className="text-right">
                <div className="text-sm font-medium">{admin.name}</div>
                <div className="text-xs text-muted-foreground">{admin.email}</div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {error && (
          <Card className="border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(statCards.length > 0 ? statCards : Array.from({ length: 6 }, () => null)).map(
            (stat, index) => (
              <Card
                key={stat ? stat.label : index}
                className="border-border/60 bg-card/60 p-4 backdrop-blur"
              >
                {stat ? (
                  <>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 w-16 rounded bg-muted/60" />
                    <div className="h-7 w-10 rounded bg-muted/50" />
                  </div>
                )}
              </Card>
            ),
          )}
        </div>

        <Card className="border-border/60 bg-card/60 p-4 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
                Registered Teams
              </h2>
              {pagination && (
                <span className="font-mono text-xs text-muted-foreground">
                  ({pagination.total})
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <form
                className="relative"
                onSubmit={(event) => {
                  event.preventDefault();
                  setPage(1);
                  setSearch(searchInput.trim());
                }}
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-9 sm:w-56"
                  placeholder="Search team, leader, college…"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </form>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setPage(1);
                  setStatusFilter(value as TeamStatus | "all");
                }}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loading && !teamsPage ? (
              <div className="animate-pulse space-y-3 py-4">
                <div className="h-10 rounded bg-muted/50" />
                <div className="h-10 rounded bg-muted/40" />
                <div className="h-10 rounded bg-muted/30" />
              </div>
            ) : !teamsPage || teamsPage.teams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-10 text-center text-sm text-muted-foreground">
                No teams found for the current filters.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60">
                    <TableHead>Team</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamsPage.teams.map((team) => (
                    <TableRow key={team._id} className="border-border/60">
                      <TableCell>
                        <div className="font-medium text-foreground">{team.teamName}</div>
                        <div className="mt-0.5 max-w-56 truncate text-xs text-muted-foreground">
                          {team.ideaPitch}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {team.collegeName}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                          {team.track}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{team.leader.name}</div>
                        <div className="text-xs text-muted-foreground">{team.leader.email}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{team.teamSize}</TableCell>
                      <TableCell>
                        <Select
                          value={team.status}
                          onValueChange={(value) =>
                            void handleStatusChange(team, value as TeamStatus)
                          }
                          disabled={busyTeamId === team._id}
                        >
                          <SelectTrigger
                            className={`h-8 w-32 rounded-full border px-3 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[team.status]}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              disabled={busyTeamId === team._id}
                            >
                              {busyTeamId === team._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{team.teamName}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the team and its registration data. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => void handleDelete(team)}
                              >
                                Delete team
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
