import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { createOpportunity, listOpportunities, deleteOpportunity, type OpportunityType } from "../../lib/opportunities";
import Navbar from "../nav-bar";

const SponsorDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<OpportunityType>("Bounty");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [category, setCategory] = useState("Development");
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!user?.id) return;
    const { data } = await listOpportunities({ sponsor_id: user.id });
    setItems(data || []);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreate = async () => {
    setError(null);
    if (!user?.id) return;
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }
    setLoading(true);
    try {
      const { error } = await createOpportunity({
        sponsor_id: user.id,
        title: title.trim(),
        type,
        description: description.trim(),
        reward: type === "Bounty" ? reward || null : null,
        max_amount: type === "Grant" ? maxAmount || null : null,
        category,
      });
      if (error) throw error;
      setTitle("");
      setDescription("");
      setReward("");
      setMaxAmount("");
      await refresh();
    } catch (e: any) {
      setError(e.message || "Failed to create opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    await deleteOpportunity(id, user.id);
    await refresh();
  };

  const isSponsor = (profile?.role === "SPE");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Sponsor Dashboard</h1>
        {!isSponsor && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-700 bg-yellow-900/20 text-yellow-300">
            Your account is not set as Sponsor. You can still create for testing if authorized.
          </div>
        )}

        <Card className="bg-gray-900 border border-gray-700 p-6 mb-8">
          <h2 className="font-semibold mb-4">Create Opportunity</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OpportunityType)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600"
            >
              <option value="Bounty">Bounty</option>
              <option value="Grant">Grant</option>
            </select>
            {type === "Bounty" ? (
              <input
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="Reward (e.g., 800 USDC)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 md:col-span-1"
              />
            ) : (
              <input
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Max amount (e.g., Up to 10k USDC)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 md:col-span-1"
              />
            )}
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g., Development)"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 md:col-span-1"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 md:col-span-2"
            />
          </div>
          <Button onClick={handleCreate} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? "Creating..." : "Create"}
          </Button>
        </Card>

        <h2 className="font-semibold mb-3">Your Opportunities</h2>
        <div className="space-y-3">
          {items.map((it) => (
            <Card key={it.id} className="bg-gray-900 border border-gray-700 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-wide text-gray-400">{it.type}</div>
                  <div className="text-lg font-semibold">{it.title}</div>
                  <div className="text-gray-400 text-sm mt-1">{it.description}</div>
                  <div className="text-gray-500 text-xs mt-2">
                    {it.category} • {it.status} {it.reward ? `• ${it.reward}` : ""} {it.max_amount ? `• ${it.max_amount}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => handleDelete(it.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="text-gray-500">No opportunities yet.</div>
          )}
        </div>
    </div>
      </div>
    </>
  );
};

export default SponsorDashboard;


