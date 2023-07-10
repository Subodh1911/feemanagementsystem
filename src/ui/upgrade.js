const { remote } = require("electron");
const electron = require('electron');
const main = remote.require("./main");
const xlsx = require("xlsx");

const username = document.querySelector("#username");
const password = document.querySelector("#password");
const userform = document.querySelector("#userform");

userform.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    console.log("Finding User...");
    const result = await main.getUser(username.value);
    if(result[0]['user_password'] === password.value) {

        //saving student data
        const students = await main.getStudents();
        var studentdata = [];
        studentdata.push(["student_no", "student_reg_no", "student_name", "class", "section", "roll_no", "address", "parent_name", "parent_mobile_no", "bus_service"]);
        studentdata.push([""]);
        students.forEach(row => {
            studentdata.push([row["student_no"], row["student_reg_no"], row["student_name"], row["class"], row["section"], row["roll_no"]
            , row["address"], row["parent_name"], row["parent_mobile_no"], row["bus_service"]]);
        });
        var worksheet = xlsx.utils.aoa_to_sheet(studentdata), workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "students");
        
        //saving payment data
        const payments = await main.getPayments();
        var paymentdata = [];
        paymentdata.push(["transaction_id", "student_id", "date_and_time", "fee_id", "fee_title", "amount", "month", "receipt_no"]);
        paymentdata.push([""]);
        payments.forEach(payment => {
            paymentdata.push([payment["transaction_id"], payment["student_id"], payment["date_and_time"], payment["fee_id"], payment["fee_title"]
            , payment["amount"], payment["month_name"], payment["receipt"]]);
        });

        var worksheet2 = xlsx.utils.aoa_to_sheet(paymentdata);
        xlsx.utils.book_append_sheet(workbook, worksheet2, "payments");


        //saving fees data
        const fees = await main.getfees();
        var feedata = [];
        feedata.push(["feeid", "feetitle", "fee_amount", "class", "fee_type"]);
        feedata.push([""]);
        fees.forEach(fee => {
            feedata.push([fee["feeid"], fee["feetitle"], fee["fee_amount"], fee["class"], fee["fee_type"]]);
        });

        var worksheet3 = xlsx.utils.aoa_to_sheet(feedata);
        xlsx.utils.book_append_sheet(workbook, worksheet3, "fees");

        var currentTime = (new Date()).toString().substring(4,15).split(" ");
        var filename = "data";
        currentTime.forEach(t => {
            filename += "_" + t;
        });
        filename+= ".xlsx";

        new electron.remote.Notification({
            title: "Student Fee Management System",
            body: "Session Updated",
          }).show();
        // console.log(filename);
        xlsx.writeFile(workbook, filename);

        const delpayments = await main.deletepayments();

        const class12 = await main.delete12students();
        const class11 = await main.upgradeClass("11","12");
        const class10 = await main.upgradeClass("10","11");
        const class9 = await main.upgradeClass("9","10");
        const class8 = await main.upgradeClass("8","9");
        const class7 = await main.upgradeClass("7","8");
        const class6 = await main.upgradeClass("6","7");
        const class5 = await main.upgradeClass("5","6");
        const class4 = await main.upgradeClass("4","5");
        const class3 = await main.upgradeClass("3","4");
        const class2 = await main.upgradeClass("2","3");
        const class1 = await main.upgradeClass("1","2");
        const classUKG = await main.upgradeClass("UKG","1");
        const classLKG = await main.upgradeClass("LKG","UKG");
        const classNC = await main.upgradeClass("NC","LKG");

        window.location.href = "home.html";
    } else {
      document.querySelector("#userconfirm").innerHTML = "User Not found!!"
      userform.reset();
      username.focus();
      // window.location.href = "login.html";
    }

  } catch (error) {
    console.log(error);
  }
});