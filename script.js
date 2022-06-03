let myLeads = JSON.parse(localStorage.getItem("myLeads")) || [];

const inputElem = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulElem = document.getElementById("ul-el");
const deleteElem = document.getElementById("delete-btn");
const saveTabBtn = document.getElementById("save-tab-btn");
const deleteItemElem = document.getElementById("delete-item");

inputBtn.onclick = saveLead;

deleteElem.onclick = deleteAll;

saveTabBtn.onclick = saveTab;

function deleteAll() {
  localStorage.removeItem("myLeads");
  myLeads = [];
  renderLeads(myLeads);
}

function saveTab() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const tab = tabs[0];
    const domain = tab.url.replace(/.+\/\/|www.|\..+/g, "");
    myLeads.push(`${domain}%${tab.title}%${tab.url}`);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads(myLeads);
  });
}

function saveLead() {
  myLeads.push(inputElem.value);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  ulElem.innerHTML += `
      <li class='link flex'>${domain} - ${title}
        <a href="${link}" target='_blank' rel='noreferrer' class='link'>open link</a>
      </li>
  `;
  inputElem.value = "";
}

function createItem(lead, index) {
  const [domain, title, link] = lead.split("%");
  const li = document.createElement("li");
  li.classList.add("link", "flex");
  const span = document.createElement("span");
  span.textContent = `${domain} - ${title.slice(0, 30)}`;
  const button = document.createElement("button");
  button.id = "delete-item";
  button.innerHTML = `<img src="/bin.png" width="12" height="12" alt="delete item" />`;
  button.addEventListener("click", () => {
    ulElem.removeChild(li);
    let leads = JSON.parse(localStorage.getItem("myLeads"));
    leads = [...leads.slice(0, index), ...leads.slice(index + 1)];
    localStorage.setItem("myLeads", JSON.stringify(leads));
  });
  const div = document.createElement("div");
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.classList.add("link");
  a.textContent = "open link";
  li.appendChild(span);
  div.appendChild(a);
  div.appendChild(button);
  li.appendChild(div);
  return li;
}

function renderLeads(leads) {
  ulElem.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < leads.length; i++) {
    const elem = createItem(leads[i], i);
    fragment.appendChild(elem);
  }
  ulElem.appendChild(fragment);
}

renderLeads(myLeads);
