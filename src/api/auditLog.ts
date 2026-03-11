import axios from "axios";

export const handleGetAuditLogs = async (params: { workbookId?: string, limit?: number } = {}) => {
    try {
        const urlParams = new URLSearchParams();
        if (params.workbookId) urlParams.append("workbookId", params.workbookId);
        if (params.limit) urlParams.append("limit", params.limit.toString());

        const queryString = urlParams.toString() ? `?${urlParams.toString()}` : "";

        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/audit-log${queryString}`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.data) {
            return {
                data: response.data.data || response.data,
                message: "Fetched audit logs successfully",
                success: true
            };
        }

        return {
            success: false,
            message: "Failed to fetch audit logs"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred while fetching audit logs"
        };
    }
};
