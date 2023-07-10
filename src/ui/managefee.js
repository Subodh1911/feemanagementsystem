const { remote } = require("electron");
const main = remote.require("./main");

const feeForm = document.querySelector("#feeForm");
const feeTitle = document.querySelector("#name");
const amount = document.querySelector("#amount");
const standard = document.querySelector("#standard");
const fees = document.querySelector("#fees");
const feetype = document.querySelector("#feetype");
const feeshead = document.querySelector("#feeshead");

let feelist = [];
let editingStatus = false;
let editfeeId;

const deletefee = async (id) => {
  const response = true;
  if (response) {
    await main.deletefee(id);
    await getfees();
  }
  return;
};

const editfee = async (id) => {
  const fee = await main.getfeeById(id);
  feeTitle.value = fee.feetitle;
  amount.value = fee.fee_amount;
  standard.value = fee.class;

  editingStatus = true;
  editfeeId = id;
};

feeForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const fee = {
      feetitle: feeTitle.value,
      fee_amount: amount.value,
      class: standard.value,
      fee_type : feetype.value
    };

    if (!editingStatus) {
      const savedfee = await main.createfee(fee);
      console.log(savedfee);
    } else {
      const feeUpdated = await main.updatefee(editfeeId, fee);
      console.log(feeUpdated);

      // Reset
      editingStatus = false;
      editfeeId = "";
    }

    feeForm.reset();
    feeTitle.focus();
    getfees();
  } catch (error) {
    console.log(error);
  }
});

function renderfees(tasks) {

  fees.innerHTML = "";
  feeshead.removeAttribute("hidden");
  // fees.innerHTML = "";
  tasks.forEach((t) => {

    var row = fees.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    cell1.innerHTML = t.class;
    cell2.innerHTML = t.feetitle;
    cell3.innerHTML = t.fee_type + "ly";
    cell4.innerHTML = "Rs." + t.fee_amount;
    cell5.innerHTML = `<button class="btn btn-danger btn-sm" onclick="deletefee('${t.feeid}')">DELETE</button>`;
    cell6.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="editfee('${t.feeid}')">EDIT</button>`;

  });
}

const getfees = async () => {
  feelist = await main.getfees();
  renderfees(feelist);
};

async function init() {
  getfees();
}

init();
