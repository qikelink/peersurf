import { Button } from "../ui/button";
import { Calendar, Globe, Users } from "lucide-react";
import { useState } from "react";
import { createBounty, BountyFormData } from "../../lib/bounties";
import { useUser } from "../../contexts/UserContext";

interface BountyFormProps {
  onSuccess?: () => void;
}

const BountyForm = ({ onSuccess }: BountyFormProps) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BountyFormData>({
    title: "",
    category: "Frontend",
    budget_amount: 0,
    budget_currency: "USD",
    deadline: "",
    repository_url: "",
    description: "",
    deliverables: "",
    acceptance_criteria: "",
    payment_method: "On-chain (crypto)",
    bounty_type: "Solo"
  });

  const handleInputChange = (field: keyof BountyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError("You must be logged in to create a bounty.");
      return;
    }

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!formData.deliverables.trim()) {
      setError("Deliverables are required.");
      return;
    }
    if (formData.budget_amount <= 0) {
      setError("Budget amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createBounty(formData, user.id);
      
      // Reset form
      setFormData({
        title: "",
        category: "Frontend",
        budget_amount: 0,
        budget_currency: "USD",
        deadline: "",
        repository_url: "",
        description: "",
        deliverables: "",
        acceptance_criteria: "",
        payment_method: "On-chain (crypto)",
        bounty_type: "Solo"
      });
      
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bounty. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Project / Bounty Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Build a React component for live video player"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="Contents">Contents</option>
                <option value="Code">Code</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                 Budget
              </label>
              <div className="flex gap-3">
                <select 
                  value={formData.budget_currency}
                  onChange={(e) => handleInputChange('budget_currency', e.target.value)}
                  className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                >
                  <option value="USD">USD</option>
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                </select>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={formData.budget_amount || ''}
                  onChange={(e) => handleInputChange('budget_amount', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 500"
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                 Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                 Repository / Reference URL
              </label>
              <input
                type="url"
                value={formData.repository_url}
                onChange={(e) => handleInputChange('repository_url', e.target.value)}
                placeholder="Your Github_Repo or Website"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Detailed Description</label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the problem, context, goals, and any constraints."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[120px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Deliverables</label>
              <textarea
                rows={4}
                required
                value={formData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                placeholder="List what you expect to receive (e.g., PR, demo, docs)."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Acceptance Criteria (Optional)</label>
              <textarea
                rows={4}
                required
                value={formData.acceptance_criteria}
                onChange={(e) => handleInputChange('acceptance_criteria', e.target.value)}
                placeholder="Define objective criteria to accept the work."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[100px] resize-y"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Payment Method</label>
              <select 
                value={formData.payment_method}
                onChange={(e) => handleInputChange('payment_method', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="On-chain (crypto)">On-chain (crypto)</option>
                <option value="Off-chain (fiat)">Off-chain (fiat)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                 Bounty Type
              </label>
              <select 
                value={formData.bounty_type}
                onChange={(e) => handleInputChange('bounty_type', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="Solo Winner">Solo Winner</option>
                <option value="Multiple Winners">Multiple Winners</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white"
            >
              {isSubmitting ? "Creating..." : "Submit Bounty"}
            </Button>
            <span className="text-sm text-muted-foreground">*Note: You will be able to edit the bounty after it is created.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BountyForm;


