var queryString = window.location.search;
var params = new URLSearchParams(queryString);
const receivedData = Object.fromEntries(params.entries());

const { remote } = require("electron");
const main = remote.require("./main");

const paymentconfirm = document.querySelector("#paymentconfirm");
const printbutton = document.querySelector("#printbutton");

console.log(receivedData);


function printReceipt() {
    window.print();
}


let feedata = new Array();

const id = Math.floor(Math.random() * Date.now()).toString(16);
console.log(id);

paymentconfirm.addEventListener("submit", async(e) => {
    try {
        e.preventDefault();

        temp = receivedData['data'].split(",");
        
        for(let i = 0; i<temp.length; i+=4) {
            const payment = {
                student_id : receivedData['student_no'],
                fee_id : temp[i+3],
                fee_title : temp[i],
                amount : temp[i+2],
                month_name : temp[i+1],
                receipt : id
            };
            const result = await main.payfee(payment);
            console.log(result);
            feedata.push(payment);
        }

        paymentconfirm.innerHTML = "";
        printbutton.innerHTML = `
            <button class="btn btn-secondary btn-sm" onclick="printReceipt()">
                PRINT 
            </button>
        `

    } catch (error) {
        console.log(error);
    }

});

temp = receivedData['data'].split(",");
        

        
for(let i = 0; i<temp.length; i+=4) {
    const payment = {
        student_id : receivedData['student_no'],
        fee_id : temp[i+3],
        fee_title : temp[i],
        amount : temp[i+2],
        month_name : temp[i+1],
        receipt : id
    };
    feedata.push(payment);
}


let info = document.querySelector("#info");
info.innerHTML = "";
info.innerHTML = `
    <p><strong>Receipt Number: </strong> ${id}</p>
    <strong>Date: </strong>${String(Date()).substring(0,21)}</p>
    <strong>Student Name: </strong>${receivedData['student_name']}</p>
    <strong>Class: </strong>${receivedData['standard']} ${receivedData['section']}</p>
    <strong>Roll No : </strong>${receivedData['roll_no']}</p>
`

let tablebody = document.querySelector("#tablebody");
let totalfee = 0;
// tablebody.innerHTML = "";
feedata.forEach((fd) => {
    totalfee += parseFloat(fd.amount);
    var row = tablebody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = fd.fee_title;
    cell2.innerHTML = fd.month_name;
    cell3.innerHTML = "Rs." + fd.amount;

    
});

tablebody.innerHTML+= `
    <table>
    <tfoot>
        <tr>
        <td class="total" colspan="2">Total: Rs. ${totalfee}</td>
        </tr>
    </tfoot>
    </table>
`

