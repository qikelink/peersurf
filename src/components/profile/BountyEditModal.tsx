import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Calendar, Globe, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface BountyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    id: string;
    title: string;
    category: string;
    budget_amount: number;
    budget_currency: string;
    deadline?: string;
    repository_url?: string;
    description: string;
    deliverables: string;
    acceptance_criteria: string;
    payment_method: string;
    bounty_type: string;
    status: string;
  };
  onSuccess?: () => void;
}

const BountyEditModal = ({ isOpen, onClose, bounty, onSuccess }: BountyEditModalProps) => {
  const [formData, setFormData] = useState({
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
    bounty_type: "Solo",
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bounty && isOpen) {
      setFormData({
        title: bounty.title || "",
        category: bounty.category || "Frontend",
        budget_amount: bounty.budget_amount || 0,
        budget_currency: bounty.budget_currency || "USD",
        deadline: bounty.deadline || "",
        repository_url: bounty.repository_url || "",
        description: bounty.description || "",
        deliverables: bounty.deliverables || "",
        acceptance_criteria: bounty.acceptance_criteria || "",
        payment_method: bounty.payment_method || "On-chain (crypto)",
        bounty_type: bounty.bounty_type || "Solo",
        status: bounty.status || "active"
      });
    }
  }, [bounty, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bounty?.id) return;

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
      const { error } = await supabase
        .from('bounties')
        .update({
          title: formData.title,
          category: formData.category,
          budget_amount: formData.budget_amount,
          budget_currency: formData.budget_currency,
          deadline: formData.deadline || null,
          repository_url: formData.repository_url || null,
          description: formData.description,
          deliverables: formData.deliverables,
          acceptance_criteria: formData.acceptance_criteria,
          payment_method: formData.payment_method,
          bounty_type: formData.bounty_type,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bounty.id);

      if (error) throw error;
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update bounty. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Bounty</DialogTitle>
          <DialogDescription>
            Update the bounty details and requirements
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

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
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                Budget (in USD)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={formData.budget_amount || ''}
                  onChange={(e) => handleInputChange('budget_amount', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 500"
                  className="w-48 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
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
                <Globe className="w-4 h-4" /> Your Github_Repo or Website
              </label>
              <input
                type="url"
                value={formData.repository_url}
                onChange={(e) => handleInputChange('repository_url', e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="paused">Paused</option>
              </select>
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
                <Users className="w-4 h-4" /> Bounty Type
              </label>
              <select 
                value={formData.bounty_type}
                onChange={(e) => handleInputChange('bounty_type', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
                <option value="Multiple Winners">Multiple Winners</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#3366FF] hover:bg-[#2952CC] disabled:opacity-50 text-white"
            >
              {isSubmitting ? "Updating..." : "Update Bounty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BountyEditModal;
