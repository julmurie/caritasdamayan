async function jsonFetch(url, options = {}) {
    const res = await fetch(url, {
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(options.headers || {}),
        },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
    }
    return data;
}

export async function fetchPatients() {
    return jsonFetch("/api/patients");
}

export async function fetchPatientById(id) {
    return jsonFetch(`/api/patients/${id}`);
}

export async function createPatient(payload) {
    // 1) try JSON
    try {
        return await jsonFetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        // 2) fallback to multipart/form-data (common in Laravel examples)
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
        return jsonFetch("/api/patients", { method: "POST", body: fd });
    }
}

export async function updatePatient(id, payload) {
    const res = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update patient");
    }
    return res.json();
}
