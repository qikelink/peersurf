import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Calendar, Globe, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface GrantEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  grant: {
    id: string;
    title: string;
    category: string;
    amount: number;
    currency: string;
    duration: string;
    repository_url?: string;
    overview: string;
    team_size: string;
    payment_schedule: string;
    status: string;
  };
  onSuccess?: () => void;
}

const GrantEditModal = ({ isOpen, onClose, grant, onSuccess }: GrantEditModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Infrastructure",
    amount: 0,
    currency: "USD",
    duration: "1-3 months",
    repository_url: "",
    overview: "",
    team_size: "Solo",
    payment_schedule: "Upfront (100%)",
    status: "submitted"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (grant && isOpen) {
      setFormData({
        title: grant.title || "",
        category: grant.category || "Infrastructure",
        amount: grant.amount || 0,
        currency: grant.currency || "USD",
        duration: grant.duration || "1-3 months",
        repository_url: grant.repository_url || "",
        overview: grant.overview || "",
        team_size: grant.team_size || "Solo",
        payment_schedule: grant.payment_schedule || "Upfront (100%)",
        status: grant.status || "submitted"
      });
    }
  }, [grant, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grant?.id) return;

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.overview.trim()) {
      setError("Project overview is required.");
      return;
    }
    if (formData.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('grants')
        .update({
          title: formData.title,
          category: formData.category,
          amount: formData.amount,
          currency: formData.currency,
          duration: formData.duration,
          repository_url: formData.repository_url || null,
          overview: formData.overview,
          team_size: formData.team_size,
          payment_schedule: formData.payment_schedule,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', grant.id);

      if (error) throw error;
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update grant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Grant</DialogTitle>
          <DialogDescription>
            Update the grant details and requirements
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
              <label className="block text-sm font-medium">Grant Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Open Source Video Streaming Infrastructure"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Grant Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
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
              <label className="block text-sm font-medium flex items-center gap-2">
                Grant Amount (in USD)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 10000"
                  className="w-48 bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                Project Duration
              </label>
              <select 
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="12+ months">12+ months</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                Project Repository
              </label>
              <input
                type="url"
                value={formData.repository_url}
                onChange={(e) => handleInputChange('repository_url', e.target.value)}
                placeholder="https://github.com/org/project"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Team Size</label>
              <select 
                value={formData.team_size}
                onChange={(e) => handleInputChange('team_size', e.target.value)}
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
              <label className="block text-sm font-medium">Project Overview</label>
              <textarea
                rows={5}
                required
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                placeholder="Provide a comprehensive overview of your project, its goals, and how it benefits the ecosystem."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[120px] resize-y"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Payment Schedule</label>
              <select 
                value={formData.payment_schedule}
                onChange={(e) => handleInputChange('payment_schedule', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="Upfront (100%)">Upfront (100%)</option>
                <option value="Milestone-based">Milestone-based</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
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
              {isSubmitting ? "Updating..." : "Update Grant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrantEditModal;
