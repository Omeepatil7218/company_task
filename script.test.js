// Example Jest test for sorting function
test('sortTable sorts rows correctly', () => {
    document.body.innerHTML = `
        <table id="companyTable">
            <tbody>
                <tr><td>Name</td></tr>
                <tr><td>Google</td></tr>
                <tr><td>Apple</td></tr>
            </tbody>
        </table>
    `;
    sortTable(0);
    const rows = document.querySelectorAll('#companyTable tr');
    expect(rows[1].textContent).toBe('Apple');
    expect(rows[2].textContent).toBe('Google');
});