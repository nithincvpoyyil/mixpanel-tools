async function createList() {
  const { SAVED_URL_KEY } = await chrome.storage.sync.get("SAVED_URL_KEY");
  const { SAVED_URL_KEY_LIST = [] } = await chrome.storage.sync.get(
    "SAVED_URL_KEY_LIST"
  );
  const saveURLs = new Set(SAVED_URL_KEY_LIST);
  if (!saveURLs.has(SAVED_URL_KEY)) {
    saveURLs.add(SAVED_URL_KEY);
  }

  const mainList = document.getElementById("prev-url-list");
  const header = document.getElementById("header-list");

  if (saveURLs.size > 0) {
    header.style.display = "block";
    for (const savedURL of saveURLs) {
      const li = document.createElement("li");
      li.textContent = savedURL;
      mainList.appendChild(li);
    }
    await chrome.storage.sync.set({ SAVED_URL_KEY_LIST: Array.from(saveURLs) });
  }
}

createList().catch((error) => {
  console.error(error);
});
