"use strict";
/* ---------- DATA ---------- */
let students = JSON.parse(localStorage.getItem("students") || "[]");
/* ---------- TOAST ---------- */
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast)
        return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
/* ---------- FORM ---------- */
const form = document.getElementById("registrationForm");
/* ---------- SHOW ERROR ---------- */
function showError(id, message) {
    const error = document.getElementById(id);
    if (error)
        error.textContent = message;
}
/* ---------- CLEAR ERRORS ---------- */
function clearErrors() {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}
/* ---------- VALIDATION ---------- */
function validateForm() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    clearErrors();
    let isValid = true;
    const id = (_a = document.getElementById("id")) === null || _a === void 0 ? void 0 : _a.value.trim();
    const name = (_b = document.getElementById("name")) === null || _b === void 0 ? void 0 : _b.value.trim();
    const email = (_c = document.getElementById("email")) === null || _c === void 0 ? void 0 : _c.value.trim();
    const age = (_d = document.getElementById("age")) === null || _d === void 0 ? void 0 : _d.value.trim();
    const gender = (_e = document.getElementById("gender")) === null || _e === void 0 ? void 0 : _e.value;
    const phone = (_f = document.getElementById("phone")) === null || _f === void 0 ? void 0 : _f.value.trim();
    const branch = (_g = document.getElementById("branch")) === null || _g === void 0 ? void 0 : _g.value.trim();
    const blood = (_h = document.getElementById("blood")) === null || _h === void 0 ? void 0 : _h.value;
    const course = document.getElementById("course").value;
    if (!course) {
        showError("courseError", "Please select course");
        isValid = false;
    }
    if (!id) {
        showError("idError", "Student ID is required");
        isValid = false;
    }
    if (!name) {
        showError("nameError", "Name is required");
        isValid = false;
    }
    if (!email) {
        showError("emailError", "Email is required");
        isValid = false;
    }
    if (!age) {
        showError("ageError", "Age is required");
        isValid = false;
    }
    if (!gender) {
        showError("genderError", "Please select gender");
        isValid = false;
    }
    if (!phone) {
        showError("phoneError", "Phone number is required");
        isValid = false;
    }
    if (!branch) {
        showError("branchError", "Branch is required");
        isValid = false;
    }
    if (!blood) {
        showError("bloodError", "Please select blood group");
        isValid = false;
    }
    return isValid;
}
/* ---------- FORM SUBMIT ---------- */
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        const student = {
            id: document.getElementById("id").value,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            phone: document.getElementById("phone").value,
            branch: document.getElementById("branch").value,
            blood: document.getElementById("blood").value,
            course: document.getElementById("course").value,
        };
        students.push(student);
        localStorage.setItem("students", JSON.stringify(students));
        // ✅ TOAST INSTEAD OF ALERT
        showToast("Student Registered Successfully ✅");
        form.reset();
    });
}
/* ---------- DASHBOARD PAGINATION ---------- */
let currentPage = 1;
const recordsPerPage = 5;
let filteredData = [...students];
/* ---------- DISPLAY TABLE ---------- */
function display(data) {
    const tbody = document.querySelector("#studentTable tbody");
    if (!tbody)
        return;
    tbody.innerHTML = data.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.age}</td>
            <td>${s.gender}</td>
            <td>${s.phone}</td>
            <td>${s.branch}</td>
            <td>${s.blood}</td>
        </tr>
    `).join("");
    const info = document.getElementById("recordInfo");
    if (info) {
        const start = (currentPage - 1) * recordsPerPage + 1;
        const end = Math.min(currentPage * recordsPerPage, filteredData.length);
        info.textContent = `Showing ${start} to ${end} of ${filteredData.length} records`;
    }
}
/* ---------- PAGINATION ---------- */
function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination)
        return;
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const prev = document.createElement("button");
    prev.textContent = "⬅ Prev";
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; renderPage(); };
    pagination.appendChild(prev);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i.toString();
        if (i === currentPage)
            btn.classList.add("active");
        btn.onclick = () => { currentPage = i; renderPage(); };
        pagination.appendChild(btn);
    }
    const next = document.createElement("button");
    next.textContent = "Next ➡";
    next.disabled = currentPage === totalPages;
    next.onclick = () => { currentPage++; renderPage(); };
    pagination.appendChild(next);
}
/* ---------- RENDER PAGE ---------- */
function renderPage() {
    const start = (currentPage - 1) * recordsPerPage;
    display(filteredData.slice(start, start + recordsPerPage));
    renderPagination();
}
/* ---------- SEARCH ---------- */
function searchStudent() {
    const branch = document.getElementById("searchBranch").value;
    const blood = document.getElementById("searchBlood").value;
    const gender = document.getElementById("searchGender").value;
    filteredData = students.filter(s => (branch === "" || s.branch === branch) &&
        (blood === "" || s.blood === blood) &&
        (gender === "" || s.gender === gender));
    currentPage = 1;
    renderPage();
}
/* ---------- RESET SEARCH ---------- */
function resetSearch() {
    filteredData = [...students];
    currentPage = 1;
    renderPage();
}
/* ---------- INITIAL LOAD ---------- */
if (document.getElementById("studentTable")) {
    renderPage();
}
/* ---------- COURSE → BRANCH MAPPING ---------- */
const courseBranchMap = {
    BTech: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    Diploma: ["CSE", "ECE", "MECH", "EEE"],
    MTech: ["CSE", "ECE", "MECH"]
};
const courseSelect = document.getElementById("course");
const branchSelect = document.getElementById("branch");
if (courseSelect && branchSelect) {
    courseSelect.addEventListener("change", () => {
        const selectedCourse = courseSelect.value;
        branchSelect.innerHTML = `<option value="">Select Branch</option>`;
        if (courseBranchMap[selectedCourse]) {
            courseBranchMap[selectedCourse].forEach(branch => {
                const option = document.createElement("option");
                option.value = branch;
                option.textContent = branch;
                branchSelect.appendChild(option);
            });
        }
    });
}
