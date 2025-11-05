import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Calendar, Globe, DollarSign, Users, FileText } from "lucide-react";

interface BountyDetailsModalProps {
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
    created_at: string;
  };
}

const BountyDetailsModal = ({ isOpen, onClose, bounty }: BountyDetailsModalProps) => {
  if (!bounty) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{bounty.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{bounty.category}</Badge>
            <Badge variant={bounty.status === 'active' ? 'default' : 'secondary'}>
              {bounty.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="">Budget:</span>
                <span className="text-green-600 ">
                  {bounty.budget_currency} {bounty.budget_amount}
                </span>
              </div>
              
              {bounty.deadline && (
                <div className="flex items-center gap-2">
                  <span className="">Deadline:</span>
                  <span>{new Date(bounty.deadline).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span>Type:</span>
                <span>{bounty.bounty_type}</span>
              </div>
              
              
            </div>
            
            <div className="space-y-4">
              {bounty.repository_url && (
                <div className="flex items-center gap-2">
                  <span >Repository:</span>
                  <a 
                    href={bounty.repository_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Repository
                  </a>
                </div>
              )}
              
              <div >
                <span >Created:</span> {new Date(bounty.created_at).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <span >Payment:</span>
                <span>{bounty.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold mb-2">Description</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap"> {bounty.description}</p>
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-base font-semibold mb-2">Deliverables</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{bounty.deliverables}</p>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <h3 className="text-base font-semibold mb-2">Acceptance Criteria</h3><span className="italic text-sm">(Optional)</span>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{bounty.acceptance_criteria}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BountyDetailsModal;
