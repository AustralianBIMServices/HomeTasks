// --- CONFIGURATION ---
const taskDefinitions = [
    "Kitchen Clean",
    "Take Vitamins",
    "Do Exercise",
    "Read 10 Mins",
    "Walk Dog",
    "No Sugar",
    "Sleep 8hrs"
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- SETUP ---
const container = document.getElementById("app-container");
const totalSquares = taskDefinitions.length * 7;

// Load data or create new
let taskData = JSON.parse(localStorage.getItem("myTasks")) || new Array(totalSquares).fill("neutral");

// Resize check (if you changed task list size)
if (taskData.length !== totalSquares) {
    // If mismatch, reset data (simplest way to prevent bugs during dev)
    taskData = new Array(totalSquares).fill("neutral");
}

function renderGrid() {
    container.innerHTML = ''; 

    // 1. Headers (Top Row)
    const corner = document.createElement("div");
    corner.classList.add("cell", "header-cell");
    corner.innerText = "Task";
    container.appendChild(corner);

    dayHeaders.forEach(day => {
        const header = document.createElement("div");
        header.classList.add("cell", "header-cell");
        header.innerText = day;
        container.appendChild(header);
    });

    // 2. Rows
    taskDefinitions.forEach((taskName, rowIndex) => {
        // Label (Left Column)
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = taskName;
        container.appendChild(label);

        // Days (7 Columns)
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const flatIndex = (rowIndex * 7) + dayIndex;
            
            const square = document.createElement("div");
            square.classList.add("cell", "task-square");

            // Apply Color
            const status = taskData[flatIndex];
            if (status === "completed") square.classList.add("completed");
            if (status === "failed") square.classList.add("failed");

            // Click Handler
            square.onclick = () => toggleStatus(flatIndex);

            container.appendChild(square);
        }
    });
}

function toggleStatus(index) {
    const current = taskData[index];
    if (current === "neutral") taskData[index] = "completed";
    else if (current === "completed") taskData[index] = "failed";
    else taskData[index] = "neutral";

    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

renderGrid();