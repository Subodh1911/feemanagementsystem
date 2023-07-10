const { BrowserWindow, Notification } = require("electron");
const { getConnection } = require("./database");

let window;


//fee management
const createfee = async (fee) => {
  try {
    const conn = await getConnection();
    fee.fee_amount = parseFloat(fee.fee_amount);
    const result = await conn.query("INSERT INTO fee SET ?", fee);
    fee.feeid = result.feeid;

    // Notify the User
    new Notification({
      title: "Student Fee Management System",
      body: "New fee Saved Successfully",
    }).show();

    // Return the created Product
    return fee;
  } catch (error) {
    console.log(error);
  }
};

const getfees = async () => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM fee ORDER BY class, feetitle");
  return results;
};

const deletefee = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM fee WHERE feeid = ?", id);
  return result;
};

const getfeeById = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM fee WHERE feeid = ?", id);
  return result[0];
};

const updatefee = async (id, fee) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE fee SET ? WHERE feeId = ?", [
    fee,
    id,
  ]);
  console.log(result)
};


//login
const getUser = async (username) => {
  const conn = await getConnection();
  // console.log(typeof(username));
  const result = await conn.query("SELECT * FROM user WHERE username = ?", username);
  // console.log(result);
  return result;
}


//student management
const createStudent = async (student) => {
  try {
    const conn = await getConnection();
    student.student_reg_no = parseFloat(student.student_reg_no);
    student.roll_no = parseFloat(student.roll_no);
    const result = await conn.query("INSERT INTO student SET ?", student);
    student.student_no = result.student_no;

    // Notify the User
    new Notification({
      title: "Fee Management System",
      body: "New Student Saved Successfully",
    }).show();

    // Return the created Product
    return student;
  } catch (error) {
    console.log(error);
  }
};

const getstudentlist = async () => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM student ORDER BY class, section, roll_no, student_name");
  return results;
};

const deleteStudent = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM student WHERE student_no = ?", id);
  return result;
};

const getStudentBystudent_no = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM student WHERE student_no = ?", id);
  return result[0];
};

const updateStudent = async (id, student) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE student SET ? WHERE student_no = ?", [
    student,
    id,
  ]);
  console.log(result)
};

const getStudentbyDetail = async (student) => {
  const conn = await getConnection();
  student.roll_no = parseFloat(student.roll_no);
  const result = await conn.query("SELECT * FROM student WHERE class = ? and roll_no = ? and section = ? ", [student.class, student.roll_no, student.section]);
  return result[0];
};

const getStudentbyNumber = async (student_no) => {
  const conn = await getConnection();
  student_no = parseFloat(student_no);
  const result = await conn.query("SELECT * FROM student WHERE student_no = ?", student_no);
  return result[0];
};

//fetching payment details

const paymentsbystudent = async (student_id) => {
  const conn = await getConnection();
  student_id = parseFloat(student_id);
  const result = await conn.query("SELECT * FROM payment WHERE student_id = ? ORDER BY fee_title, date_and_time DESC", student_id);
  return result;
}

//fetching all type of fees for a class
const getFeesofClass = async (classno) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM fee WHERE class = ? ORDER BY feetitle", classno);
  return result;
}

//fee pay
const payfee = async (payment) => {
  try {
    const conn = await getConnection();
    payment.student_id = parseFloat(payment.student_id);
    payment.fee_id = parseFloat(payment.fee_id);
    payment.amount = parseFloat(payment.amount);
    const result = await conn.query("INSERT INTO payment SET ?", payment);

    // console.log(result);
    // Return the created Product

    

    return result.transaction_no;
  } catch (error) {
    console.log(error);
  }
};

//fetch receipt data by receipt data
const fetchreceipt = async (receiptid) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM payment WHERE receipt = ?", receiptid);
  return result;
};

// getstudentsofclass
const getstudentsofclass = async (standard, section) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM student WHERE class = ? and section = ? ORDER BY roll_no", [standard,section]);
  return result;
};

const getStudents = async () => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM student ORDER BY class, section, roll_no");
  return result;
};

const getPayments = async () => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM payment ORDER BY student_id");
  return result;
};

const deletepayments = async () => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM payment");
  return result;
};

const upgradeClass = async (oldclass, newclass) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE student SET class = ? WHERE class= ?", [newclass, oldclass]);
  return result;
};

const delete12students = async () => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM student WHERE class = ?", "12");
  return result;
};


function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.setMenuBarVisibility(false)
  window.loadFile("src/ui/login.html");
}

module.exports = {
  createWindow,
  createfee,
  getfees,
  deletefee,
  getfeeById,
  updatefee,
  getUser,
  createStudent,
  getstudentlist,
  deleteStudent,
  getStudentBystudent_no,
  updateStudent,
  getStudentbyDetail,
  paymentsbystudent,
  getFeesofClass,
  payfee,
  fetchreceipt,
  getstudentsofclass,
  getStudentbyNumber,
  getStudents,
  getPayments,
  deletepayments,
  upgradeClass,
  delete12students
};
