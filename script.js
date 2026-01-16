// --- CONFIGURATION ---
// 1 = Full Square. 2 = Split Diagonal Square.
const taskDefinitions = [
    { name: "Kitchen Clean", parts: 1 },
    { name: "Take Vitamins", parts: 1 },
    { name: "Water (AM/PM)", parts: 2 }, 
    { name: "Do Exercise", parts: 1 },
    { name: "Walk Dog", parts: 2 },
    { name: "Read Book", parts: 1 },
    { name: "No Sugar", parts: 1 }
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- SETUP ---
const container = document.getElementById("app-container");
const totalRows = taskDefinitions.length;
const totalDays = 7;
const neededSize = totalRows * totalDays;

// --- LOAD & REPAIR DATA ---
let taskData = JSON.parse(localStorage.getItem("myTasks")) || [];

// 1. Ensure array is long enough
if (taskData.length < neededSize) {
    for (let i = taskData.length; i < neededSize; i++) {
        taskData.push(null);
    }
}

// 2. Fix data structure (Strings vs Arrays)
taskDefinitions.forEach((taskDef, rowIndex) => {
    for (let day = 0; day < 7; day++) {
        const flatIndex = (rowIndex * 7) + day;
        let cellData = taskData[flatIndex];

        // If it's old data (string) or empty, make it an array
        if (!Array.isArray(cellData)) {
            taskData[flatIndex] = new Array(taskDef.parts).fill("neutral");
        } 
        // If the number of parts changed (e.g. 1 -> 2), reset it
        else if (cellData.length !== taskDef.parts) {
            taskData[flatIndex] = new Array(taskDef.parts).fill("neutral");
        }
    }
});

// --- RENDER ENGINE ---
function renderGrid() {
    container.innerHTML = ''; 

    // 1. Render Headers
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

    // 2. Render Rows
    taskDefinitions.forEach((task, rowIndex) => {
        // Label Column
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = task.name;
        container.appendChild(label);

        // Day Columns
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const flatIndex = (rowIndex * 7) + dayIndex;
            const currentStates = taskData[flatIndex]; 

            // The Cell Container
            const squareContainer = document.createElement("div");
            squareContainer.classList.add("task-square");

            // Generate Parts (Buttons)
            currentStates.forEach((status, partIndex) => {
                const btn = document.createElement("div");
                btn.classList.add("split-part", status);

                // If it is a 2-part task, add the triangle shape classes
                if (task.parts === 2) {
                    btn.classList.add(`part-${partIndex}`);
                } else {
                    // If it is 1-part, remove clip-path to fill the whole square
                    btn.style.clipPath = "none";
                }

                btn.onclick = (e) => {
                    e.stopPropagation(); 
                    toggleStatus(flatIndex, partIndex);
                };

                squareContainer.appendChild(btn);
            });

            container.appendChild(squareContainer);
        }
    });
}

function toggleStatus(flatIndex, partIndex) {
    const currentStatus = taskData[flatIndex][partIndex];
    let newStatus = "neutral";

    if (currentStatus === "neutral") newStatus = "completed";
    else if (currentStatus === "completed") newStatus = "failed";
    
    taskData[flatIndex][partIndex] = newStatus;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

// Initial Draw
renderGrid();