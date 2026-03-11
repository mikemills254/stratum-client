import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import supabase from "./supabase";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        try {
            const { data } = await supabase.auth.getSession();
            const session = data?.session;
            
            if (session?.access_token) {
                if (!config.headers) config.headers = {} as any;
                config.headers["Authorization"] = `Bearer ${session.access_token}`;
            } else {
                console.warn("Interceptors: No session or access_token found");
            }
        } catch (e) {
            console.error("Interceptors: Error fetching session", e);
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            console.error("Interceptors: 401 Unauthorized Response", {
                data: error.response?.data,
                message: error.response?.data?.message || error.message,
                url: originalRequest?.url,
            });
        }

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers["Authorization"] = `Bearer ${session.access_token}`;
                    return api(originalRequest);
                }
            } catch (e) {
                console.error("Interceptors: Refresh failed", e);
            }

            // Temporarily disabled auto-signout to debug 401 server response
            /*
            try {
                await signOut();
            } catch (e) { }
            */
        }

        return Promise.reject(error);
    },
);


