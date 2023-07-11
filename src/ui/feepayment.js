const { remote } = require("electron");
const main = remote.require("./main");



const studentDetail = document.querySelector("#studentDetail");
const student_name = document.querySelector("#student_name");
const standard = document.querySelector("#standard");
const section = document.querySelector("#section");
const roll_no = document.querySelector("#roll_no");
const confirmfees = document.querySelector("#confirmfees");
const payment_record = document.querySelector("#tableBody");

let result = undefined;
let payments = undefined;
let feetypes = undefined;

studentDetail.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const student = {
      student_name: student_name.value,
      class: standard.value,
      section: section.value,
      roll_no: roll_no.value,
    }
    console.log("Finding Student...");
    result = await main.getStudentbyDetail(student);
    console.log(result)
    if(result === undefined) {
      document.querySelector("#studentfind").innerHTML = "Student Not found!!"
      studentDetail.reset();
      student_name.focus(); 
      fees.innerHTML = "";
    }
    else if(result['student_name'] === student_name.value) {
      document.querySelector("#studentfind").innerHTML = "Student found!!"
      studentDetail.reset();
      student_name.focus();

      //fetching payment record
      payments = await main.paymentsbystudent(result.student_no);

      //fetching all type of fee for the class
      feetypes = await main.getFeesofClass(result.class);
      console.log(feetypes);

      const formbody = document.querySelector("#formbody");
      formbody.innerHTML = "";
      feetypes.forEach((t) => {
        const ids = t.fee_type + t.feeid;
        if(t.fee_type==="month") {
          formbody.innerHTML += `
          <div id="monthContainer" class = "col">
          <label for="${ids}" style="font-size : larger;"><li><strong>${t.feetitle}</strong> : Rs. ${t.fee_amount}</li></label>
            <select id="${ids}" multiple>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
            </select>
          </div>
          <br>
          
          `;
        } else {
          formbody.innerHTML += `
          <br>
          <div class="col" style="font-size : larger;">
          <input type="checkbox" name="${t.fee_type}" id="${ids}"><label for="${ids}"><strong>${t.feetitle}</strong> : Rs. ${t.fee_amount}</label>
          </div>
          `;
        }
      });

      
      fees.innerHTML = "";
      fees.innerHTML += `
        <div class="card card-body my-2 animated fadeInLeft">
          <h4>Name : ${result.student_name}</h4>
          <p>Class : ${result.class} ${result.section}</p>
          <p>Roll No : ${result.roll_no}</p>
          <p>Father Name : ${result.parent_name}</p>
          <p>Father Mobile No : ${result.parent_mobile_no}</p>
          <p>Bus Service : ${result.bus_service}</p>
        </div>
      `;

      
  
      payments.forEach((t) => {
        let s = String(t.date_and_time).substring(4,15);

        var row = payment_record.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = s;
        cell2.innerHTML = t.fee_title;
        cell3.innerHTML = t.amount;
        cell4.innerHTML = t.month_name;
        cell5.innerHTML = `<button class="btn btn-success btn-sm" onclick="showreceipt('${t.receipt}', '${result.student_name}', '${result.roll_no}', '${result.class}', '${result.section}')">RECEIPT</button>`;

      });
    } else {
      document.querySelector("#studentfind").innerHTML = "Student Not found!!"
      studentDetail.reset();
      student_name.focus();
      fees.innerHTML = "";
      // window.location.href = "login.html";
    }

  } catch (error) {
    console.log(error);
  }
});

const feeDetail = document.querySelector("#feeDetail");

feeDetail.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    if(result===undefined) {
      console.log("Student details not entered");
    } else {
      let feetypesid = new Array();
      let i = 0;
      let data = new Array();
      feetypes.forEach((t) => {
          const ids = t.fee_type + t.feeid;
          feetypesid.push(document.querySelector("#"+ids));
          if(t.fee_type==="month") {
            let selectedOptions = Array.from(feetypesid[i].selectedOptions).map(function(option) { return option.value; });
            selectedOptions.forEach((m) => {
              data.push([t.feetitle, m, t.fee_amount, t.feeid]);
            });
            // console.log(selectedOptions);
          }
          else {
            // console.log(feetypesid[i].checked);
            if(feetypesid[i].checked) {
              data.push([t.feetitle, "", t.fee_amount, t.feeid]);
            }
          }
          feetypesid[i].checked = false;
          i = i+1;
      });
      let text = "";
      let totalfee = 0;
      data.forEach((d) => {
        totalfee+=d[2];
        text += "    " + d[0] + "  " + d[1] + "  " + d[2] + "\n"
      });
      text+= "\nTotal Fees : " + totalfee;
      // const response = confirm("Are you confirm with fee details : \n\n" + text);
      const response = true;
      if(totalfee !== 0) {

        datatosend = {
          student_no : result.student_no,
          student_name : result.student_name,
          student_reg_no : result.student_reg_no,
          standard : result.class,
          section : result.section,
          roll_no : result.roll_no,
          address : result.address,
          parent_name : result.parent_name,
          parent_mobile_no : result.parent_mobile_no,
          bus_service : result.bus_service,
          data : data
        }
          

          var queryString = new URLSearchParams(datatosend).toString();
          window.location.href = "feereceipt.html?" + queryString;
      }
      console.log(data);

    }

  } catch (error) {
    console.log(error);
  }
}); 



const showreceipt = async (receiptid, name_student, roll_no_student, class_student, section_student) => {
  const result1 = await main.fetchreceipt(receiptid);
  console.log(result1);
  let feedetails = new Array();
  result1.forEach((t) => {
    feedetails.push([t.fee_title, t.month_name, t.amount, t.fee_id, t.date_and_time]);
  });

  datasend = {
    student_name : name_student,
    standard : class_student,
    section : section_student,
    roll_no : roll_no_student,
    receiptid : receiptid,
    date_and_time : result1[0].date_and_time,
    data : feedetails
  };

  var queryString = new URLSearchParams(datasend).toString();
  window.location.href = "showreceipt.html?" + queryString;

  return;
};

console.log("Payment");

//Honey3326honey@#