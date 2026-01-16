// --- CONFIGURATION ---
// "parts: 1" = Standard Square
// "parts: 2" = Split Diagonal Square
const taskDefinitions = [
    { name: "Kitchen Clean", parts: 1 },
    { name: "Take Vitamins", parts: 1 },
    { name: "Water (AM/PM)", parts: 2 }, // <--- This will be split
    { name: "Do Exercise", parts: 1 },
    { name: "Walk Dog", parts: 2 },      // <--- This will be split
    { name: "Read Book", parts: 1 },
    { name: "No Sugar", parts: 1 }
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- SETUP & SAFETY CHECK ---
const container = document.getElementById("app-container");

// Load raw data
let rawData = localStorage.getItem("myTasks");
let taskData = [];

if (rawData) {
    let parsed = JSON.parse(rawData);
    // SAFETY CHECK: 
    // If the saved data is the old format (Strings like "neutral"), we must RESET it.
    // We check if the first item is a string. If so, wipe it.
    if (parsed.length > 0 && typeof parsed[0] === "string") {
        console.log("Old data format detected. Resetting database.");
        taskData = []; // Wipe clean to prevent crash
    } else {
        taskData = parsed;
    }
}

// --- DATA INITIALIZATION ---
// We need to ensure every day has the correct array size (1 or 2 items)
const totalRows = taskDefinitions.length;
const totalDays = 7;

// Loop through every slot and ensure it exists and has correct parts
taskDefinitions.forEach((taskDef, rowIndex) => {
    for (let day = 0; day < 7; day++) {
        const flatIndex = (rowIndex * 7) + day;
        
        // If data is missing or wrong size, create fresh "neutral" array
        if (!taskData[flatIndex] || taskData[flatIndex].length !== taskDef.parts) {
            taskData[flatIndex] = new Array(taskDef.parts).fill("neutral");
        }
    }
});

// --- RENDER ENGINE ---
function renderGrid() {
    container.innerHTML = ''; 

    // 1. Headers
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
    taskDefinitions.forEach((task, rowIndex) => {
        // Label
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = task.name;
        container.appendChild(label);

        // Days
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const flatIndex = (rowIndex * 7) + dayIndex;
            const currentStates = taskData[flatIndex]; // This is an Array now! e.g. ["neutral", "neutral"]

            // Create the container square
            const squareContainer = document.createElement("div");
            squareContainer.classList.add("task-square");

            // Loop through the parts (1 or 2)
            currentStates.forEach((status, partIndex) => {
                const btn = document.createElement("div");
                btn.classList.add("split-part", status); // Adds color class

                // Handle Shapes
                if (task.parts === 1) {
                    // If it's a single task, remove the triangle clip so it fills the box
                    btn.style.clipPath = "none";
                } else {
                    // If split, assign Top-Left (0) or Bottom-Right (1)
                    btn.classList.add(`part-${partIndex}`);
                }

                // Click Handler
                btn.onclick = (e) => {
                    e.stopPropagation(); // Stop click going through to container
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
    
    // Update the specific part of the array
    taskData[flatIndex][partIndex] = newStatus;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

renderGrid();