"use client";

import Link from "next/link";
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/app/redux/services/notificationApi";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationsContent() {
  const { data: notifications = [], isLoading, isError, refetch } = useListNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
        Notifications লোড হচ্ছে...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-red-600">
        Notifications লোড করা যায়নি।
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-orange">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-gray-700"
          >
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-gray-500">
          কোনো notification নেই।
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const content = (
              <div
                className={`rounded-2xl border p-4 transition-colors ${
                  notification.isRead
                    ? "border-brand-border bg-white"
                    : "border-brand-orange/30 bg-orange-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        void handleMarkRead(notification.id);
                      }}
                      className="rounded-lg border border-brand-border px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      Read
                    </button>
                  )}
                </div>
              </div>
            );

            if (notification.link) {
              return (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => {
                    if (!notification.isRead) void handleMarkRead(notification.id);
                  }}
                >
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
