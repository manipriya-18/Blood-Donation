/* ---------- INTERFACE ---------- */
interface Student {
    id: string;
    name: string;
    email: string;
    age: string;
    gender: string;
    phone: string;
    branch: string;
    blood: string;
    course:string;
}

/* ---------- DATA ---------- */
let students: Student[] = JSON.parse(localStorage.getItem("students") || "[]");

/* ---------- TOAST ---------- */
function showToast(message: string): void {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* ---------- FORM ---------- */
const form = document.getElementById("registrationForm") as HTMLFormElement;

/* ---------- SHOW ERROR ---------- */
function showError(id: string, message: string): void {
    const error = document.getElementById(id);
    if (error) error.textContent = message;
}

/* ---------- CLEAR ERRORS ---------- */
function clearErrors(): void {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

/* ---------- VALIDATION ---------- */
function validateForm(): boolean {
    clearErrors();
    let isValid = true;

    const id = (document.getElementById("id") as HTMLInputElement)?.value.trim();
    const name = (document.getElementById("name") as HTMLInputElement)?.value.trim();
    const email = (document.getElementById("email") as HTMLInputElement)?.value.trim();
    const age = (document.getElementById("age") as HTMLInputElement)?.value.trim();
    const gender = (document.getElementById("gender") as HTMLSelectElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value.trim();
    const branch = (document.getElementById("branch") as HTMLInputElement)?.value.trim();
    const blood = (document.getElementById("blood") as HTMLSelectElement)?.value;
    const course = (document.getElementById("course") as HTMLSelectElement).value;

if (!course) {
    showError("courseError", "Please select course");
    isValid = false;
}

    if (!id) { showError("idError", "Student ID is required"); isValid = false; }
    if (!name) { showError("nameError", "Name is required"); isValid = false; }
    if (!email) { showError("emailError", "Email is required"); isValid = false; }
    if (!age) { showError("ageError", "Age is required"); isValid = false; }
    if (!gender) { showError("genderError", "Please select gender"); isValid = false; }
    if (!phone) { showError("phoneError", "Phone number is required"); isValid = false; }
    if (!branch) { showError("branchError", "Branch is required"); isValid = false; }
    if (!blood) { showError("bloodError", "Please select blood group"); isValid = false; }

    return isValid;
}

/* ---------- FORM SUBMIT ---------- */
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const student: Student = {
            id: (document.getElementById("id") as HTMLInputElement).value,
            name: (document.getElementById("name") as HTMLInputElement).value,
            email: (document.getElementById("email") as HTMLInputElement).value,
            age: (document.getElementById("age") as HTMLInputElement).value,
            gender: (document.getElementById("gender") as HTMLSelectElement).value,
            phone: (document.getElementById("phone") as HTMLInputElement).value,
            branch: (document.getElementById("branch") as HTMLInputElement).value,
            blood: (document.getElementById("blood") as HTMLSelectElement).value,
            course: (document.getElementById("course") as HTMLSelectElement).value,

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
let filteredData: Student[] = [...students];

/* ---------- DISPLAY TABLE ---------- */
function display(data: Student[]): void {
    const tbody = document.querySelector("#studentTable tbody") as HTMLElement;
    if (!tbody) return;

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
function renderPagination(): void {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

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
        if (i === currentPage) btn.classList.add("active");
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
function renderPage(): void {
    const start = (currentPage - 1) * recordsPerPage;
    display(filteredData.slice(start, start + recordsPerPage));
    renderPagination();
}

/* ---------- SEARCH ---------- */
function searchStudent(): void {
    const branch = (document.getElementById("searchBranch") as HTMLSelectElement).value;
    const blood = (document.getElementById("searchBlood") as HTMLSelectElement).value;
    const gender = (document.getElementById("searchGender") as HTMLSelectElement).value;

    filteredData = students.filter(s =>
        (branch === "" || s.branch === branch) &&
        (blood === "" || s.blood === blood) &&
        (gender === "" || s.gender === gender)
    );

    currentPage = 1;
    renderPage();
}

/* ---------- RESET SEARCH ---------- */
function resetSearch(): void {
    filteredData = [...students];
    currentPage = 1;
    renderPage();
}

/* ---------- INITIAL LOAD ---------- */
if (document.getElementById("studentTable")) {
    renderPage();
}


/* ---------- COURSE → BRANCH MAPPING ---------- */
const courseBranchMap: { [key: string]: string[] } = {
    BTech: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    Diploma: ["CSE", "ECE", "MECH", "EEE"],
    MTech: ["CSE", "ECE", "MECH"]
};

const courseSelect = document.getElementById("course") as HTMLSelectElement;
const branchSelect = document.getElementById("branch") as HTMLSelectElement;

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
