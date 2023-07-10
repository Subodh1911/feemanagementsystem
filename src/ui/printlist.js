var queryString = window.location.search;
var params = new URLSearchParams(queryString);
const receivedData = Object.fromEntries(params.entries());

const { remote } = require("electron");
const main = remote.require("./main");

const studentlist = document.querySelector("#studentlist");
const feetext = document.querySelector("#feetext");

console.log(receivedData);
 
feetext.innerHTML = `Fee Remaining till month ${receivedData['month']}`;
function renderStudents(t,fees) {
      var row = studentlist.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);
  
      cell1.innerHTML = t.student_reg_no;
      cell2.innerHTML = t.class;
      cell3.innerHTML = t.section;
      cell4.innerHTML = t.roll_no;
      cell5.innerHTML = t.student_name;
      cell6.innerHTML = t.parent_name;
      cell7.innerHTML = t.parent_mobile_no;
      cell8.innerHTML = "Rs." + fees;
  }
  
  const getstudentlist = async () => {
    const data = receivedData['dd'].split(",");
    console.log(data);
    for(let i=0;i<data.length - 1; i+=2) {
        student = await main.getStudentbyNumber(data[i]);
        renderStudents(student,data[i+1]);
    }
  };
  
  async function init() {
    getstudentlist();
  }
  
  init();
  
