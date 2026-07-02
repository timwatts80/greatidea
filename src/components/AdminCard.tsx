"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AdminCard() {
  const [isVisible, setIsVisible] = useState(true);
  const [adminToken, setAdminToken] = useState("");
  const [subheader, setSubheader] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setAdminToken(savedToken);
    }

    fetch("https://api.greatidea-cs.com/v1/content/hero")
      .then((res) => res.json())
      .then((data) => {
        setSubheader(data.subheader || "");
      })
      .catch(() => {});
  }, []);

  const handleTokenChange = (value: string) => {
    setAdminToken(value);
    localStorage.setItem("adminToken", value);
  };

  const handleSubheaderChange = (value: string) => {
    setSubheader(value);
    if (fieldErrors.subheader) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.subheader;
        return next;
      });
    }
  };

  const handleUpdate = async () => {
    setStatusMessage(null);
    setFieldErrors({});

    if (!adminToken.trim()) {
      setStatusMessage({ type: "error", text: "Admin token is required" });
      return;
    }
    if (!subheader.trim()) {
      setStatusMessage({ type: "error", text: "Subheader is required" });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("https://api.greatidea-cs.com/v1/content/hero", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subheader }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Saved. Reload the page to see changes.",
        });
        sessionStorage.removeItem("hero-content");
      } else if (response.status === 401) {
        setStatusMessage({ type: "error", text: "Invalid admin token." });
      } else if (response.status === 400 && data.errors) {
        setFieldErrors(data.errors);
        setStatusMessage({ type: "error", text: "Please fix the errors below." });
      } else {
        setStatusMessage({ type: "error", text: "Something went wrong — please try again." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Something went wrong — please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[360px] z-50 px-4 sm:px-0">
      <div className="glow-card p-6 rounded-2xl backdrop-blur-xl bg-card/95 border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">Edit Hero Subheader</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="admin-token" className="block text-sm text-foreground/80 mb-2">
            Admin token
          </label>
          <input
            type="password"
            id="admin-token"
            value={adminToken}
            onChange={(e) => handleTokenChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Enter admin token"
          />
          <p className="text-xs text-muted-foreground mt-1">Saved in your browser only.</p>
        </div>

        <div className="mb-4">
          <label htmlFor="subheader" className="block text-sm text-foreground/80 mb-2">
            Subheader
          </label>
          <textarea
            id="subheader"
            value={subheader}
            onChange={(e) => handleSubheaderChange(e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 rounded-lg bg-input-background border ${
              fieldErrors.subheader ? "border-destructive" : "border-border"
            } text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none`}
            placeholder="Custom AI solutions powered by Claude for creative projects..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            The paragraph text below the rotating headlines.
          </p>
          {fieldErrors.subheader && (
            <p className="text-destructive text-xs mt-1">{fieldErrors.subheader}</p>
          )}
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="glow-button-primary w-full px-6 py-3 rounded-lg text-primary-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Updating…" : "Update"}
        </button>

        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              statusMessage.type === "success"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            <p>{statusMessage.text}</p>
            {statusMessage.type === "success" && (
              <button
                onClick={() => window.location.reload()}
                className="underline hover:no-underline mt-1 text-xs"
              >
                Reload now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
