const { remote } = require("electron");
const main = remote.require("./main");

const studentForm = document.querySelector("#studentForm");
const student_reg_no = document.querySelector("#student_reg_no");
const student_name = document.querySelector("#student_name");
const standard = document.querySelector("#standard");
const section = document.querySelector("#section");
const roll_no = document.querySelector("#roll_no");
const address = document.querySelector("#address");
const parent_name = document.querySelector("#parent_name");
const parent_mobile_no = document.querySelector("#parent_mobile_no");
const bus_service = document.querySelector("#bus_service");
const studentlist = document.querySelector("#studentlist");

let students = [];
let editingStatus = false;
let editStudentId;

const deleteStudent = async (student_no) => {
  const response = true;
  if (response) {
    await main.deleteStudent(student_no);
    await getstudentlist();
  }
  return;
};

const paymentpage = async (student_no) => {
  data = {
    student_no : student_no
  };
  var queryString = new URLSearchParams(data).toString();
  window.location.href = "feepayment_2.html?" + queryString;
}

const editStudent = async (student_no) => {
  document.getElementById("studentForm").style.display="block";
  const student = await main.getStudentBystudent_no(student_no);
  student_name.value = student.student_name;
  student_reg_no.value = student.student_reg_no;
  standard.value = student.class;
  section.value = student.section;
  roll_no.value = student.roll_no;
  address.value = student.address;
  parent_name.value = student.parent_name;
  parent_mobile_no.value = student.parent_mobile_no;
  bus_service.value = student.bus_service;

  editingStatus = true;
  editStudentId = student_no;
};

studentForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const student = {
        student_reg_no : student_reg_no.value,
        student_name : student_name.value,
        class : standard.value,
        section : section.value,
        roll_no : roll_no.value,
        address : address.value,
        parent_name : parent_name.value,
        parent_mobile_no : parent_mobile_no.value,
        bus_service : bus_service.value,
    };

    if (!editingStatus) {
      const savedStudent = await main.createStudent(student);
      console.log(savedStudent);
    } else {
      const studnetUpdated = await main.updateStudent(editStudentId, student);
      console.log(studnetUpdated);

      // Reset
      editingStatus = false;
      editStudentId = "";
    }

    studentForm.reset();
    student_reg_no.focus();
    getstudentlist();
  } catch (error) {
    console.log(error);
  }
});

function renderStudents(tasks) {
  studentlist.innerHTML = "";
  var header = studentlist.createTHead();
  var row = header.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);

  cell1.innerHTML = "<b>Class</b>";
  cell2.innerHTML = "<b>Section</b>";
  cell3.innerHTML = "<b>Roll No</b>";
  cell4.innerHTML = "<b>Student Name</b>";
  cell5.innerHTML = "<b>Payments</b>";
  cell6.innerHTML = "<b>Delete</b>";
  cell7.innerHTML = "<b>Edit</b>";

  tasks.forEach((t) => {
    var row = studentlist.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    cell1.innerHTML = t.class;
    cell2.innerHTML = t.section;
    cell3.innerHTML = t.roll_no;
    cell4.innerHTML = t.student_name;
    cell5.innerHTML = `<button class="btn btn-primary btn-sm" onclick="paymentpage('${t.student_no}')">Payments</button>`;
    cell6.innerHTML = `<button class="btn btn-danger btn-sm" onclick="deleteStudent('${t.student_no}')">DELETE</button>`;
    cell7.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="editStudent('${t.student_no}')">EDIT</button>`;
  });
}

const getstudentlist = async () => {
  students = await main.getstudentlist();
  renderStudents(students);
};

async function init() {
  getstudentlist();
}

init();
