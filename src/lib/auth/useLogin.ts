import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  apiResponseEnvelopeSchema,
  loginSchema,
  type LoginPayload,
} from "@/types/auth/loginSchemas";
import { normalizeBranches } from "@/lib/auth/auth-branches";
import { clearAuthSession, setAuthSession } from "@/lib/auth/auth-session";

interface UseLoginOptions {
  redirectUrl?: string;
}

interface UseLoginResult {
  formState: LoginPayload;
  setFormState: React.Dispatch<React.SetStateAction<LoginPayload>>;
  formError: string | null;
  loginResponse: string | null;
  mutationError: Error | null;
  isPending: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function storeLoginIdentityFromPayload(
  payload: unknown,
  token?: string | null,
): void {
  if (typeof window === "undefined") return;
  if (!isRecord(payload)) return;

  const actorIdRaw = payload["actorId"];
  const actorId =
    typeof actorIdRaw === "string" && actorIdRaw.trim()
      ? actorIdRaw.trim()
      : null;

  const emailOrUsernameRaw = payload["email"] ?? payload["username"];
  const username =
    typeof emailOrUsernameRaw === "string" && emailOrUsernameRaw.trim()
      ? emailOrUsernameRaw.trim()
      : null;
  const email = username && username.includes("@") ? username : null;

  const branches = normalizeBranches(payload["branches"]);

  setAuthSession({
    token: token ?? null,
    actorId,
    username,
    email,
    assignedBranches: branches,
  });
}

export function useLogin(options: UseLoginOptions = {}): UseLoginResult {
  const { redirectUrl = "http://localhost:3000/dashboard" } = options;
  const [formState, setFormState] = useState<LoginPayload>({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? "" : apiBaseUrl || "";
      const url = `${base}/auth/login`;

      const requestBody = {
        username: payload.username,
        password: payload.password,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(requestBody),
        });

        const rawText = await response.text().catch(() => "");

        if (!response.ok) {
          throw new Error(
            `Login failed (${response.status}). ${rawText || "Check server logs for details."}`,
          );
        }

        const trimmed = rawText.trim();
        if (
          !trimmed ||
          !(trimmed.startsWith("{") || trimmed.startsWith("["))
        ) {
          throw new Error("Unexpected response format from login service.");
        }

        const jsonData: unknown = JSON.parse(trimmed);
        const envelope = apiResponseEnvelopeSchema.safeParse(jsonData);

        if (envelope.success) {
          if (envelope.data.success === false) {
            throw new Error(envelope.data.message ?? "Login failed.");
          }

          const data = envelope.data.data;

          // Token returned as string in envelope
          if (typeof data === "string" && data.trim()) {
            const token = data.trim();
            // Try parsing if it's nested JSON (some backends do this)
            if (token.startsWith("{")) {
              try {
                const parsed: unknown = JSON.parse(token);
                if (isRecord(parsed)) {
                  const extractedToken =
                    typeof parsed["token"] === "string"
                      ? parsed["token"].trim()
                      : null;
                  storeLoginIdentityFromPayload(parsed, extractedToken);
                  return extractedToken ?? "";
                }
              } catch {
                // Not nested JSON, treat as raw token
              }
            }
            return token;
          }

          // Token + identity payload in envelope.data
          if (isRecord(data)) {
            const token =
              typeof data["token"] === "string" ? data["token"].trim() : null;
            storeLoginIdentityFromPayload(data, token);
            return token ?? "";
          }

          throw new Error("Login succeeded but returned unexpected data format.");
        }

        // Direct payload (not wrapped in envelope) - cookie-based auth
        if (isRecord(jsonData)) {
          const token =
            typeof jsonData["token"] === "string"
              ? jsonData["token"].trim()
              : null;
          storeLoginIdentityFromPayload(jsonData, token);
          return token ?? "";
        }

        throw new Error("Unexpected response from the login service.");
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || "Unable to reach the server.");
        }
        throw new Error(
          "Unable to reach the server. Check the API URL and that the backend is running.",
        );
      }
    },
    onSuccess: async (token) => {
      if (typeof token === "string" && token.trim()) {
        setLoginResponse("Login success. Token received.");
      } else {
        setLoginResponse("Login success. (Session cookie set)");
      }

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          window.location.href = redirectUrl;
        }, 800);
      }
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginResponse(null);
    const parsed = loginSchema.safeParse(formState);
    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? "Please check your login details.",
      );
      return;
    }

    if (typeof window !== "undefined") {
      // Clear any previous user identity so the header can't get stuck.
      clearAuthSession();
      setAuthSession({
        username: parsed.data.username,
        email: parsed.data.username.includes("@")
          ? parsed.data.username
          : null,
        assignedBranches: [],
      });
    }

    setFormError(null);
    loginMutation.mutate(parsed.data);
  };

  return {
    formState,
    setFormState,
    formError,
    loginResponse,
    mutationError: loginMutation.error instanceof Error
      ? loginMutation.error
      : null,
    isPending: loginMutation.isPending,
    handleSubmit,
  };
}