let myLeads = JSON.parse(localStorage.getItem("myLeads")) || [];

const inputElem = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulElem = document.getElementById("ul-el");
const deleteElem = document.getElementById("delete-btn");
const saveTabBtn = document.getElementById("save-tab-btn");

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
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads(myLeads);
  });
}

function saveLead() {
  myLeads.push(inputElem.value);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  ulElem.innerHTML += `
    <a href="${inputElem.value}">
        <li>${inputElem.value}</li>
    </a>
  `;
  inputElem.value = "";
}

function renderLeads(leads) {
  ulElem.innerHTML = "";
  let innerText = "";
  for (let i = 0; i < leads.length; i++) {
    innerText += `
    <a href="${leads[i]}" target='_blank' rel='noreferrer'>
        <li>${leads[i]}</li>
    </a>
    `;
  }
  ulElem.innerHTML = innerText;
}

renderLeads(myLeads);
