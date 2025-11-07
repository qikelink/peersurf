import { useUser } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, createUserProfile, uploadProfileImage } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import Navbar from "../nav-bar";
import Sidebar from "../profile/Sidebar";
import ProfileEditor from "../profile/ProfileEditor";
import DashboardContent from "../profile/DashboardContent";
import PasswordChange from "../profile/PasswordChange";
import { useEffect, useState } from "react";

// Types
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
    submission_count: number;
  }>;
  userGrants: Array<{
    id: string;
    title: string;
    category: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    submission_count: number;
  }>;
  pendingRoleRequests: Array<{
    id: string;
    user_id: string;
    username: string;
    requested_role: string;
    created_at: string;
  }>;
  talentProgress: Array<{
    id: string;
    type: 'bounty' | 'grant';
    opportunity_id: string;
    opportunity_title: string;
    project_name: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number | null;
    currency: string | null;
    created_at: string;
  }>;
}

// Main Profile Page Component
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(profile || {});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [requestedRole, setRequestedRole] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    assignedProjects: [],
    contributions: { weekly: 0, monthly: 0, allTime: 0 },
    paymentHistory: { totalPayouts: 0, completedBounties: [] },
    userBounties: [],
    userGrants: [],
    pendingRoleRequests: [],
    talentProgress: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Update editedProfile when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  // Fetch dashboard data from Supabase
  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      // Fetch assigned projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      // Fetch contributions (submissions)
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data: allSubmissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id);

      const weeklySubmissions = allSubmissions?.filter(s => new Date(s.created_at) >= weekAgo).length || 0;
      const monthlySubmissions = allSubmissions?.filter(s => new Date(s.created_at) >= monthAgo).length || 0;

      // Fetch payment history
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      // Fetch all bounties created by user (for bounty management)
      const { data: bounties } = await supabase
        .from('bounties')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      // Fetch submission counts for each bounty
      const bountiesWithSubmissions = await Promise.all(
        (bounties || []).map(async (bounty) => {
          try {
            // Try new bounty_submissions table first
            const { count } = await supabase
              .from('bounty_submissions')
              .select('*', { count: 'exact', head: true })
              .eq('bounty_id', bounty.id);
            return {
              ...bounty,
              submission_count: count || 0
            };
          } catch (error) {
            // Fallback to legacy submissions table
            console.log('Falling back to legacy submissions table for bounty count');
            const { count } = await supabase
              .from('submissions')
              .select('*', { count: 'exact', head: true })
              .eq('opportunity_id', bounty.id);
            return {
              ...bounty,
              submission_count: count || 0
            };
          }
        })
      );

      // Fetch all grants created by user (for grant management)
      const { data: grants } = await supabase
        .from('grants')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      // Fetch submission counts for each grant
      const grantsWithSubmissions = await Promise.all(
        (grants || []).map(async (grant) => {
          try {
            // Try new grant_submissions table first
            const { count } = await supabase
              .from('grant_submissions')
              .select('*', { count: 'exact', head: true })
              .eq('grant_id', grant.id);
            return {
              ...grant,
              submission_count: count || 0
            };
          } catch (error) {
            // Fallback to legacy submissions table
            console.log('Falling back to legacy submissions table for grant count');
            const { count } = await supabase
              .from('submissions')
              .select('*', { count: 'exact', head: true })
              .eq('opportunity_id', grant.id);
            return {
              ...grant,
              submission_count: count || 0
            };
          }
        })
      );

      // Fetch pending role requests (for Admin)
      const { data: roleRequests } = await supabase
        .from('role_requests')
        .select(`
          *,
          profiles:user_id(username)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Fetch talent progress (submissions) for Talent role
      const talentProgressData: Array<{
        id: string;
        type: 'bounty' | 'grant';
        opportunity_id: string;
        opportunity_title: string;
        project_name: string;
        status: 'pending' | 'approved' | 'rejected';
        amount: number | null;
        currency: string | null;
        created_at: string;
      }> = [];

      // Fetch bounty submissions
      try {
        const { data: bountySubmissions, error: bountyError } = await supabase
          .from('bounty_submissions')
          .select(`
            *,
            bounties:bounty_id(title, budget_amount, budget_currency)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bountyError) {
          console.log('Error fetching bounty submissions:', bountyError);
        } else if (bountySubmissions) {
          bountySubmissions.forEach((sub: any) => {
            const bounty = Array.isArray(sub.bounties) ? sub.bounties[0] : sub.bounties;
            talentProgressData.push({
              id: sub.id,
              type: 'bounty',
              opportunity_id: sub.bounty_id,
              opportunity_title: bounty?.title || 'Unknown Bounty',
              project_name: sub.project_name,
              status: sub.status,
              amount: sub.status === 'approved' ? (bounty?.budget_amount ? parseFloat(bounty.budget_amount) : null) : null,
              currency: sub.status === 'approved' ? (bounty?.budget_currency || null) : null,
              created_at: sub.created_at,
            });
          });
        }
      } catch (error) {
        console.log('Error fetching bounty submissions:', error);
      }

      // Fetch grant submissions
      try {
        const { data: grantSubmissions, error: grantError } = await supabase
          .from('grant_submissions')
          .select(`
            *,
            grants:grant_id(title, amount, currency)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (grantError) {
          console.log('Error fetching grant submissions:', grantError);
        } else if (grantSubmissions) {
          grantSubmissions.forEach((sub: any) => {
            const grant = Array.isArray(sub.grants) ? sub.grants[0] : sub.grants;
            talentProgressData.push({
              id: sub.id,
              type: 'grant',
              opportunity_id: sub.grant_id,
              opportunity_title: grant?.title || 'Unknown Grant',
              project_name: sub.project_name,
              status: sub.status,
              amount: sub.status === 'approved' ? (grant?.amount ? parseFloat(grant.amount) : null) : null,
              currency: sub.status === 'approved' ? (grant?.currency || null) : null,
              created_at: sub.created_at,
            });
          });
        }
      } catch (error) {
        console.log('Error fetching grant submissions:', error);
      }

      // Sort by created_at descending
      talentProgressData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setDashboardData({
        assignedProjects: projects || [],
        contributions: {
          weekly: weeklySubmissions,
          monthly: monthlySubmissions,
          allTime: allSubmissions?.length || 0,
        },
        paymentHistory: {
          totalPayouts: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
          completedBounties: payments || [],
        },
        userBounties: bountiesWithSubmissions,
        userGrants: grantsWithSubmissions,
        pendingRoleRequests: roleRequests || [],
        talentProgress: talentProgressData,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  // Ensure a profile row exists for logged-in users (first-time login or missing profile)
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile) {
        try {
          await createUserProfile({ id: user.id });
          await refreshProfile();
        } catch (e) {
          // ignore and let refresh try again later
        }
      }
    };
    ensureProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
          <Button onClick={() => navigate("/auth?mode=login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      let avatarUrl = editedProfile.avatar_url || profile?.avatar_url;
      
      // Upload image if a new one is selected
      if (selectedImageFile) {
        const { data: uploadData, error: uploadError } = await uploadProfileImage(user.id, selectedImageFile);
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError(`Failed to upload image: ${uploadError.message}`);
          setIsUploading(false);
          return;
        }
        
        if (uploadData?.publicUrl) {
          avatarUrl = uploadData.publicUrl;
        }
      }
      
      // Update profile with all fields including avatar_url
      const { data, error } = await updateUserProfile(user.id, {
        full_name: editedProfile.full_name,
        username: editedProfile.username,
        bio: editedProfile.bio,
        role: editedProfile.role || 'talent',
        avatar_url: avatarUrl,
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to save profile. Please try again.');
        setIsUploading(false);
        return;
      }
      
      console.log('Profile updated successfully:', data);
      await refreshProfile();
      setIsEditing(false);
      setSelectedImageFile(null); // Clear selected image
      setError(null); // Clear any previous errors
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRoleRequest = async (role: string) => {
    if (!user?.id) return;
    
    try {
      setRequestedRole(role);
      
      // For testing: Update the profile immediately
      // In production, this should create a role request instead
      const { data, error } = await updateUserProfile(user.id, {
        role: role as 'talent' | 'SPE' | 'admin',
      });
      
      if (error) {
        console.error('Error updating role:', error);
        setRequestedRole(null);
        setError('Failed to update role. Please try again.');
        return;
      }
      
      console.log('Role updated successfully:', data);
      await refreshProfile();
      
      // Show success message briefly
      setTimeout(() => setRequestedRole(null), 3000);
    } catch (error) {
      console.error('Error requesting role:', error);
      setRequestedRole(null);
      setError('Failed to request role upgrade. Please try again.');
    }
  };

  // Handle bounty form success
  const handleBountySuccess = () => {
    setSuccessMessage("Bounty created successfully!");
    setError(null);
    // Refresh dashboard data to show the new bounty
    fetchDashboardData();
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle role approval/denial (for Admin)
  const handleRoleAction = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      if (action === 'approve') {
        // Get the role request details
        const { data: request } = await supabase
          .from('role_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (request) {
          // Update the user's role
          await updateUserProfile(request.user_id, {
            role: request.requested_role as 'talent' | 'SPE' | 'admin',
          });

          // Update the role request status
          await supabase
            .from('role_requests')
            .update({ status: 'approved', updated_at: new Date().toISOString() })
            .eq('id', requestId);
        }
      } else {
        // Deny the request
        await supabase
          .from('role_requests')
          .update({ status: 'denied', updated_at: new Date().toISOString() })
          .eq('id', requestId);
      }

      // Refresh dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error handling role action:', error);
    }
  };

  // Handle grant form success
  const handleGrantSuccess = () => {
    setSuccessMessage("Grant submitted successfully!");
    setError(null);
    fetchDashboardData();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            profile={profile}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            requestedRole={requestedRole}
            handleRoleRequest={handleRoleRequest}
            navigate={navigate}
            signOut={signOut}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      fetchDashboardData();
                    }}
                    className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
              )}
              {/* Profile Editor */}
              {activeSection !== "bounties" && activeSection !== "grants" && activeSection !== "bounty-management" && activeSection !== "grant-management" && activeSection !== "user-management" && activeSection !== "ecosystem-analytics" && activeSection !== "talent-progress" && activeSection !== "submission-management" && activeSection !== "password" && (
                <ProfileEditor
                  profile={profile}
                  editedProfile={editedProfile}
                  setEditedProfile={setEditedProfile}
                  isEditing={isEditing}
                  setIsEditing={(editing) => {
                    setIsEditing(editing);
                    if (!editing) {
                      // Clear selected image when canceling edit
                      setSelectedImageFile(null);
                    }
                  }}
                  handleSave={handleSave}
                  onImageSelect={(file) => setSelectedImageFile(file)}
                  isUploading={isUploading}
                />
              )}

              {/* Password Change Section */}
              {activeSection === "password" && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <PasswordChange />
                </div>
              )}

              {/* Dashboard Content */}
              {profile && (
                <DashboardContent
                  activeSection={activeSection}
                  profile={profile}
                  dashboardData={dashboardData}
                  handleRoleAction={handleRoleAction}
                  onBountySuccess={handleBountySuccess}
                  onGrantSuccess={handleGrantSuccess}
                  userId={user?.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;