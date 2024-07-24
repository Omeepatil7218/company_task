// Load JSON data and populate the table
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('tableBody');
        const techIndiaSet = new Set();
        const techUSASet = new Set();

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item["Name"]}</td>
                <td><a href="${item["Company Website"]}" target="_blank">${item["Company Website"]}</a></td>
                <td>${item["What are the Technologies hiring in India "] || "N/A"}</td>
                <td>${item["What are the technologies hiring in the usa ?"] || "N/A"}</td>
                <td>${item["Do they have office in APAC ?"] ? "Yes" : "No"}</td>
            `;
            tableBody.appendChild(row);

            // Add to filter sets
            if (item["What are the Technologies hiring in India "]) {
                techIndiaSet.add(item["What are the Technologies hiring in India "]);
            }
            if (item["What are the technologies hiring in the usa ?"]) {
                techUSASet.add(item["What are the technologies hiring in the usa ?"]);
            }
        });

        // Populate filter dropdowns
        const filterTechIndia = document.getElementById('filterTechIndia');
        techIndiaSet.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech;
            option.text = tech;
            filterTechIndia.add(option);
        });

        const filterTechUSA = document.getElementById('filterTechUSA');
        techUSASet.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech;
            option.text = tech;
            filterTechUSA.add(option);
        });
    })
    .catch(error => console.error('Error loading data:', error));

// Function to filter table based on search input and dropdowns
function filterTable() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const filterTechIndia = document.getElementById('filterTechIndia').value.toUpperCase();
    const filterTechUSA = document.getElementById('filterTechUSA').value.toUpperCase();
    const filterAPAC = document.getElementById('filterAPAC').value.toUpperCase();
    const table = document.getElementById('companyTable');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const tds = tr[i].getElementsByTagName('td');
        let display = true;

        if (tds[0].textContent.toUpperCase().indexOf(input) === -1) {
            display = false;
        }
        if (filterTechIndia && tds[2].textContent.toUpperCase().indexOf(filterTechIndia) === -1) {
            display = false;
        }
        if (filterTechUSA && tds[3].textContent.toUpperCase().indexOf(filterTechUSA) === -1) {
            display = false;
        }
        if (filterAPAC && (filterAPAC === "TRUE" && tds[4].textContent.toUpperCase() !== "YES" || filterAPAC === "FALSE" && tds[4].textContent.toUpperCase() !== "NO")) {
            display = false;
        }

        tr[i].style.display = display ? '' : 'none';
    }
}

// Function to sort table
let sortDirection = "asc";
let lastSortedColumn = -1;

function sortTable() {
    const table = document.getElementById('companyTable');
    const rows = Array.from(table.rows).slice(1);
    const sortBy = document.getElementById('sortBy').value;

    if (sortBy === "") return;

    const columnIndex = parseInt(sortBy);

    if (lastSortedColumn === columnIndex) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
        sortDirection = "asc";
    }

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText.toLowerCase();
        const bText = b.cells[columnIndex].innerText.toLowerCase();

        if (!isNaN(parseFloat(aText)) && !isNaN(parseFloat(bText))) {
            return sortDirection === "asc"
                ? parseFloat(aText) - parseFloat(bText)
                : parseFloat(bText) - parseFloat(aText);
        }

        if (aText < bText) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aText > bText) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Re-add sorted rows to the table body
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));

    lastSortedColumn = columnIndex;
}