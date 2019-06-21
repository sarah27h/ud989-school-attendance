/* model */
let model = {
    studentNames : ["Alice", "Lydia", "Adam", "Daniel", "Amy"],
    
    // Create attendance records if it hasn't created yet, use local storage to store them
    init: function() {
        if (!localStorage.studentData) {
            console.log('Creating attendance records...');

            /**
            * @description Create random data for our student attendanceDays
            * @returns {boolean}
            */
            function getRandom() {
                return (Math.random() >= 0.5);
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

            // converts a studentAttendance object to a JSON string
            // store studentAttendance JSON string
            // "[{"name":"Alice","attendanceDays":[false,true, ...]},{"name":"Lydia","attendanceDays":[false,true, ...]},{"name":"Adam","attendanceDays":[true,false, ...]},{"name":"Daniel","attendanceDays":[false,true, ...]},{"name":"Amy","attendanceDays":[true,false, ...]}]"
            localStorage.studentData = JSON.stringify(studentData);
        }
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

}


/* octopus */
let octopus = {
    // get student data from model
    getStudentData: function() {
        return model.getAllStudentData();
    },

    // count a student's missed days
    getMissedDays: function() {
        const missedDays = model.getAllStudentData().map((student) => {
            return student['attendanceDays'].filter((day) => {
                return !day? !day : 0;
            });
        });
        console.log(missedDays);
        return missedDays;
    },

    // count missed days and add as property using pass student index and missed
    // and not whole array
    addMissedDaysAsProperty: function() {
        model.getAllStudentData().forEach((student, index, arr) => {
            let missed = 0;
            student['attendanceDays'].map((day) => {

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

    /* count missed days and add as property using pass an array every time
    // addMissedDaysAsProperty: function() {
        
    //     model.getAllStudentData().forEach((student, index, arr) => {
    //         arr[index]['missedDays'] = 0;
            
    //         student['attendanceDays'].map((day) => {

    //             if (day === false) {
    //                 student['missedDays']++;
    //             }
                
    //         });

    //         console.log(student, arr);
    //         // to update our array in local storage with new missedDays property
    //         model.updateStudentData(arr);
    //     });

    //     // model.updateStudentData(model.getAllStudentData());
    //     console.log(model.getAllStudentData());
    // }, */

    // update attendance days depends on checkboxs, update storage, render table tableBodyView
    updateAttendance: function(rowIndex, checkboxIndex) {

        // loop through StudentData and by using rowIndex, recordIndex
        // check which checkboxIndex changes to toggle it
        model.getAllStudentData().forEach((student, recordIndex, students) => {
            recordIndex === rowIndex? 
            students[rowIndex]['attendanceDays'][checkboxIndex] = !students[rowIndex]['attendanceDays'][checkboxIndex] : 
            students[rowIndex]['attendanceDays'][checkboxIndex] = students[rowIndex]['attendanceDays'][checkboxIndex];

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

    // add a new property to clone
    // addMissedDaysAsProperty: function() {
    //     const clone = [...model.getAllStudentData()];
    //     clone.forEach((student, index, arr) => {
    //         arr[index]['missedDays'] = 0
    //         student['attendanceDays'].map((day) => {
    //             if (day === false) {
    //                 student['missedDays']++;
    //             }
    //         });
           
    //         console.log(student, student['missedDays']);
            
    //         // return student;
    //     });
    //     model.updateStudentData(clone);
    //     console.log(clone, model.getAllStudentData());
    // },

    init: function() {
        model.init();
        tableBodyView.init();
        tableHeaderView.init();
        optionView.init();
    }
}

/* tableHeaderView */
let tableHeaderView = {
    init: function() {
        this.studentTable = document.getElementById('student-table');

        // render tableHeaderView
        this.render();
    },

    render: function() {
        // default days num
        let cells = 12;
        let tableHeader = this.studentTable.createTHead();
        let headerRows = tableHeader.insertRow(0);

        // create name cell in table header
        let nameCell = document.createElement("th");
        nameCell.appendChild(document.createTextNode('Student Name'));
        nameCell.setAttribute('class', 'name-col');
        headerRows.appendChild(nameCell);

        // create days cell in table header
        for(let cell = 1; cell <= cells; cell++) {
            let daysCell = document.createElement("th");
            daysCell.appendChild(document.createTextNode(`${cell}`));
            daysCell.setAttribute('class', 'name-col');
            headerRows.appendChild(daysCell);
        }

        // create missed days cell in table header
        let missedDayscell = document.createElement("th");
        missedDayscell.appendChild(document.createTextNode('Days Missed-col'));
        missedDayscell.setAttribute('class', 'missed-col');
        headerRows.appendChild(missedDayscell);
    }
}


/* tableBodyView */
let tableBodyView = {
    init: function() {

        this.tableBody = document.getElementById('table-body');

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
        
        // on change, get cell, row index and pass to octopus to update
        this.tableBody.addEventListener('change', function(e) {

            // check if evt.target is input
            if (e.target.nodeName.toLowerCase() === 'input') {
                    let rowIndex = e.target.parentNode.parentNode.rowIndex - 1,
                        checkboxIndex = e.target.parentNode.cellIndex - 1;
                    console.log(e.target, 'change event');

                    // pass attendanceRecordIndex, checkboxIndex to update student attendance
                    octopus.updateAttendance(rowIndex, checkboxIndex);
            }
        });

        // render table tableBodyView
        tableBodyView.render();
    },

    render: function() {
        let tableBody = '';
        let rows = 5;
        let cells = 12;

        // clear table and render
        this.tableBody.innerHTML = '';

        // create table rows using DOM functions
        // https://stackoverflow.com/questions/13775519/html-draw-table-using-innerhtml
        for(let row = 1; row <= rows; row++) {
            
            // create rows and begin at index 0
            let tableRow = this.tableBody.insertRow(row-1);

            // create student name cells
            let studentName = document.createTextNode(`${octopus.getStudentData()[row-1]['name']}`);
            let nameCell = tableRow.insertCell(0); // insert student name ex 'Slappy' at index 0
            nameCell.setAttribute('class','name-col')
            nameCell.appendChild(studentName);

            // create checkbox cells
            for(let cell=1; cell <= cells; cell++){
                let checkbox = document.createElement('input');
                let checkCell = tableRow.insertCell(cell); // index equal to cell to insert cell index 1, 2, 3, ..., 12
                checkCell.setAttribute('class','attend-col');
                checkbox.setAttribute('type','checkbox');

                // insert student attandance
                // check boxes, based on attendace records
                if (octopus.getStudentData()[row-1]['attendanceDays'][cell-1] === true ){
                    checkbox.setAttribute("checked", "");
                } else if (octopus.getStudentData()[row-1]['attendanceDays'][cell-1] === false) {
                    checkbox.removeAttribute("checked");
                }
                checkCell.appendChild(checkbox);
            }

            // create days missed cells
            let daysMissed = document.createTextNode(octopus.getMissedDays()[row-1].length); // all browsers support it equally without any quirks, it scape all HTML tags  
            let daysMissedCell = tableRow.insertCell(-1); // -1 to insert missed days cell at the last position
            // daysMissedCell.innerHTML = '0 <span> gg </span>'; // render html-like tags into a DOM
            daysMissedCell.setAttribute('class','missed-col');
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
}


/* options view */
let optionView = {
    createOption: function(icon) {
        let optionIcon = document.createElement('button');
        optionIcon.setAttribute('class', `option-btn fas fa-${icon}`);
        return optionIcon;
    },

    init: function() {
        this.optionsContainer = document.getElementById('options-container');

        optionView.render();
    },

    render: function() {
        this.optionsContainer.appendChild(optionView.createOption('calendar-day'));
        this.optionsContainer.appendChild(optionView.createOption('user-plus'));
    }
}

octopus.init();