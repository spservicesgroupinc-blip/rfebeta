
import { GOOGLE_SCRIPT_URL } from '../constants';
import { CalculatorState, EstimateRecord, UserSession } from '../types';

interface ApiResponse {
    status: 'success' | 'error';
    data?: any;
    message?: string;
}

/**
 * Helper to check if API is configured
 */
const isApiConfigured = () => {
    return GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('PLACEHOLDER');
};

/**
 * Helper for making robust fetch requests to GAS
 */
const apiRequest = async (payload: any, retries = 2): Promise<ApiResponse> => {
    if (!isApiConfigured()) {
        return { status: 'error', message: 'API Config Missing' };
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        return result;
    } catch (error: any) {
        if (retries > 0) {
            console.warn(`API Request Failed, retrying... (${retries} left)`);
            await new Promise(res => setTimeout(res, 1000)); 
            return apiRequest(payload, retries - 1);
        }
        console.error("API Request Failed:", error);
        return { status: 'error', message: error.message || "Network request failed" };
    }
};

/**
 * Submits Beta Sign Up Form with Survey Data
 */
export const submitBetaSignup = async (name: string, email: string, phone: string, survey: any): Promise<boolean> => {
    const result = await apiRequest({ action: 'SUBMIT_BETA_SIGNUP', payload: { name, email, phone, survey } });
    return result.status === 'success';
};

/**
 * Syncs local state UP to the cloud
 */
export const syncUp = async (state: CalculatorState, spreadsheetId: string): Promise<boolean> => {
    const result = await apiRequest({ action: 'SYNC_UP', payload: { state, spreadsheetId } });
    return result.status === 'success';
};

/**
 * Syncs state DOWN from the cloud
 */
export const syncDown = async (spreadsheetId: string): Promise<Partial<CalculatorState> | null> => {
    const result = await apiRequest({ action: 'SYNC_DOWN', payload: { spreadsheetId } });
    if (result.status === 'success' && result.data) {
        return result.data;
    }
    return null;
};

/**
 * User Login
 */
export const loginUser = async (username: string, password: string): Promise<UserSession | null> => {
    const result = await apiRequest({ action: 'LOGIN', payload: { username, password } });
    if (result.status === 'success' && result.data) {
        return result.data as UserSession;
    }
    return null;
};

/**
 * User Signup
 */
export const signupUser = async (username: string, password: string, companyName: string): Promise<UserSession | null> => {
    const result = await apiRequest({ action: 'SIGNUP', payload: { username, password, companyName } });
    if (result.status === 'success' && result.data) {
        return result.data as UserSession;
    }
    return null;
};

/**
 * Crew Login
 */
export const loginCrew = async (username: string, pin: string): Promise<UserSession | null> => {
    const result = await apiRequest({ action: 'LOGIN_CREW', payload: { username, pin } });
    if (result.status === 'success' && result.data) {
        return result.data as UserSession;
    }
    return null;
};

/**
 * Upload Image
 */
export const uploadImage = async (base64Data: string, filename: string, spreadsheetId: string, folderId: string): Promise<string | null> => {
    const result = await apiRequest({ action: 'UPLOAD_IMAGE', payload: { image: base64Data, filename, spreadsheetId, folderId } });
    if (result.status === 'success' && result.data && result.data.url) {
        return result.data.url;
    }
    return null;
};

/**
 * Log Crew Time
 */
export const logCrewTime = async (sheetUrl: string, start: string, end: string, user: string): Promise<boolean> => {
    const result = await apiRequest({ action: 'LOG_TIME', payload: { sheetUrl, start, end, user } });
    return result.status === 'success';
};

/**
 * Complete Job
 */
export const completeJob = async (estimateId: string, actuals: any, spreadsheetId: string): Promise<boolean> => {
    const result = await apiRequest({ action: 'COMPLETE_JOB', payload: { estimateId, actuals, spreadsheetId } });
    return result.status === 'success';
};

/**
 * Delete Estimate
 */
export const deleteEstimate = async (estimateId: string, spreadsheetId: string): Promise<boolean> => {
    const result = await apiRequest({ action: 'DELETE_ESTIMATE', payload: { estimateId, spreadsheetId } });
    return result.status === 'success';
};

/**
 * Mark Job Paid
 */
export const markJobPaid = async (estimateId: string, spreadsheetId: string): Promise<{ success: boolean; estimate?: EstimateRecord }> => {
    const result = await apiRequest({ action: 'MARK_PAID', payload: { estimateId, spreadsheetId } });
    if (result.status === 'success' && result.data) {
        return { success: true, estimate: result.data };
    }
    return { success: false };
};

/**
 * Create Work Order Sheet
 */
export const createWorkOrderSheet = async (estimate: EstimateRecord, folderId: string, spreadsheetId: string): Promise<string | null> => {
    const result = await apiRequest({ action: 'CREATE_WORK_ORDER', payload: { estimate, folderId, spreadsheetId } });
    if (result.status === 'success' && result.data && result.data.url) {
        return result.data.url;
    }
    return null;
};
