"use strict";

/* model */
var model = {
  studentNames: ['Alice', 'Lydia', 'Adam', 'Daniel', 'Amy'],
  // to store deleted records to retrieve if user click undo btn
  deletedRecords: [],
  // to store selected indexs to delete if user click delete btn
  selectedIndexs: [],
  // flag for determine sort type
  // flase: sort in ascending order default
  // true: sort in descending order
  sortFlag: false,
  previousColumnId: '',
  // Create attendance records if it hasn't created yet, use local storage to store them
  init: function init() {
    if (!localStorage.studentData) {
      /**
       * @description Create random data for our student attendanceDays
       * @returns {boolean}
       */
      var getRandom = function getRandom() {
        return Math.random() >= 0.5;
      }; // create student object


      console.log('Creating attendance records...');
      var studentData = [];
      this.studentNames.sort().map(function (name) {
        var student = {}; // add student name, addendance days

        student['name'] = name;
        student['attendanceDays'] = []; // fill values of attendanceDays array with random boolean data

        for (var day = 1; day <= 12; day++) {
          student['attendanceDays'].push(getRandom());
        } // add student object to our array


        studentData.push(student);
        return studentData;
      }); // add daysNum in localStorage

      localStorage.setItem('daysNum', '12'); // converts a studentAttendance object to a JSON string
      // store studentAttendance JSON string
      // "[{"name":"Alice","attendanceDays":[false,true, ...]},{"name":"Lydia","attendanceDays":[false,true, ...]},{"name":"Adam","attendanceDays":[true,false, ...]},{"name":"Daniel","attendanceDays":[false,true, ...]},{"name":"Amy","attendanceDays":[true,false, ...]}]"

      localStorage.studentData = JSON.stringify(studentData);
    }
  },
  // daysNum from localStorage
  getDaysNumFromStorage: function getDaysNumFromStorage() {
    return JSON.parse(localStorage.daysNum);
  },
  updateDaysNumInStorage: function updateDaysNumInStorage(newDaysNum) {
    localStorage.daysNum = JSON.stringify(newDaysNum);
  },
  getAllStudentData: function getAllStudentData() {
    // Parse a string (written in JSON) and return a JavaScript object
    // [{name:"Alice",attendanceDays:[false,true, ...]},{name:"Lydia",attendanceDays:[false,true, ...]},{name:"Adam",attendanceDays:[true,false, ...]},{name:"Daniel",attendanceDays:[false,true, ...]},{name:"Amy",attendanceDays:[true,false, ...]}
    console.log(JSON.parse(localStorage.studentData));
    return JSON.parse(localStorage.studentData);
  },
  updateStudentData: function updateStudentData(updatedArray) {
    localStorage.studentData = JSON.stringify(updatedArray);
  },
  update: function update(missed, index) {
    var storageData = JSON.parse(localStorage.studentData);
    storageData.forEach(function (student, i, array) {
      if (i === index) {
        storageData[i]['missed'] = missed;
        localStorage.studentData = JSON.stringify(storageData);
      }

      console.log('array', array);
    });
    console.log(model.getAllStudentData());
  },
  addDeletedRecords: function addDeletedRecords(deletedRecords) {
    var items = deletedRecords;
    return items;
  }
};
/* octopus */

var octopus = {
  // get student data from model
  getStudentData: function getStudentData() {
    return model.getAllStudentData();
  },
  // daysNum need to reflect user input
  getDaysNum: function getDaysNum() {
    // convert DaysNumFromStorage to number
    return Number(model.getDaysNumFromStorage());
  },
  //update daysNum
  updateDaysNum: function updateDaysNum(enteredDaysNum) {
    // count missed days column after changing daysNum
    octopus.updateMissedColumn(enteredDaysNum); // update daysNum in localStorage

    model.updateDaysNumInStorage(enteredDaysNum); // update the DOM elements with the right values

    tableHeaderView.render();
    tableBodyView.render();
  },
  // count a student's missed days
  getSudentsMissedDays: function getSudentsMissedDays() {
    var missedDays = model.getAllStudentData().map(function (student) {
      return student['attendanceDays'].filter(function (day) {
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
  updateMissedColumn: function updateMissedColumn(enteredDaysNum) {
    model.getAllStudentData().map(function (student, index, students) {
      student['attendanceDays'].length = enteredDaysNum;
      model.updateStudentData(students);
    }); // update missed in local storage after user change numDays

    octopus.addMissedDaysAsProperty();
  },
  // count missed days and add as property using pass student index and missed
  // and not whole array
  addMissedDaysAsProperty: function addMissedDaysAsProperty() {
    model.getAllStudentData().forEach(function (student, index, arr) {
      var missed = 0;
      student['attendanceDays'].map(function (day) {
        // update missed in local storage after user change numDays
        if (day === false || day === null) {
          missed++;
        }
      });
      console.log(student, arr); // to update our array in local storage with new missedDays property

      model.update(missed, index);
    });
    console.log(model.getAllStudentData());
  },
  // update attendance days depends on checkboxs, update storage, render table tableBodyView
  updateAttendance: function updateAttendance(rowIndex, checkboxIndex) {
    // loop through StudentData and by using rowIndex, recordIndex
    // check which checkboxIndex changes to toggle it
    model.getAllStudentData().forEach(function (student, recordIndex, students) {
      recordIndex === rowIndex ? students[rowIndex]['attendanceDays'][checkboxIndex] = !students[rowIndex]['attendanceDays'][checkboxIndex] : students[rowIndex]['attendanceDays'][checkboxIndex] = students[rowIndex]['attendanceDays'][checkboxIndex]; // update our array in local storage with checkboxIndex toggle to update missed col
      // in table tableBodyView because missed col value calculate directly using model.getAllStudentData()
      // student data from local storage

      model.updateStudentData(students); // update our array in local storage with new missedDays property

      octopus.addMissedDaysAsProperty();
      console.log(students);
    }); // render this tableBodyView (update the DOM elements with the right values)

    tableBodyView.render();
    tableHeaderView.render();
  },
  // used to open, close optionView
  toggleOptionView: function toggleOptionView(view) {
    this.render();
    console.log(this, view);
    view.classList.toggle('hidden');
    view.classList.toggle('display-flex'); // add scroll to when click option view

    octopus.scrollToView(350, 0);
  },
  // add new student to our data
  addNewStudent: function addNewStudent(studentName) {
    var students = model.getAllStudentData();
    students.push({
      name: studentName.charAt(0).toUpperCase() + studentName.slice(1),
      attendanceDays: Array(octopus.getDaysNum()).fill(false),
      missed: octopus.getDaysNum()
    }); // update our array in local storage

    model.updateStudentData(students); // update the DOM elements with the right values

    tableBodyView.render(); // select, scroll to position of new student

    octopus.scrollToRecord();
    console.log(octopus.getStudentData().length);
  },
  getDeletedRecords: function getDeletedRecords() {
    return model.deletedRecords;
  },
  // update model.selectedIndexs with new selected indexs
  addSelectedIndex: function addSelectedIndex(selectedIndex) {
    model.selectedIndexs.push(selectedIndex);
    console.log('selectedIndexs', model.selectedIndexs);
  },
  // get selected index from model
  getSelectedIndex: function getSelectedIndex() {
    return model.selectedIndexs;
  },
  // delete student record from our data
  deleteStudent: function deleteStudent() {
    var studentData = model.getAllStudentData();
    model.selectedIndexs.sort(function (a, b) {
      return a > b ? -1 : 1;
    }).forEach(function (recordIndex) {
      console.log(recordIndex, studentData);
      model.deletedRecords.push(studentData[recordIndex]);
      studentData.splice(recordIndex, 1);
    }); // activate undoBtn

    _undoDelete.render();

    console.log(octopus.getDeletedRecords()); // empty selectedIndexs after delete to avoid app conflit
    // avoid old clicked indexs [0, 1]
    //stored with new clicked indexs [0]

    model.selectedIndexs = [];
    console.log(studentData, model.deletedRecords, model.deletedRecords); // update our array in local storage with checkboxIndex toggle to update missed col
    // in table tableBodyView because missed col value calculate directly using model.getAllStudentData()
    // student data from local storage

    model.updateStudentData(studentData); // update our array in local storage with new missedDays property

    octopus.addMissedDaysAsProperty(); // render this tableBodyView, tableHeaderView (update the DOM elements with the right values)

    tableBodyView.render();
    tableHeaderView.render();
  },
  // undo delete action
  undoDelete: function undoDelete() {
    var studentData = [];
    console.log(model.deletedRecords, model.getAllStudentData()); // retrieve deleted records merge them with our data

    studentData = octopus.getStudentData().concat(model.deletedRecords);
    console.log(model.deletedRecords, studentData); // check if there are deletedRecords
    // then update local storage

    if (model.deletedRecords.length > 0) {
      // student data from local storage
      model.updateStudentData(studentData); // update our array in local storage with new missedDays property

      octopus.addMissedDaysAsProperty(); // render this tableBodyView (update the DOM elements with the right values)

      tableBodyView.render(); // select, scroll to position of restored records

      octopus.scrollToRecord(model.deletedRecords);
      model.deletedRecords = []; // deactivate undoBtn

      _undoDelete.render();
    }
  },
  // sort columns by name or number asc & desc
  sortColumn: function sortColumn(columnId) {
    var studentNames = model.getAllStudentData();
    var icon = document.getElementById(columnId); // check if user click the same column or not

    octopus.determineSortColumnChange(columnId); // check sortFlag to determine sort type asc or desc
    // flase: sort in ascending order default
    // true: sort in descending order

    model.sortFlag ? studentNames.sort(function (studentx, studenty) {
      return studentx[columnId] > studenty[columnId] ? -1 : 1;
    }) : studentNames.sort(function (studentx, studenty) {
      return studentx[columnId] < studenty[columnId] ? -1 : 1;
    }); // change sort icon style (before, after pseudo element ) based on sort type asc or desc

    octopus.changeSortIconStyle(icon); // toggle sortFlag value

    model.sortFlag = !model.sortFlag; // update our array in local storage

    model.updateStudentData(studentNames); // update the DOM elements with the right values

    tableBodyView.render();
  },
  // check if user click the same column or not
  determineSortColumnChange: function determineSortColumnChange(columnId) {
    // user click different column and this not the first time
    // remove sort icon style for previousColumn
    // save value for current cloumnId
    // set sortFlag to its default value to begin sort by asc order
    if (model.previousColumnId !== columnId && model.previousColumnId.length !== 0) {
      octopus.removePreviousSortIconStyle(model.previousColumnId);
      octopus.updatepreviousColumnId(columnId);
      model.sortFlag = false; // if user click for first time
    } else if (model.previousColumnId.length === 0) {
      octopus.updatepreviousColumnId(columnId);
    }
  },
  // use previousColumnId to test if user click the same column or not
  updatepreviousColumnId: function updatepreviousColumnId(columnId) {
    model.previousColumnId = columnId;
  },
  // change sort icon style (before, after pseudo element ) based on sort type asc or desc
  changeSortIconStyle: function changeSortIconStyle(icon) {
    if (model.sortFlag) {
      icon.classList.add('sorting-desc');
      icon.classList.remove('sorting-desc-disabled');
      icon.classList.remove('sorting-asc');
      icon.classList.add('sorting-asc-disabled');
    } else {
      icon.classList.add('sorting-asc');
      icon.classList.remove('sorting-asc-disabled');
      icon.classList.remove('sorting-desc');
      icon.classList.add('sorting-desc-disabled');
    }
  },
  // remove sort icon style for previousColumn if user click different column
  removePreviousSortIconStyle: function removePreviousSortIconStyle(previousColumnId) {
    var previousColumnIdIcon = document.getElementById(previousColumnId);
    previousColumnIdIcon.classList.remove('sorting-desc');
    previousColumnIdIcon.classList.add('sorting-desc-disabled');
    previousColumnIdIcon.classList.remove('sorting-asc');
    previousColumnIdIcon.classList.add('sorting-desc-disabled');
  },
  // add scroll to when click option view
  scrollToView: function scrollToView(top, left) {
    // window.scrollTo(0, 350, { behavior: 'smooth' });
    window.scroll({
      top: top,
      left: left,
      behavior: 'smooth'
    });
  },
  // scroll, highlight to student record
  scrollToRecord: function scrollToRecord() {
    var recordNums = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1];
    // recordNums case of undo delete student will refere to deleted records we want to restore
    // recordNums = [1] an array of length = 1 case of add new student will refere to last new added record
    // store pointer for last student record
    var record = document.getElementsByClassName('student-row');
    var recordMissedCell = document.getElementsByClassName('missed-col'); // to repeate highlight, scroll for restored records

    var _loop = function _loop(i) {
      record[octopus.getStudentData().length - i].scrollIntoView();
      record[octopus.getStudentData().length - i].classList.add('highlight-col');
      recordMissedCell[octopus.getStudentData().length - i + 1].classList.add('highlight-col');
      setTimeout(function () {
        record[octopus.getStudentData().length - i].classList.remove('highlight-col');
        recordMissedCell[octopus.getStudentData().length - i + 1].classList.remove('highlight-col');
      }, 1000);
    };

    for (var i = recordNums.length; i > 0; i--) {
      _loop(i);
    }
  },
  init: function init() {
    model.init();
    tableBodyView.init();
    tableHeaderView.init();
    changeDaysNumView.init();
    addNewStudentView.init();
    deleteStudentView.init();
    modalBoxView.init();

    _undoDelete.init();
  }
};
/* tableHeaderView */

var tableHeaderView = {
  init: function init() {
    this.studentTable = document.getElementById('student-table');
    this.tableHeader = document.getElementById('table-thead'); // render tableHeaderView

    tableHeaderView.render(); // on click selectAllOptionBtn select all records

    this.tableHeader.addEventListener('click', function (e) {
      if (e.target.nodeName.toLowerCase() === 'input') {
        this.selectAllOptionBtn = document.getElementById('select-all-option-btn');
        var selectStudentRecordBtn = document.getElementsByClassName('select-option-btn');
        this.selectAllIcon = document.getElementById('select-all-icon'); // return HTMLCollection

        var tableRows = document.getElementsByClassName('student-row');
        var missedDaysCell = document.getElementsByClassName('missed-col'); // if selectAllOptionBtn is checked, highlight all records

        if (this.selectAllOptionBtn.checked) {
          this.selectAllIcon.classList.add('fa-check-square');
          this.selectAllIcon.classList.remove('fa-square');
          console.log('true');

          for (var i = 0; i < tableRows.length; i++) {
            // highlight student records
            tableRows[i].classList.add('selected-col');
            missedDaysCell[i + 1].classList.add('selected-col'); // change select btn to checked

            selectStudentRecordBtn[i + 1].classList.add('fa-check-square');
            selectStudentRecordBtn[i + 1].classList.remove('fa-square'); // add selected index to octopus
            // check if this record index was added before to avoid repeating indexes

            if (octopus.getSelectedIndex().indexOf(i) === -1) {
              octopus.addSelectedIndex(i);
            }
          } // if selectAllOptionBtn is unchecked, remove highlight for all records

        } else if (!this.selectAllOptionBtn.checked) {
          this.selectAllIcon.classList.add('fa-square');
          this.selectAllIcon.classList.remove('fa-check-square');
          console.log('false');

          for (var _i = 0; _i < tableRows.length; _i++) {
            // remove highlight for student records
            tableRows[_i].classList.remove('selected-col');

            missedDaysCell[_i + 1].classList.remove('selected-col'); // change select btn to unchecked


            selectStudentRecordBtn[_i + 1].classList.remove('fa-check-square');

            selectStudentRecordBtn[_i + 1].classList.add('fa-square'); // remove indexs sended to octopus


            octopus.getSelectedIndex().splice(octopus.getSelectedIndex().indexOf(_i), 1);
          }
        }
      }
    }); // on click sorting icons get columnId of clicked column
    // pass columnId to octopus to sort column

    this.tableHeader.addEventListener('click', function (e) {
      if (e.target.nodeName.toLowerCase() === 'th') {
        var columnId = e.target.id;
        octopus.sortColumn(columnId);
      }
    });
  },
  render: function render() {
    // cells equal to days num
    var cells = octopus.getDaysNum(); // clear table and render

    this.tableHeader.innerHTML = ''; // create rows and begin at index 0

    var headerRows = this.tableHeader.insertRow(0);
    console.log(this.tableHeader); // create name cell in table header

    var nameCell = document.createElement('th'); // create select student option btn

    var selectAllOptionBtn = document.createElement('input');
    var selectIcon = document.createElement('i'); // this icon represents an alias for default checkbox
    // every time tableBodyView is render due to a change in attendance days
    // we to to render tableHeaderView also
    // check first if there all a selected records selected
    // set selectIcon checked

    if (octopus.getSelectedIndex().length === octopus.getStudentData().length) {
      selectIcon.setAttribute('class', 'fas fa-check-square');
      selectAllOptionBtn.checked = true; // set default for checkbox as unckecked
    } else {
      selectIcon.setAttribute('class', 'fas fa-square');
      selectAllOptionBtn.checked = false; // set default for checkbox as unckecked
    }

    selectIcon.setAttribute('id', 'select-all-icon');
    selectAllOptionBtn.setAttribute('type', 'checkbox');
    selectAllOptionBtn.setAttribute('id', 'select-all-option-btn');
    selectAllOptionBtn.setAttribute('class', 'select-option-btn option-btn fas');
    nameCell.appendChild(selectIcon);
    nameCell.appendChild(selectAllOptionBtn);
    nameCell.appendChild(document.createTextNode('Name'));
    nameCell.setAttribute('class', 'name-cell');
    nameCell.setAttribute('id', 'name');
    headerRows.appendChild(nameCell); // create days cell in table header

    for (var cell = 1; cell <= cells; cell++) {
      var daysCell = document.createElement('th');
      daysCell.appendChild(document.createTextNode("".concat(cell)));
      daysCell.setAttribute('class', 'name-col');
      headerRows.appendChild(daysCell);
    } // create missed days cell in table header


    var missedDayscell = document.createElement('th');
    missedDayscell.appendChild(document.createTextNode('Missed Days'));
    missedDayscell.setAttribute('class', 'missed-col');
    missedDayscell.setAttribute('id', 'missed');
    headerRows.appendChild(missedDayscell);
  }
};
/* tableBodyView */

var tableBodyView = {
  init: function init() {
    this.tableBody = document.getElementById('table-body');
    var missedDaysCell; // getElementsByClassName returns a live HTMLCollection.
    // The little blue i in the console indicates that
    // the array will be evaluated when you expand it.

    this.tableRows = document.getElementsByClassName('name-col');
    console.log(this.tableRows); // you can listen to 'DOMContentLoaded'
    // I have face a problem of it access any of this.tableRows HTML collection
    // window.addEventListener('DOMContentLoaded', (event) => {
    //     console.log(this.tableRows[1].innerText);
    // });
    // on change, get cell -> reflect a day in attendenceDays array
    // row index -> reflect student Record

    this.tableBody.addEventListener('change', function (e) {
      // check if evt.target is input
      if (e.target.nodeName.toLowerCase() === 'input') {
        // Subtract -1 to reflect day index in attendenceDays array
        // Subtract -1 to reflect student Record index in student data
        var rowIndex = e.target.parentNode.parentNode.rowIndex - 1,
            checkboxIndex = e.target.parentNode.cellIndex - 1;
        console.log(e.target, 'change event'); // pass attendanceRecordIndex, checkboxIndex to update student attendance

        octopus.updateAttendance(rowIndex, checkboxIndex);
      }
    }); // on click select student record btn

    this.tableBody.addEventListener('click', function (e) {
      // check if evt.target is delete student btn
      if (e.target.nodeName.toLowerCase() === 'button') {
        var highlightingSelectedRow = function highlightingSelectedRow() {
          // style selected row
          // to override styling of missedDaysCell
          e.target.parentNode.parentNode.classList.toggle('selected-col');
          missedDaysCell.classList.toggle('selected-col');
        };

        var selectStudentRecordBtn = document.getElementsByClassName('select-option-btn');
        console.log(selectStudentRecordBtn); // get clicked student record

        var studentRecordIndex = e.target.parentNode.parentNode.rowIndex - 1; // check if we have click this record before

        if (octopus.getSelectedIndex().indexOf(studentRecordIndex) === -1) {
          // add selected index to octopus
          octopus.addSelectedIndex(studentRecordIndex); // get missedDaysCell in HTML collection
          // based on that its index equal studentRecordIndex + 1
          // because HTML collection start at 0, studentRecordIndexs start at 1
          // HTML collection [th.missed-col, td.missed-col, td.missed-col, td.missed-col, td.missed-col, td.missed-col]

          missedDaysCell = document.getElementsByClassName('missed-col')[studentRecordIndex + 1]; // change select btn to checked

          selectStudentRecordBtn[studentRecordIndex + 1].classList.add('fa-check-square');
          selectStudentRecordBtn[studentRecordIndex + 1].classList.remove('fa-square');
        } else {
          octopus.getSelectedIndex().splice(octopus.getSelectedIndex().indexOf(studentRecordIndex), 1);
          console.log(octopus.getSelectedIndex());
          missedDaysCell = document.getElementsByClassName('missed-col')[studentRecordIndex + 1]; // change select btn to unchecked

          selectStudentRecordBtn[studentRecordIndex + 1].classList.remove('fa-check-square');
          selectStudentRecordBtn[studentRecordIndex + 1].classList.add('fa-square');
        } // highlighting selected row


        highlightingSelectedRow();
      } // every time tableBodyView is render due to a change in attendance days
      // we to to render tableHeaderView also


      tableHeaderView.render.call(tableHeaderView);
    }); // add missed days as property for each student record at first init of app

    octopus.addMissedDaysAsProperty(); // render table tableBodyView

    tableBodyView.render();
  },
  render: function render() {
    // rows equal to student records
    var rows = octopus.getStudentData().length;
    var cells = octopus.getDaysNum(); // clear table and render

    this.tableBody.innerHTML = ''; // create table rows using DOM functions
    // https://stackoverflow.com/questions/13775519/html-draw-table-using-innerhtml

    for (var row = 1; row <= rows; row++) {
      // create rows and begin at index 0
      var tableRow = this.tableBody.insertRow(row - 1); // create student name cells

      var studentName = document.createTextNode(" ".concat(octopus.getStudentData()[row - 1]['name']));
      var nameCell = tableRow.insertCell(0); // insert student name ex 'Alice' at index 0
      // create delete student option btn

      var deletOptionBtn = document.createElement('button');
      nameCell.setAttribute('class', 'name-cell');
      nameCell.appendChild(deletOptionBtn);
      nameCell.appendChild(studentName); // create days missed cells

      var daysMissed = document.createTextNode(octopus.getSudentsMissedDays()[row - 1].length); // all browsers support it equally without any quirks, it scape all HTML tags

      var daysMissedCell = tableRow.insertCell(-1); // -1 to insert missed days cell at the last position
      // daysMissedCell.innerHTML = '0 <span> gg </span>'; // render html-like tags into a DOM
      // deletOptionBtn.setAttribute('id', `delete-option-btn${row}`);

      daysMissedCell.appendChild(daysMissed); // every time tableBodyView is render due to a change in attendance days
      // check first if there was a selected records in octopus.getSelectedIndex()
      // to save selected records in the view as they are

      if (octopus.getSelectedIndex().length > 0) {
        if (octopus.getSelectedIndex().indexOf(row - 1) > -1) {
          console.log(octopus.getSelectedIndex(), row);
          tableRow.setAttribute('class', 'student-row selected-col');
          deletOptionBtn.setAttribute('class', 'select-option-btn option-btn active-btn fas fa-check-square');
          daysMissedCell.setAttribute('class', 'missed-col selected-col');
        } else {
          tableRow.setAttribute('class', 'student-row');
          deletOptionBtn.setAttribute('class', 'select-option-btn option-btn active-btn fas fa-square');
          daysMissedCell.setAttribute('class', 'missed-col');
        }
      } else {
        tableRow.setAttribute('class', 'student-row');
        deletOptionBtn.setAttribute('class', 'select-option-btn option-btn active-btn fas fa-square');
        daysMissedCell.setAttribute('class', 'missed-col');
      } // create checkbox cells


      for (var cell = 1; cell <= cells; cell++) {
        var checkbox = document.createElement('input');
        var checkCell = tableRow.insertCell(cell); // index equal to cell to insert cell index 1, 2, 3, ..., daysNum

        checkCell.setAttribute('class', 'attend-col');
        checkbox.setAttribute('type', 'checkbox'); // insert student attandance
        // check boxes, based on attendace records

        if (octopus.getStudentData()[row - 1]['attendanceDays'][cell - 1] === true) {
          checkbox.setAttribute('checked', '');
        } else if (octopus.getStudentData()[row - 1]['attendanceDays'][cell - 1] === false) {
          checkbox.removeAttribute('checked');
        }

        checkCell.appendChild(checkbox);
      }
    } // create table rows using a string to store the HTML

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

var changeDaysNumView = {
  init: function init() {
    var _this = this;

    // store pointers to our DOM elements for easy access later
    this.changeDaysNumBtn = document.getElementsByClassName('change-days-btn')[0];
    this.daysView = document.getElementById('days-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[0];
    this.daysNumInput = document.getElementById('days-num');
    this.subtractBtn = document.getElementById('subtract-btn');
    this.increaseBtn = document.getElementById('increase-btn');
    this.wrongFieldNotify = document.getElementsByClassName('wrong-field-notify')[0]; // 'this' inside the event listener callback
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

    this.changeDaysNumBtn.addEventListener('click', octopus.toggleOptionView.bind(this, this.daysView));
    this.closeOption.addEventListener('click', octopus.toggleOptionView.bind(this, this.daysView)); // on change, get new value
    // if user input a negative number show notify message

    this.daysNumInput.addEventListener('change', function (e) {
      if (e.target.value > 0) {
        var enteredDaysNum = e.target.value;
        octopus.updateDaysNum(enteredDaysNum); // remove notify message

        changeDaysNumView.wrongFieldNotify.classList.add('hidden');
      } else {
        // using this.wrongFieldNotify inside 'change' event listener
        // give this error Cannot read property 'classList' of undefined at HTMLInputElement
        // as 'this' inside the event listener callback
        // will be the element that fired the event which is 'this.daysNumInput'
        // this.wrongFieldNotify.classList.remove('hidden');
        changeDaysNumView.wrongFieldNotify.classList.remove('hidden');
      }
    }); // on click, decrease daysNumInput value by 1
    // update daysNum in model using octopus.updateDaysNum()

    this.subtractBtn.addEventListener('click', function () {
      // put a limit for input type
      // if use reach number 1 a notify message appear
      _this.daysNumInput.value > 1 ? _this.daysNumInput.value-- : _this.wrongFieldNotify.classList.remove('hidden');
      octopus.updateDaysNum(_this.daysNumInput.value);
    }); // on click, increase daysNumInput value by 1
    // update daysNum in model using octopus.updateDaysNum()

    this.increaseBtn.addEventListener('click', function () {
      _this.daysNumInput.value++;
      octopus.updateDaysNum(_this.daysNumInput.value); // remove notify message

      _this.wrongFieldNotify.classList.add('hidden');
    });
  },
  //
  render: function render() {
    // set daysNumInput value to be always days num
    // to improve UX every time user want to change days num stop at the last time days num
    this.daysNumInput.setAttribute('value', octopus.getDaysNum());
    console.log(this.wrongFieldNotify);
  }
};
var addNewStudentView = {
  init: function init() {
    var _this2 = this;

    // store pointers to our DOM elements for easy access later
    this.addStudentViewBtn = document.getElementsByClassName('add-student-btn')[0];
    this.addStudentView = document.getElementById('add-student-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[1];
    this.studentNameInput = document.getElementById('student-name');
    this.addStudentBtn = document.getElementById('add-student');
    this.emptyFieldNotify = document.getElementsByClassName('empty-field-notify')[0]; // on click open, close addStudentView

    this.addStudentViewBtn.addEventListener('click', octopus.toggleOptionView.bind(this, this.addStudentView));
    this.closeOption.addEventListener('click', octopus.toggleOptionView.bind(this, this.addStudentView)); // on change, get student name
    // use () => {..} to caputer value of 'this' bound to addStudentView object

    this.addStudentBtn.addEventListener('click', function () {
      // if user enter a name get it
      // if not a notify message appear
      if (_this2.studentNameInput.value.length > 0) {
        var studentName = _this2.studentNameInput.value;
        octopus.addNewStudent(studentName); // clear input to improve UX

        _this2.render();
      } else {
        _this2.emptyFieldNotify.classList.remove('hidden');
      }
    });
  },
  render: function render() {
    // clear input to improve UX
    this.studentNameInput.value = ''; // remove notify message

    this.emptyFieldNotify.classList.add('hidden');
  }
};
var deleteStudentView = {
  init: function init() {
    // store pointers to our DOM elements for easy access later
    this.deleteStudentViewBtn = document.getElementsByClassName('delete-student-btn')[0];
    this.deleteStudentView = document.getElementById('delete-student-view');
    this.closeOption = document.getElementsByClassName('option-close-btn')[2];
    this.deleteStudentBtn = document.getElementById('delete-student-btn');
    this.confirmDeleteMessage = document.getElementById('confirm-delete-message'); // on click delete selected records

    deleteStudentView.deleteStudentBtn.addEventListener('click', function () {
      octopus.deleteStudent();
      console.log('delete confirm', octopus.getSelectedIndex()); // studentRecordIndexs = [];
    }); // on click open, close addStudentView

    this.deleteStudentViewBtn.addEventListener('click', octopus.toggleOptionView.bind(this, this.deleteStudentView));
    this.closeOption.addEventListener('click', octopus.toggleOptionView.bind(this, this.deleteStudentView));
  },
  render: function render() {}
};
var _undoDelete = {
  init: function init() {
    this.undoBtn = document.getElementsByClassName('undo-btn')[0];
    this.undoBtn.addEventListener('click', function () {
      octopus.undoDelete();
    });
  },
  render: function render() {
    // if user delete records activate undoBtn
    // if user doesn't have deleted records deactivate undoBtn
    if (octopus.getDeletedRecords().length !== 0) {
      this.undoBtn.classList.remove('disabled-btn');
      this.undoBtn.classList.add('active-btn');
      this.undoBtn.removeAttribute('disabled');
    } else {
      this.undoBtn.classList.add('disabled-btn');
      this.undoBtn.classList.remove('active-btn');
      this.undoBtn.setAttribute('disabled', 'disabled');
    }
  }
};
/* modal box view */

var modalBoxView = {
  init: function init() {
    var _this3 = this;

    this.modalBox = document.getElementById('modal-box');
    this.closeBtn = document.getElementsByClassName('modal-close-btn')[0];
    this.noBtn = document.getElementsByClassName('secondary-btn')[1];
    this.yesBtn = document.getElementsByClassName('primary-btn')[3]; // 'this' inside the event listener callback
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

    window.addEventListener('click', function (evt) {
      if (evt.target === _this3.modalBox) {
        console.log(evt.target);
        modalBoxView.closeModal();
      }
    });
  },
  openModal: function openModal() {
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
  closeModal: function closeModal() {
    this.modalBox.classList.remove('show');
    this.modalBox.classList.add('hidden');
  }
};
octopus.init();