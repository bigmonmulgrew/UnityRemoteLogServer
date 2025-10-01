let expandedRows = new Set();

async function fetchLogs() {
    const response = await fetch('/logs');
    if (!response.ok) return [];
    return await response.json();
}

function renderLogs(logs) {
    const tbody = document.getElementById("logBody");
    tbody.innerHTML = "";

    const filters = [...document.querySelectorAll('#filters input:checked')].map(cb => cb.value);
    const newestFirst = document.getElementById("sortToggle").checked;

    let displayLogs = [...logs];
    if (newestFirst) {
        displayLogs.reverse();
    }

    displayLogs.forEach((log, idx) => {
        if (!filters.includes(log.type)) return;

        const rowId = log.timestamp + "_" + log.message; // crude unique key

        const tr = document.createElement("tr");
        tr.className = "log-" + log.type.toLowerCase();
        if (expandedRows.has(rowId)) tr.classList.add("selected");

        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
            <td>${log.type}</td>
            <td>${log.level}</td>
            <td>${log.context || "null"}</td>
            <td class="message-cell">${log.message}</td>
        `;

        tr.addEventListener("click", () => {
            if (expandedRows.has(rowId)) {
                expandedRows.delete(rowId);
            } else {
                expandedRows.add(rowId);
            }
            renderLogs(logs); // re-render immediately
        });

        tbody.appendChild(tr);

        if (expandedRows.has(rowId)) {
            const stackRow = document.createElement("tr");
            stackRow.className = "stack-row";
            stackRow.innerHTML = `
                <td colspan="6">
                    <pre>${log.stacktrace || "No stack trace"}</pre>
                </td>
            `;
            tbody.appendChild(stackRow);
        }
    });
}

async function update() {
    const logs = await fetchLogs();
    renderLogs(logs);
}

setInterval(update, 1000); // refresh every second
update();

// filter toggle triggers refresh
document.getElementById("filters").addEventListener("change", update);
