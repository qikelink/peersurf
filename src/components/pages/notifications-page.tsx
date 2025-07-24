import React from "react";
import Loader from "../ui/loader";
import EmptyState from "../ui/empty-state";
import { ArrowLeft, Info } from "lucide-react";
import ActionButtons from "../ui/action-buttons";
import { useNotifications } from "../../contexts/NotificationsContext";

const NotificationsPage: React.FC = () => {
  const { notifications, loading } = useNotifications();

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 border-b border-gray-100">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="font-semibold text-base leading-tight">Notifications</div>
          <div className="text-xs text-gray-500">All your recent activity and alerts</div>
        </div>
        {/* Optionally add a refresh button here if you want manual refresh */}
      </div>
      <div className="flex-1 px-4 py-6">
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <EmptyState message="No notifications yet." icon={<Info />} />
        ) : (
          <div className="space-y-4">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className="rounded-xl p-4 bg-gray-50 border border-gray-100 shadow-sm flex flex-col gap-1"
              >
                <div className="font-semibold text-black text-sm mb-1">{n.title}</div>
                <div className="text-xs text-gray-700 mb-1">{n.message}</div>
                <div className="text-xs text-gray-400">{n.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
    </div>
  );
};

export default NotificationsPage; 