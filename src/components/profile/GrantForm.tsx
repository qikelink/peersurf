import { Button } from "../ui/button";
import { DollarSign, Calendar, Globe } from "lucide-react";
import { useState } from "react";
import { createGrant, GrantFormData } from "../../lib/grants";
import { useUser } from "../../contexts/UserContext";

interface GrantFormProps {
  onSuccess?: () => void;
}

const GrantForm = ({ onSuccess }: GrantFormProps) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GrantFormData>({
    title: "",
    category: "Infrastructure",
    amount: 0,
    currency: "USD",
    duration: "1-3 months",
    repository_url: "",
    overview: "",
    team_size: "Solo",
    payment_schedule: "Upfront (100%)",
  });

  const update = (field: keyof GrantFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError("You must be logged in to submit a grant.");
      return;
    }
    if (!formData.title.trim()) return setError("Title is required.");
    if (!formData.overview.trim()) return setError("Project overview is required.");
    if (formData.amount <= 0) return setError("Amount must be greater than 0.");

    setIsSubmitting(true);
    try {
      await createGrant(formData, user.id);
      setFormData({
        title: "",
        category: "Infrastructure",
        amount: 0,
        currency: "USD",
        duration: "1-3 months",
        repository_url: "",
        overview: "",
        team_size: "Solo",
        payment_schedule: "Upfront (100%)",
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit grant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm ">Grant Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g., Open Source Video Streaming Infrastructure"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm ">Grant Category</label>
            <select 
              value={formData.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Research & Development">Research & Development</option>
              <option value="Community Building">Community Building</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Education & Documentation">Education & Documentation</option>
              <option value="Security & Auditing">Security & Auditing</option>
              <option value="Governance">Governance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm  flex items-center gap-2">
               Grant Amount
            </label>
            <div className="flex gap-3">
              <select 
                value={formData.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="w-28 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
              </select>
              <input
                type="number"
                min={0}
                step={100}
                value={formData.amount || ''}
                onChange={(e) => update('amount', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 10000"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm  flex items-center gap-2">
              Project Duration
            </label>
            <select 
              value={formData.duration}
              onChange={(e) => update('duration', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            >
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="12+ months">12+ months</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm  flex items-center gap-2">
              Project Repository
            </label>
            <input
              type="url"
              value={formData.repository_url}
              onChange={(e) => update('repository_url', e.target.value)}
              placeholder="https://github.com/org/project"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm ">Team Size</label>
            <select 
              value={formData.team_size}
              onChange={(e) => update('team_size', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            >
              <option value="Solo">Solo</option>
              <option value="2-3 people">2-3 people</option>
              <option value="4-6 people">4-6 people</option>
              <option value="7+ people">7+ people</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="block text-sm ">Project Overview</label>
            <textarea
              rows={5}
              required
              value={formData.overview}
              onChange={(e) => update('overview', e.target.value)}
              placeholder="Provide a comprehensive overview of your project, its goals, and how it benefits the ecosystem."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[120px] resize-y"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm ">Payment Schedule</label>
            <select 
              value={formData.payment_schedule}
              onChange={(e) => update('payment_schedule', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
            >
              <option value="Upfront (100%)">Upfront (100%)</option>
              <option value="Milestone-based">Milestone-based</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          
          <Button type="submit" disabled={isSubmitting} className="bg-[#3366FF] hover:bg-[#2952CC] disabled:opacity-50 text-white">
            {isSubmitting ? "Submitting..." : "Submit "}
          </Button>
          <span className="text-sm text-muted-foreground">*Note: You will be able to edit the grant after it is created.</span>
        </div>
      </form>
    </div>
  );
};

export default GrantForm;


