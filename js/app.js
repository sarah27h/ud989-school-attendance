/* model */
let model = {
  studentNames: ['Alice', 'Lydia', 'Adam', 'Daniel', 'Amy'],

  // Create attendance records if it hasn't created yet, use local storage to store them
  init: function() {
    if (!localStorage.studentData) {
      console.log('Creating attendance records...');

      /**
       * @description Create random data for our student attendanceDays
       * @returns {boolean}
       */
      function getRandom() {
        return Math.random() >= 0.5;
      }

      // create student object
      const studentData = [];
      this.studentNames.map(function(name) {
        const student = {};
        // add student name, addendance days
        student['name'] = name;
        student['attendanceDays'] = [];
        // fill values of attendanceDays array with random boolean data
        for (let day = 1; day <= 12; day++) {
          student['attendanceDays'].push(getRandom());
        }
        // add student object to our array
        studentData.push(student);
        return studentData;
      });
      // add daysNum in localStorage
      localStorage.setItem('daysNum', '12');

      // converts a studentAttendance object to a JSON string
      // store studentAttendance JSON string
      // "[{"name":"Alice","attendanceDays":[false,true, ...]},{"name":"Lydia","attendanceDays":[false,true, ...]},{"name":"Adam","attendanceDays":[true,false, ...]},{"name":"Daniel","attendanceDays":[false,true, ...]},{"name":"Amy","attendanceDays":[true,false, ...]}]"
      localStorage.studentData = JSON.stringify(studentData);
    }
  },

  // daysNum from localStorage
  getDaysNumFromStorage: function() {
    return JSON.parse(localStorage.daysNum);
  },

  updateDaysNumInStorage: function(newDaysNum) {
    localStorage.daysNum = JSON.stringify(newDaysNum);
  },

  getAllStudentData: function() {
    // Parse a string (written in JSON) and return a JavaScript object
    // [{name:"Alice",attendanceDays:[false,true, ...]},{name:"Lydia",attendanceDays:[false,true, ...]},{name:"Adam",attendanceDays:[true,false, ...]},{name:"Daniel",attendanceDays:[false,true, ...]},{name:"Amy",attendanceDays:[true,false, ...]}
    console.log(JSON.parse(localStorage.studentData));
    return JSON.parse(localStorage.studentData);
  },

  updateStudentData: function(updatedArray) {
    localStorage.studentData = JSON.stringify(updatedArray);
  },

  update: function(missed, index) {
    let storageData = JSON.parse(localStorage.studentData);

    storageData.forEach((student, i, array) => {
      if (i === index) {
        storageData[i]['missed'] = missed;
        localStorage.studentData = JSON.stringify(storageData);
      }
      console.log('array', array);
    });
    console.log(model.getAllStudentData());
  }
};

/* octopus */
let octopus = {
  // get student data from model
  getStudentData: function() {
    return model.getAllStudentData();
  },

  // daysNum need to reflect user input
  getDaysNum: function() {
    // convert DaysNumFromStorage to number
    return Number(model.getDaysNumFromStorage());
  },

  //update daysNum
  updateDaysNum: function(enteredDaysNum) {
    // count missed days column after changing daysNum
    octopus.updateMissedColumn(enteredDaysNum);

    // update daysNum in localStorage
    model.updateDaysNumInStorage(enteredDaysNum);

    // update the DOM elements with the right values
    tableHeaderView.render();
    tableBodyView.render();
  },

  // count a student's missed days
  getMissedDays: function() {
    const missedDays = model.getAllStudentData().map(student => {
      return student['attendanceDays'].filter(day => {
        return !day ? !day : 0;
      });
    });
    console.log(missedDays);
    return missedDays;
  },

  // count missed days after changing daysNum
  // missed days => count 'false' in student['attendanceDays']
  // after changing daysNum
  // student['attendanceDays'] length needs to be updated
  // to reflect changing occur in daysNum
  // to save changes in student data -> update localstorage
  updateMissedColumn: function(enteredDaysNum) {
    model.getAllStudentData().map((student, index, students) => {
      student['attendanceDays'].length = enteredDaysNum;
      model.updateStudentData(students);
    });
  },

  // count missed days and add as property using pass student index and missed
  // and not whole array
  addMissedDaysAsProperty: function() {
    model.getAllStudentData().forEach((student, index, arr) => {
      let missed = 0;
      student['attendanceDays'].map(day => {
        if (day === false) {
          missed++;
        }
      });
      console.log(student, arr);
      // to update our array in local storage with new missedDays property
      model.update(missed, index);
    });
    console.log(model.getAllStudentData());
  },

  // update attendance days depends on checkboxs, update storage, render table tableBodyView
  updateAttendance: function(rowIndex, checkboxIndex) {
    // loop through StudentData and by using rowIndex, recordIndex
    // check which checkboxIndex changes to toggle it
    model.getAllStudentData().forEach((student, recordIndex, students) => {
      recordIndex === rowIndex
        ? (students[rowIndex]['attendanceDays'][checkboxIndex] = !students[rowIndex][
            'attendanceDays'
          ][checkboxIndex])
        : (students[rowIndex]['attendanceDays'][checkboxIndex] =
            students[rowIndex]['attendanceDays'][checkboxIndex]);

      // update our array in local storage with checkboxIndex toggle to update missed col
      // in table tableBodyView because missed col value calculate directly using model.getAllStudentData()
      // student data from local storage
      model.updateStudentData(students);

      // update our array in local storage with new missedDays property
      octopus.addMissedDaysAsProperty();
      console.log(students);
    });

    // render this tableBodyView (update the DOM elements with the right values)
    tableBodyView.render();
  },

  // used to open, close optionView
  toggleOptionView: function(view) {
    this.render();
    console.log(this, view);
    view.classList.toggle('hidden');
    view.classList.toggle('display-flex');
  },

  // add new student to our data
  addNewStudent: function(studentName) {
    const students = model.getAllStudentData();
    students.push({
      name: studentName.charAt(0).toUpperCase() + studentName.slice(1),
      attendanceDays: Array(octopus.getDaysNum()).fill(false),
      missed: octopus.getDaysNum()
    });

    // update our array in local storage
    model.updateStudentData(students);

    // update the DOM elements with the right values
    tableBodyView.render();
  },

  // delete student record from our data
  deleteStudent: function(studentRecordIndexs) {
    const studentData = model.getAllStudentData();
    studentRecordIndexs
      .sort((a, b) => (a > b ? -1 : 1))
      .forEach(recordIndex => {
        console.log(recordIndex, studentData);
        studentData.splice(recordIndex, 1);
      });
    // const deletedStudent = studentData.splice(studentRecordIndex, 1);
    console.log(studentData);
    // update our array in local storage with checkboxIndex toggle to update missed col
    // in table tableBodyView because missed col value calculate directly using model.getAllStudentData()
    // student data from local storage
    model.updateStudentData(studentData);

    // update our array in local storage with new missedDays property
    octopus.addMissedDaysAsProperty();

    // render this tableBodyView (update the DOM elements with the right values)
    tableBodyView.render();
  },

  ascendSort: function(e) {
    const studentNames = model.getAllStudentData();
    // check clicked btn then decide which property will be applied
    // studentx.name if e.target.id === 'sort-az-btn'
    // studentx.missed if e.target.id === 'sort-19-btn'
    e.target.id === 'sort-az-btn'
      ? studentNames.sort((studentx, studenty) => (studentx.name < studenty.name ? -1 : 1))
      : studentNames.sort((studentx, studenty) => (studentx.missed < studenty.missed ? -1 : 1));

    // update our array in local storage
    model.updateStudentData(studentNames);
    // update the DOM elements with the right values
    tableBodyView.render();
  },

  descendSort: function(e) {
    const studentNames = model.getAllStudentData();
    // check clicked btn then decide which property will be applied
    // studentx.name if e.target.id === 'sort-za-btn'
    // studentx.missed if e.target.id === 'sort-91-btn'
    e.target.id === 'sort-za-btn'
      ? studentNames.sort((studentx, studenty) => (studentx.name > studenty.name ? -1 : 1))
      : studentNames.sort((studentx, studenty) => (studentx.missed > studenty.missed ? -1 : 1));

    // update our array in local storage
    model.updateStudentData(studentNames);
    // update the DOM elements with the right values
    tableBodyView.render();
  },

  init: function() {
    model.init();
    tableBodyView.init();
    tableHeaderView.init();
    changeDaysNumView.init();
    addNewStudentView.init();
    deleteStudentView.init();
    sortView.init();
    modalBoxView.init();
  }
};

/* tableHeaderView */
let tableHeaderView = {
  init: function() {
    this.studentTable = document.getElementById('student-table');
    this.tableHeader = document.getElementById('table-thead');

    // on click selectAllOptionBtn store pointer to selectOptionBtns for student records
    // simulate click of selectAllOptionBtn
    // use it to call highlightingSelectedRow, and them to studentRecordIndexs to delete them
    this.tableHeader.addEventListener('click', function(e) {
      if (e.target.nodeName.toLowerCase() === 'button') {
        // return HTMLCollection
        const selectOptionBtns = document.getElementsByClassName('select-option-btn');
        // begin with i = 1 to ignore selectAllOptionBtn
        // and auto click selectOptionBtns for student records
        for (let i = 1; i < selectOptionBtns.length; i++) {
          selectOptionBtns[i].click();
        }
      }
    });

    // render tableHeaderView
    tableHeaderView.render();
  },

  render: function() {
    // cells equal to days num
    let cells = octopus.getDaysNum();

    // clear table and render
    this.tableHeader.innerHTML = '';

    // create rows and begin at index 0
    let headerRows = this.tableHeader.insertRow(0);
    console.log(this.tableHeader);

    // create name cell in table header
    let nameCell = document.createElement('th');
    // create select student option btn
    let selectAllOptionBtn = document.createElement('button');
    selectAllOptionBtn.setAttribute('class', 'select-option-btn option-btn fas fa-align-justify');
    nameCell.appendChild(selectAllOptionBtn);
    nameCell.appendChild(document.createTextNode('Student Name'));
    nameCell.setAttribute('class', 'name-cell');
    headerRows.appendChild(nameCell);

    // create days cell in table header
    for (let cell = 1; cell <= cells; cell++) {
      let daysCell = document.createElement('th');
      daysCell.appendChild(document.createTextNode(`${cell}`));
      daysCell.setAttribute('class', 'name-col');
      headerRows.appendChild(daysCell);
    }

    // create missed days cell in table header
    let missedDayscell = document.createElement('th');
    missedDayscell.appendChild(document.createTextNode('Days Missed-col'));
    missedDayscell.setAttribute('class', 'missed-col');
    headerRows.appendChild(missedDayscell);
  }
};

/* tableBodyView */
let tableBodyView = {
  init: function() {
    this.tableBody = document.getElementById('table-body');
    let studentRecordIndexs = [];
    let missedDaysCell;

    // getElementsByClassName returns a live HTMLCollection.
    // The little blue i in the console indicates that
    // the array will be evaluated when you expand it.
    this.tableRows = document.getElementsByClassName('name-col');
    console.log(this.tableRows);
    // you can listen to 'DOMContentLoaded'
    // I have face a problem of it access any of this.tableRows HTML collection
    // window.addEventListener('DOMContentLoaded', (event) => {
    //     console.log(this.tableRows[1].innerText);
    // });

    // on change, get cell -> reflect a day in attendenceDays array
    // row index -> reflect student Record
    this.tableBody.addEventListener('change', function(e) {
      // check if evt.target is input
      if (e.target.nodeName.toLowerCase() === 'input') {
        // Subtract -1 to reflect day index in attendenceDays array
        // Subtract -1 to reflect student Record index in student data
        let rowIndex = e.target.parentNode.parentNode.rowIndex - 1,
          checkboxIndex = e.target.parentNode.cellIndex - 1;
        console.log(e.target, 'change event');

        // pass attendanceRecordIndex, checkboxIndex to update student attendance
        octopus.updateAttendance(rowIndex, checkboxIndex);
      }
    });

    // on click select student record btn
    this.tableBody.addEventListener('click', function(e) {
      // check if evt.target is delete student btn
      if (e.target.nodeName.toLowerCase() === 'button') {
        // get clicked student record
        let studentRecordIndex = e.target.parentNode.parentNode.rowIndex - 1;

        // check if we have click this record before
        if (studentRecordIndexs.indexOf(studentRecordIndex) === -1) {
          studentRecordIndexs.push(studentRecordIndex);
          // get missedDaysCell in HTML collection
          // based on that its index equal studentRecordIndex + 1
          // because HTML collection start at 0, studentRecordIndexs start at 1
          // HTML collection [th.missed-col, td.missed-col, td.missed-col, td.missed-col, td.missed-col, td.missed-col]
          missedDaysCell = document.getElementsByClassName('missed-col')[studentRecordIndex + 1];
        } else {
          studentRecordIndexs.splice(studentRecordIndexs.indexOf(studentRecordIndex), 1);
          missedDaysCell = document.getElementsByClassName('missed-col')[studentRecordIndex + 1];
        }

        // highlighting selected row
        highlightingSelectedRow();

        function highlightingSelectedRow() {
          // style selected row
          // to override styling of missedDaysCell
          e.target.parentNode.parentNode.classList.toggle('selected-col');
          missedDaysCell.classList.toggle('selected-col');
        }

        deleteStudentView.deleteStudentBtn.addEventListener('click', deleteStudentHandler);

        // delete student handler
        function deleteStudentHandler(event) {
          // alert('clicked');
          // send student record index to octopus to delete it
          octopus.deleteStudent(studentRecordIndexs);
          console.log('delete confirm', studentRecordIndexs);
          deleteStudentView.deleteStudentBtn.removeEventListener('click', deleteStudentHandler);
          studentRecordIndexs = [];
        }
      }
    });
    // add missed days as property for each student record at first init of app
    octopus.addMissedDaysAsProperty();

    // render table tableBodyView
    tableBodyView.render();
  },

  render: function() {
    let tableBody = '';
    // rows equal to student records
    let rows = octopus.getStudentData().length;
    let cells = octopus.getDaysNum();

    // clear table and render
    this.tableBody.innerHTML = '';

    // create table rows using DOM functions
    // https://stackoverflow.com/questions/13775519/html-draw-table-using-innerhtml
    for (let row = 1; row <= rows; row++) {
      // create rows and begin at index 0
      let tableRow = this.tableBody.insertRow(row - 1);

      // create student name cells
      let studentName = document.createTextNode(` ${octopus.getStudentData()[row - 1]['name']}`);
      let nameCell = tableRow.insertCell(0); // insert student name ex 'Alice' at index 0
      nameCell.setAttribute('class', 'name-cell');

      // create delete student option btn
      let deletOptionBtn = document.createElement('button');
      deletOptionBtn.setAttribute('class', 'select-option-btn option-btn fas fa-user-check');
      // deletOptionBtn.setAttribute('id', `delete-option-btn${row}`);
      nameCell.appendChild(deletOptionBtn);

      nameCell.appendChild(studentName);

      // create checkbox cells
      for (let cell = 1; cell <= cells; cell++) {
        let checkbox = document.createElement('input');
        let checkCell = tableRow.insertCell(cell); // index equal to cell to insert cell index 1, 2, 3, ..., daysNum
        checkCell.setAttribute('class', 'attend-col');
        checkbox.setAttribute('type', 'checkbox');

        // insert student attandance
        // check boxes, based on attendace records
        if (octopus.getStudentData()[row - 1]['attendanceDays'][cell - 1] === true) {
          checkbox.setAttribute('checked', '');
        } else if (octopus.getStudentData()[row - 1]['attendanceDays'][cell - 1] === false) {
          checkbox.removeAttribute('checked');
        }
        checkCell.appendChild(checkbox);
      }

      // create days missed cells
      let daysMissed = document.createTextNode(octopus.getMissedDays()[row - 1].length); // all browsers support it equally without any quirks, it scape all HTML tags
      let daysMissedCell = tableRow.insertCell(-1); // -1 to insert missed days cell at the last position
      // daysMissedCell.innerHTML = '0 <span> gg </span>'; // render html-like tags into a DOM
      daysMissedCell.setAttribute('class', 'missed-col');
      daysMissedCell.appendChild(daysMissed);
    }

    // create table rows using a string to store the HTML
    /* for(let row = 1; row <= rows; row++) {
            console.log(row, Object.keys(model.getAttendanceData())[row-1])
            tableBody += '<tr class="student">' +
            '<td class="name-col">' + `${Object.keys(model.getAttendanceData())[row-1]}` +'</td>';
            // create table repeated cols
            for(let col = 1; col <= cols; col++) {
                tableBody += '<td class="attend-col"><input type="checkbox"></td>'
            }
            
            tableBody += '<td class="missed-col">0</td> </tr>'
        }
        this.tableBody.innerHTML = tableBody; */
  }
};

/* options view */
let changeDaysNumView = {
  init: function() {
    // store pointers to our DOM elements for easy access later
    this.changeDaysNumBtn = document.getElementsByClassName('change-days-btn')[0];
    this.daysView = document.getElementById('days-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[0];
    this.daysNumInput = document.getElementById('days-num');
    this.subtractBtn = document.getElementById('subtract-btn');
    this.increaseBtn = document.getElementById('increase-btn');

    // 'this' inside the event listener callback
    // will be the element that fired the event which is 'closeBtn'
    // this.closeBtn.addEventListener('click', this.closeModal);
    // to solve that use bind() method to bind our function to modalBoxView
    // this.closeOption.addEventListener('click', this.toggleOptionView.bind(this));
    //***************************************************************
    // or using arrow functions
    // arrow function simply capture the 'this' of the surrounding scope.
    // value of 'this' inside an arrow function is determined by
    // where the arrow function is defined, not where it is used.
    // () => this.toggleOptionView() binds the context lexically with the changeDaysNumView object.
    // this.closeBtn.addEventListener('click', () => this.toggleOptionView());
    // this.cancelBtn.addEventListener('click', () => this.toggleOptionView());
    this.changeDaysNumBtn.addEventListener(
      'click',
      octopus.toggleOptionView.bind(this, this.daysView)
    );
    this.closeOption.addEventListener('click', octopus.toggleOptionView.bind(this, this.daysView));

    // on change, get new value
    this.daysNumInput.addEventListener('change', function(e) {
      let enteredDaysNum = e.target.value;
      octopus.updateDaysNum(enteredDaysNum);
    });

    // on click, decrease daysNumInput value by 1
    // update daysNum in model using octopus.updateDaysNum()
    this.subtractBtn.addEventListener('click', () => {
      this.daysNumInput.value--;
      octopus.updateDaysNum(this.daysNumInput.value);
    });

    // on click, increase daysNumInput value by 1
    // update daysNum in model using octopus.updateDaysNum()
    this.increaseBtn.addEventListener('click', () => {
      this.daysNumInput.value++;
      octopus.updateDaysNum(this.daysNumInput.value);
    });
  },
  //
  render: function() {
    // set daysNumInput value to be always days num
    // to improve UX every time user want to change days num stop at the last time days num
    this.daysNumInput.setAttribute('value', octopus.getDaysNum());
  }
};

let addNewStudentView = {
  init: function() {
    // store pointers to our DOM elements for easy access later
    this.addStudentViewBtn = document.getElementsByClassName('add-student-btn')[0];
    this.addStudentView = document.getElementById('add-student-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[1];
    this.studentNameInput = document.getElementById('student-name');
    this.addStudentBtn = document.getElementById('add-student');

    // on click open, close addStudentView
    this.addStudentViewBtn.addEventListener(
      'click',
      octopus.toggleOptionView.bind(this, this.addStudentView)
    );
    this.closeOption.addEventListener(
      'click',
      octopus.toggleOptionView.bind(this, this.addStudentView)
    );

    // on change, get student name
    // use () => {..} to caputer value of 'this' bound to addStudentView object
    this.addStudentBtn.addEventListener('click', () => {
      let studentName = this.studentNameInput.value;
      octopus.addNewStudent(studentName);
      // clear input to improve UX
      this.render();
    });
  },

  render: function() {
    // clear input to improve UX
    this.studentNameInput.value = '';
  }
};

let deleteStudentView = {
  init: function() {
    // store pointers to our DOM elements for easy access later
    this.deleteStudentViewBtn = document.getElementsByClassName('delete-student-btn')[0];
    this.deleteStudentView = document.getElementById('delete-student-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[2];
    this.deleteStudentBtn = document.getElementById('delete-student-btn');
    this.confirmDeleteMessage = document.getElementById('confirm-delete-message');

    // on click open, close addStudentView
    this.deleteStudentViewBtn.addEventListener(
      'click',
      octopus.toggleOptionView.bind(this, this.deleteStudentView)
    );
    this.closeOption.addEventListener(
      'click',
      octopus.toggleOptionView.bind(this, this.deleteStudentView)
    );
  },

  render: function() {}
};

/* sort options */
let sortView = {
  // store pointers to our DOM elements for easy access later
  init: function() {
    this.azSortBtn = document.getElementById('sort-az-btn');
    this.zaSortBtn = document.getElementById('sort-za-btn');
    this.ascendSortBtn = document.getElementById('sort-19-btn');
    this.descendSorttBtn = document.getElementById('sort-91-btn');

    // onclick sort students record alphabetic, numeric ascend or descend
    this.azSortBtn.addEventListener('click', octopus.ascendSort);
    this.zaSortBtn.addEventListener('click', octopus.descendSort);
    this.ascendSortBtn.addEventListener('click', octopus.ascendSort);
    this.descendSorttBtn.addEventListener('click', octopus.descendSort);
  }
};

/* modal box view */
let modalBoxView = {
  init: function() {
    this.modalBox = document.getElementById('modal-box');
    this.closeBtn = document.getElementsByClassName('modal-close-btn')[0];
    this.noBtn = document.getElementsByClassName('secondary-btn')[1];
    this.yesBtn = document.getElementsByClassName('primary-btn')[3];
    // 'this' inside the event listener callback
    // will be the element that fired the event which is 'closeBtn'
    // this.closeBtn.addEventListener('click', this.closeModal);
    // to solve that use bind() method to bind our function to modalBoxView
    // this.closeBtn.addEventListener('click', this.closeModal.bind(modalBoxView));
    // this.closeBtn.addEventListener('click', this.closeModal.bind(this));
    //***************************************************************
    // or using arrow functions
    // arrow function simply capture the this of the surrounding scope.
    // value of 'this' inside an arrow function is determined by
    // where the arrow function is defined, not where it is used.
    // () => this.closeModal() binds the context lexically with the modalBoxView object.
    // this.closeBtn.addEventListener('click', () => this.closeModal());
    // this.cancelBtn.addEventListener('click', () => this.closeModal());

    // this.closeBtn.addEventListener('click', this.closeModal.bind(this));
    // this.noBtn.addEventListener('click', this.closeModal.bind(this));

    window.addEventListener('click', evt => {
      if (evt.target === this.modalBox) {
        console.log(evt.target);
        modalBoxView.closeModal();
      }
    });
  },

  openModal: function() {
    this.modalBox.classList.remove('hidden');
    this.modalBox.classList.add('show');
  },

  // closeModal: ()  => {...}
  // "Arrow functions have no concept of 'this'.
  // 'this' inside of an arrow function is whatever 'this' is in their containing lexical environment.
  // *********
  // Don't use arrow functions if you need to bind the value of this.
  // *********
  // value of 'this' inside an arrow function is determined by
  // where the arrow function is defined, not where it is used.
  // closeModal: ()  => {...} binds the context lexically with the window object.
  // use normal functions instead as callbacks.
  closeModal: function() {
    this.modalBox.classList.remove('show');
    this.modalBox.classList.add('hidden');
  }
};

octopus.init();
