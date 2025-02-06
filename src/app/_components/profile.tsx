"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function UserProfile() {
  const [userProfile] = api.user.getProfile.useSuspenseQuery();
  console.log(userProfile);
  return (
    <div className="w-full max-w-xs">
      {userProfile ? (
        <div>
            <p className="truncate">ID: {userProfile?.id}</p>
            <p className="truncate">Name: {userProfile?.name}</p>
            <p className="truncate">Email: {userProfile?.email}</p>
            <p className="truncate">Email Verified On: {userProfile?.emailVerified ? userProfile.emailVerified.getDate() : "UNVERIFIED"}</p>
        </div>
      ) : (
        <p>There was a problem getting your account information...</p>
      )}
    </div>
  );
}
