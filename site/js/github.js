export async function initRepoExplorer(user, repo) {
    const baseUrl = `https://api.github.com/repos/${user}/${repo}/contents`;
    const container = document.getElementById('repo-tree');

    async function fetchStructure(path = '') {
        try {
            const response = await fetch(`${baseUrl}/${path}`);
            const items = await response.json();
            const wrapper = document.createElement('div');

            for (const item of items) {
                if (item.type === 'dir') {
                    const details = document.createElement('details');
                    const summary = document.createElement('summary');
                    summary.innerText = item.name.toLowerCase() + " /";
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'file-list';
                    details.appendChild(summary);
                    details.appendChild(contentDiv);
                    wrapper.appendChild(details);
                    contentDiv.appendChild(await fetchStructure(item.path));
                } else if (item.type === 'file' && !item.name.startsWith('.')) {
                    const fileLink = document.createElement('a');
                    fileLink.className = 'file-item';
                    fileLink.innerText = item.name;
                    fileLink.onclick = async (e) => {
                        e.preventDefault();
                        await copyToClipboard(item.download_url, fileLink);
                    };
                    wrapper.appendChild(fileLink);
                }
            }
            return wrapper;
        } catch (e) { return document.createTextNode(""); }
    }

    async function copyToClipboard(url, element) {
        try {
            const res = await fetch(url);
            const text = await res.text();
            await navigator.clipboard.writeText(text);
            const originalText = element.innerText;
            element.innerText = "✓ copied";
            element.style.color = "#fff";
            setTimeout(() => {
                element.innerText = originalText;
                element.style.color = "";
            }, 1500);
        } catch (err) { console.error('Error copying.'); }
    }

    const dom = await fetchStructure();
    container.innerHTML = '';
    container.appendChild(dom);
}
