export async function fetchPatients() {
    const res = await fetch("/api/patients");
    if (!res.ok) throw new Error("Failed to load patients");
    return res.json();
}

export async function createPatient(payload) {
    const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create patient");
    }
    return res.json();
}
