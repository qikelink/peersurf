import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  DollarSign, Target, 
  Briefcase,
  UserCheck, UserX, Activity, UserCog, FileText, Users
} from "lucide-react";
import BountyForm from "./BountyForm";
import GrantForm from "./GrantForm";
import BountyDetailsModal from "./BountyDetailsModal";
import BountySubmissionsModal from "./BountySubmissionsModal";
import BountyEditModal from "./BountyEditModal";
import GrantDetailsModal from "./GrantDetailsModal";
import GrantSubmissionsModal from "./GrantSubmissionsModal";
import GrantEditModal from "./GrantEditModal";
import { useState } from "react";

interface DashboardData {
  assignedProjects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    created_at: string;
  }>;
  contributions: {
    weekly: number;
    monthly: number;
    allTime: number;
  };
  paymentHistory: {
    totalPayouts: number;
    completedBounties: Array<{
      id: string;
      name: string;
      amount: number;
      completed_at: string;
    }>;
  };
  userBounties: Array<{
    id: string;
    title: string;
    category: string;
    budget_amount: number;
    budget_currency: string;
    status: string;
    created_at: string;
  }>;
  userGrants: Array<{
    id: string;
    title: string;
    category: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
  pendingRoleRequests: Array<{
    id: string;
    user_id: string;
    username: string;
    requested_role: string;
    created_at: string;
  }>;
}

const DashboardContent = ({ activeSection, profile, dashboardData, handleRoleAction, onBountySuccess, onGrantSuccess }: {
  activeSection: string;
  profile: any;
  dashboardData: DashboardData;
  handleRoleAction: (requestId: string, action: 'approve' | 'deny') => Promise<void>;
  onBountySuccess?: () => void;
  onGrantSuccess?: () => void;
}) => {
  const [selectedBounty, setSelectedBounty] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<any>(null);
  const [grantDetailsModalOpen, setGrantDetailsModalOpen] = useState(false);
  const [grantSubmissionsModalOpen, setGrantSubmissionsModalOpen] = useState(false);
  const [grantEditModalOpen, setGrantEditModalOpen] = useState(false);

  const handleViewDetails = (bounty: any) => {
    setSelectedBounty(bounty);
    setDetailsModalOpen(true);
  };

  const handleViewSubmissions = (bounty: any) => {
    setSelectedBounty(bounty);
    setSubmissionsModalOpen(true);
  };

  const handleEditBounty = (bounty: any) => {
    setSelectedBounty(bounty);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    onBountySuccess?.();
    setEditModalOpen(false);
  };

  const handleViewGrantDetails = (grant: any) => {
    setSelectedGrant(grant);
    setGrantDetailsModalOpen(true);
  };

  const handleViewGrantSubmissions = (grant: any) => {
    setSelectedGrant(grant);
    setGrantSubmissionsModalOpen(true);
  };

  const handleEditGrant = (grant: any) => {
    setSelectedGrant(grant);
    setGrantEditModalOpen(true);
  };

  const handleGrantEditSuccess = () => {
    onGrantSuccess?.();
    setGrantEditModalOpen(false);
  };
  const renderDashboardContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {profile.full_name || profile.username}</div>
                      <div><span className="text-muted-foreground">GitHub:</span> <a href="#" className="text-primary hover:underline">github.com/{profile.username}</a></div>
                      {profile.bio && (
                        <div>
                          <span className="text-muted-foreground">Bio:</span> 
                          <p className="text-foreground mt-1">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Contributions</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">{dashboardData.contributions.weekly}</div>
                        <div className="text-xs text-muted-foreground">Weekly</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{dashboardData.contributions.monthly}</div>
                        <div className="text-xs text-muted-foreground">Monthly</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">{dashboardData.contributions.allTime}</div>
                        <div className="text-xs text-muted-foreground">All-time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

        

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Payouts Received:</span>
                    <span className="text-xl font-bold text-green-500">${dashboardData.paymentHistory.totalPayouts}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Completed Bounties</h4>
                    <div className="space-y-2">
                      {dashboardData.paymentHistory.completedBounties.map((bounty: any) => (
                        <div key={bounty.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{bounty.name || bounty.title}</div>
                            <div className="text-sm text-muted-foreground">{bounty.completed_at || bounty.date}</div>
                          </div>
                          <div className="text-green-500 font-semibold">${bounty.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bounty-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Bounty Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">My Bounties</h3>
                </div>
                <div className="space-y-4">
                  {dashboardData.userBounties.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No bounties yet</h3>
                      <p>Create your first bounty to get started.</p>
                    </div>
                  ) : (
                    dashboardData.userBounties.map((bounty: any) => (
                      <div key={bounty.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{bounty.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{bounty.category}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Budget: {bounty.budget_currency} {bounty.budget_amount}</span>
                              <span>Status: <span className={`font-medium ${
                                bounty.status === 'active' ? 'text-green-500' : 
                                bounty.status === 'completed' ? 'text-blue-500' : 
                                'text-gray-500'
                              }`}>{bounty.status}</span></span>
                              <span>Created: {new Date(bounty.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-500 font-semibold text-lg">
                              {bounty.budget_currency} {bounty.budget_amount}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(bounty)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewSubmissions(bounty)}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            Submissions ({bounty.submission_count || 0})
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditBounty(bounty)}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "grant-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Grant Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">My Grants</h3>
                </div>
                <div className="space-y-4">
                  {dashboardData.userGrants.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No grants yet</h3>
                      <p>Create your first grant to get started.</p>
                    </div>
                  ) : (
                    dashboardData.userGrants.map((grant: any) => (
                      <div key={grant.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{grant.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{grant.category}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Amount: {grant.currency} {grant.amount}</span>
                              <span>Status: <span className={`font-medium ${
                                grant.status === 'submitted' ? 'text-yellow-500' : 
                                grant.status === 'approved' ? 'text-green-500' : 
                                grant.status === 'rejected' ? 'text-red-500' :
                                'text-gray-500'
                              }`}>{grant.status}</span></span>
                              <span>Created: {new Date(grant.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-500 font-semibold text-lg">
                              {grant.currency} {grant.amount}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewGrantDetails(grant)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewGrantSubmissions(grant)}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            Submissions ({grant.submission_count || 0})
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditGrant(grant)}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bounties":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Post a New Bounty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BountyForm onSuccess={onBountySuccess} />
              </CardContent>
            </Card>
          </div>
        );

      case "grants":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Post a New Grant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GrantForm onSuccess={onGrantSuccess} />
              </CardContent>
            </Card>
          </div>
        );

      case "user-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5" />
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pending Role Requests</h3>
                  {dashboardData.pendingRoleRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">@{request.username || request.user}</div>
                        <div className="text-sm text-muted-foreground">Requested: {request.requested_role || request.requestedRole}</div>
                        <div className="text-xs text-muted-foreground">{request.created_at || request.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleRoleAction(request.id, 'approve')}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleRoleAction(request.id, 'deny')}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p>This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      {renderDashboardContent()}
      
      {/* Modals */}
      <BountyDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        bounty={selectedBounty}
      />
      
      <BountySubmissionsModal
        isOpen={submissionsModalOpen}
        onClose={() => setSubmissionsModalOpen(false)}
        bounty={selectedBounty}
      />
      
      <BountyEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        bounty={selectedBounty}
        onSuccess={handleEditSuccess}
      />
      
      <GrantDetailsModal
        isOpen={grantDetailsModalOpen}
        onClose={() => setGrantDetailsModalOpen(false)}
        grant={selectedGrant}
      />
      
      <GrantSubmissionsModal
        isOpen={grantSubmissionsModalOpen}
        onClose={() => setGrantSubmissionsModalOpen(false)}
        grant={selectedGrant}
      />
      
      <GrantEditModal
        isOpen={grantEditModalOpen}
        onClose={() => setGrantEditModalOpen(false)}
        grant={selectedGrant}
        onSuccess={handleGrantEditSuccess}
      />
    </>
  );
};

export default DashboardContent;
