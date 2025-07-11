/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ReactNode, useCallback } from "react";
import { FriendsContext } from "@/context/Friends/FriendsContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FriendStatus,
  FriendsApiResponse,
  Friend,
} from "@/types/friendsContext";

export const FriendsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* useAuth hook to obtain user id */
  const { user, isAuthenticated } = useAuth();

  /* useLanguage hook */
  const { t } = useLanguage();

  /* useState to manage friends, pending requests, loading state and error messages */
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  /* API base URL */
  const API = import.meta.env.VITE_USER_API_BASEURL_EXTERNAL;

  const refreshFriends = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/friends/${user.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error loading friends");
      const data: FriendsApiResponse[] = await res.json();

      const items = await Promise.all(
        data.map(async (item) => {
          const friendId =
            item.user_a === Number(user.id) ? item.user_b : item.user_a;

          // fetch alias
          const aliasRes = await fetch(`${API}/${friendId}`, {
            credentials: "include",
          });
          if (!aliasRes.ok) throw new Error("Error loading friend alias");

          const { alias, last_active } = await aliasRes.json();

          const ms = new Date(last_active).getTime();
          // fetch avatar
          const avatarRes = await fetch(`${API}/${friendId}/avatar`, {
            credentials: "include",
          });
          let avatarUrl: string | undefined;
          if (avatarRes.ok) {
            const blob = await avatarRes.blob();
            avatarUrl = URL.createObjectURL(blob);
          }

          return {
            id: friendId,
            alias,
            online: isNaN(ms)
              ? false
              : Math.floor(ms / 1000) >= Math.floor(Date.now() / 1000) - 120, // Online if last active within the last 2 minutes
            avatar: avatarUrl,
            from: item.user_a,
            to: item.user_b,
            status: item.status as FriendStatus,
          } as Friend;
        })
      );

      setFriends(items.filter((f) => f.status === FriendStatus.Accepted));
      setPending(items.filter((f) => f.status === FriendStatus.Pending));
    } catch {
      // Silencioso: falla la carga de amigos
    } finally {
      setLoading(false);
    }
  }, [API, isAuthenticated, user]);

  /* Function to send a friend request */
  const sendRequest = useCallback(
    async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
      // Check if user is authenticated and has user's data
      if (!isAuthenticated || !user)
        return { ok: false, message: t("notifications_friend_request_error") };

      // Send request and wait for response
      try {
        const res = await fetch(`${API}/friend`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: user.id,
            to: toUserId,
          }),
        });

        // Check if response is ok
        if (!res.ok) {
          if (res.status === 409) {
            throw new Error(t("notifications_friend_request_already_sent"));
          } else if (res.status === 400) {
            throw new Error(t("notifications_friend_request_already_friends"));
          } else {
            throw new Error(t("notifications_friend_request_error"));
          }
        }

        return { ok: true };
      } catch (err: any) {
        return {
          ok: false,
          message: err.message || t("notifications_friend_request_error"),
        };
      }
    },
    [API, isAuthenticated, user, t]
  );

  /* Function to accept a friend request */
  const acceptRequest = useCallback(
    async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
      // Check if user is authenticated and has user's data
      if (!isAuthenticated || !user)
        return { ok: false, message: t("notifications_friend_request_error") };

      // Send accepted request and wait for response
      try {
        const res = await fetch(`${API}/friend`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: user.id,
            to: toUserId,
          }),
        });

        // Check if response is ok
        if (!res.ok) {
          if (res.status === 409) {
            throw new Error(t("notifications_friend_request_already_sent"));
          } else if (res.status === 400) {
            throw new Error(t("notifications_friend_request_already_friends"));
          } else {
            throw new Error(t("notifications_friend_request_error"));
          }
        }

        return { ok: true };
      } catch (err: any) {
        return {
          ok: false,
          message: err.message || t("notifications_friend_request_error"),
        };
      }
    },
    [API, isAuthenticated, user, t]
  );

  /* Function to decline a friend request */
  const declineRequest = useCallback(
    async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
      // Check if user is authenticated and has user's data
      if (!isAuthenticated || !user)
        return { ok: false, message: t("notifications_friend_request_error") };

      // Send declined request and wait for response
      try {
        const res = await fetch(`${API}/friends`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: user.id,
            to: toUserId,
          }),
        });

        // Check if response is ok
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(t("notifications_friend_request_not_found_1"));
          } else {
            throw new Error(t("notifications_friend_request_error"));
          }
        }

        return { ok: true };
      } catch (err: any) {
        return {
          ok: false,
          message: err.message || t("notifications_friend_request_error"),
        };
      }
    },
    [API, isAuthenticated, user, t]
  );

  /* Function to remove a friend */
  const removeFriend = useCallback(
    async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
      // Check if user is authenticated and has user's data
      if (!isAuthenticated || !user)
        return { ok: false, message: t("notifications_friend_request_error") };
      // Send request to remove friend and wait for response
      try {
        const res = await fetch(`${API}/friends`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: user.id,
            to: toUserId,
          }),
        });

        // Check if response is ok
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(t("notifications_friend_request_not_found_2"));
          } else {
            throw new Error(t("notifications_friend_request_error"));
          }
        }

        return { ok: true };
      } catch (err: any) {
        return {
          ok: false,
          message: err.message || t("notifications_friend_request_error"),
        };
      }
    },
    [API, isAuthenticated, user, t]
  );

  // Initial fetch of friends and pending requests
  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        pending,
        loading,
        refreshFriends,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriend,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
