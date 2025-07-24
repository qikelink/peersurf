import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { updateUserProfile } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Loader from "../ui/loader";

const ProfilePage: React.FC = () => {
  const { user, loading: userLoading, profile, refreshProfile, currency, setCurrency } = useUser();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/auth");
    }
    if (profile) {
      setForm(profile);
    }
  }, [user, userLoading, navigate, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await updateUserProfile(user.id, form);
      if (error) setError(error.message);
      else {
        setSuccess("Profile updated successfully!");
        await refreshProfile();
      }
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) return <Loader />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 py-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <div className="font-semibold text-lg">User Profile</div>
          <div className="text-xs text-gray-500">Setup or edit your profile</div>
        </div>
      </div>
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="text"
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Wallet Address
          </label>
          <input
            type="text"
            name="wallet_address"
            value={form.wallet_address || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Currency</label>
          <select
            className="w-full p-3 border rounded-md"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="NGN">Naira (₦)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            {/* Add more currencies as needed */}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded font-semibold text-base"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {success && (
          <div className="text-green-600 mt-2 text-center">{success}</div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
