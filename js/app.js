/* model */
let model = {
    studentNames : ["Alice", "Lydia", "Adam", "Daniel", "Amy"],
    
    // Create attendance records if it hasn't created yet, use local storage to store them
    init: function() {
        if (!localStorage.studentData) {
            console.log('Creating attendance records...');

            /**
            * @description Create random data for our student attendanceDyas
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
                student['attendanceDyas'] = [];
                // fill values of attendanceDyas array with random boolean data
                for (let day = 1; day <= 12; day++) {
                    student['attendanceDyas'].push(getRandom());
                }
                // add student object to our array
                studentData.push(student);
                return studentData;
            });

            // converts a studentAttendance object to a JSON string
            // store studentAttendance JSON string
            // [{"name":"Alice","attendanceDyas":[false,true, ...]},{"name":"Lydia","attendanceDyas":[false,true, ...]},{"name":"Adam","attendanceDyas":[true,false, ...]},{"name":"Daniel","attendanceDyas":[false,true, ...]},{"name":"Amy","attendanceDyas":[true,false, ...]}]
            localStorage.studentData = JSON.stringify(studentData);
        }
    },

    getAllStudentData: function() {
        // Parse a string (written in JSON) and return a JavaScript object
        // [{name:"Alice",attendanceDyas:[false,true, ...]},{name:"Lydia",attendanceDyas:[false,true, ...]},{name:"Adam",attendanceDyas:[true,false, ...]},{name:"Daniel",attendanceDyas:[false,true, ...]},{name:"Amy",attendanceDyas:[true,false, ...]}
        console.log(JSON.parse(localStorage.studentData));
        return JSON.parse(localStorage.studentData);
    },

    updateStudentData: function(updatedArray) {
        localStorage.studentData = JSON.stringify(updatedArray);
    }

    // updateStudentData: function(updatedArray) {
    //     localStorage.studentData = JSON.stringify(updatedArray);
    // }
    
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
            return student['attendanceDyas'].filter((day) => {
                return !day? !day : 0;
            });
        });
        console.log(missedDays);
        return missedDays;
    },

    // count missed days
    addMissedDaysAsProperty: function() {
        model.getAllStudentData().forEach((student, index, arr) => {
            arr[index]['missedDays'] = 0
            student['attendanceDyas'].map((day) => {

                if (day === false) {
                    student['missedDays']++;
                }
            });

            console.log(student, arr);
            // to update our array in local storage with new missedDays property
            model.updateStudentData(arr);
        });

        // model.updateStudentData(model.getAllStudentData());
        console.log(model.getAllStudentData());
    },

    // add a new property to clone
    // addMissedDaysAsProperty: function() {
    //     const clone = [...model.getAllStudentData()];
    //     clone.forEach((student, index, arr) => {
    //         arr[index]['missedDays'] = 0
    //         student['attendanceDyas'].map((day) => {
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
        view.init();
    }
}

/* view */
let view = {
    init: function() {
        this.tableBody = document.getElementById('table-body');
        this.tableRows = document.getElementsByClassName('name-col');
        console.log(this.tableRows);
        console.log(this.tableBody);
        view.render();
    },

    render: function() {
        let tableBody = '';
        let rows = 5;
        let cells = 12;

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
                if (octopus.getStudentData()[row-1]['attendanceDyas'][cell-1] === true ){
                    checkbox.setAttribute("checked", "");
                } else if (octopus.getStudentData()[row-1]['attendanceDyas'][cell-1] === false) {
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
octopus.init();
console.log(octopus.addMissedDaysAsProperty());
console.log(model.getAllStudentData());