const { remote } = require("electron");
const { read } = require("original-fs");
const { reservationsUrl } = require("twilio/lib/jwt/taskrouter/util");
const main = remote.require("./main");

const classDetail = document.querySelector("#classDetail");
const standard = document.querySelector("#standard");
const section = document.querySelector("#section");
const month = document.querySelector("#month");
const tableBody = document.querySelector("#tableBody");
const element = document.querySelector("#tableheadcopy");
const studentlist = document.querySelector("#studentlist");

const monthsname = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

var datatosend = "";

classDetail.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();



        tableBody.innerHTML = "";
        element.removeAttribute("hidden");

        const feeresult = await main.getFeesofClass(standard.value);

        let feeresultmonth = new Array();
        let feeresultyear = new Array();

        feeresult.forEach((f) => {
            if(f.fee_type == 'month') {
                feeresultmonth.push(f);
            } else {
                feeresultyear.push(f);
            }
        });

        // let montharray = new Array();
        // for(let i=4;i<=month.value;i++) { montharray.push(feeresult); }
        // console.log(montharray);

        const result = await main.getstudentsofclass(standard.value, section.value);
        // console.log(month.value);
        // console.log(feeresult);
        // console.log(result);
        
        result.forEach(async (std) => {

            let remainingfeedata_m = [];
            let remainingfeedata_y = [];

            var busflag = true;

            if(std.bus_service == "No") {
                busflag = false;
            }

            let remainingfees = 0;

            const payments = await main.paymentsbystudent(std.student_no);
            // console.log(payments);
            
            for(let i=0;i<=month.value-4;i++) { 
                // montharray.push(feeresult);
                
                //fees paid for the month
                let feepaid = new Array();
                payments.forEach((p) => {
                    if(p.month_name == monthsname[i]) {
                        feepaid.push(p.fee_id); 
                    }
                });
                // console.log(feepaid);
                let tempfee = [];
                feeresultmonth.forEach((f) => {
                    let flag = false;
                    feepaid.forEach((fp) => { if(fp==f.feeid) { flag = true; }});
                    if(flag == false) {

                        tempfee.push(f.fee_amount);

                        //fee not paid of the month
                        remainingfees += f.fee_amount;

                    } else {
                        tempfee.push(0);
                    }
                });

                remainingfeedata_m.push(tempfee);

            }

            let feepaid = new Array();
            payments.forEach((p) => {
                feepaid.push(p.fee_id); 
            });
            // console.log(feepaid);
            feeresultyear.forEach((f) => {
                let flag = false;
                feepaid.forEach((fp) => { if(fp==f.feeid) { flag = true; }});
                if(flag == false) {
                    remainingfeedata_y.push(f.fee_amount);
                    //fee not paid of the month
                    remainingfees += f.fee_amount;

                } else {
                    remainingfeedata_y.push(0);
                }
            });

            // console.log(remainingfees);
            // console.log(remainingfeedata_m);
            // console.log(remainingfeedata_y);


            if(busflag === false) {
                var busfee = 0;
                feeresult.forEach((f) => {
                    if(f.feetitle == "Bus Fee") {
                        busfee = f.fee_amount;
                    } 
                });
                remainingfees = remainingfees - (month.value - 3)*busfee;
            }

            // console.log(remainingfees, std.student_name);


            if(remainingfees !== 0) {

                datatosend += std.student_no + "," + remainingfees + ","; 

                var row = tableBody.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);

                cell1.innerHTML = std.roll_no;
                cell2.innerHTML = std.student_name;
                cell3.innerHTML = std.parent_name;
                cell4.innerHTML = std.parent_mobile_no;
                cell5.innerHTML = `Rs.${remainingfees}`;
                cell6.innerHTML = `<button class="btn btn-danger btn-sm" onclick="showfeedetail('${std.student_no}','${remainingfeedata_m}','${remainingfeedata_y}', '${busflag}')">Detail</button>`;
                cell7.innerHTML = `<button class="btn btn-primary btn-sm" onclick="paymentpage('${std.student_no}')">Pay</button>`;

            }
        });


    } catch (error) {
        console.log(error);
    }
});

const showfeedetail = async (student_no, remainingfeedata_m, remainingfeedata_y, busflag) => {

    remainingfeedata_m = remainingfeedata_m.split(",");
    remainingfeedata_y = remainingfeedata_y.split(",");



    const student = await main.getStudentbyNumber(student_no);
    const feeDetail = document.querySelector("#feeDetail");
    feeDetail.innerHTML = "";
    feeDetail.innerHTML += `
        <br>
        <h4> Student Name : ${student.student_name} s/o ${student.parent_name} </h4>
        <br>
    `;

    const feeresult = await main.getFeesofClass(standard.value);

    let feeresultmonth = new Array();
    let feeresultyear = new Array();

    feeresult.forEach((f) => {
        if(f.fee_type == 'month') {
            feeresultmonth.push(f);
        } else {
            feeresultyear.push(f);
        }
    });

    const month_fees_size = feeresultmonth.length;

    feeDetail.innerHTML+=`
        <h4>Monthly Fees Remaining till ${monthsname[month.value-4]}</h4>
    `;

    console.log(month_fees_size);

    let remainingfeemonthwise = new Array();
    for(let i = 0;i<month_fees_size;i++) {
        let temp_fee = 0;
        for(let j = i;j<remainingfeedata_m.length;j+=month_fees_size) {
            temp_fee += parseFloat(remainingfeedata_m[j]);
            console.log(remainingfeedata_m[j]);
        }
        remainingfeemonthwise.push(temp_fee);
    }

    console.log(remainingfeemonthwise);
    let i =0;
    feeresultmonth.forEach((f) => {
        if(f.feetitle== "Bus Fee" && busflag == "false") {

        } else {
            feeDetail.innerHTML+=`
                <div>${f.feetitle}  : Rs.${remainingfeemonthwise[i]}  </div>
            `;
        }
        i = i + 1;
    });

    feeDetail.innerHTML+=`
        <br>
        <h4>Other Remaining Fees</h4>
    `;

    i = 0;

    feeresultyear.forEach((f) => {
        feeDetail.innerHTML+=`
            <div>${f.feetitle}  : Rs.${remainingfeedata_y[i]}  </div>
        `;
        i = i + 1;
    });


  };

  const paymentpage = async (student_no) => {
    data = {
      student_no : student_no
    };
    var queryString = new URLSearchParams(data).toString();
    window.location.href = "feepayment_2.html?" + queryString;
  }

studentlist.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();

        if(datatosend !== "") {
            data = {
                dd : datatosend,
                month : monthsname[month.value-4]
            }
            var queryString = new URLSearchParams(data).toString();
            window.location.href = "printlist.html?" + queryString;
        }


    } catch(error) {
        console.log(error);
    }

});
  