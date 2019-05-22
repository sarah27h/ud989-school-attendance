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

    getAttendanceData: function() {
        // Parse a string (written in JSON) and return a JavaScript object
        // [{name:"Alice",attendanceDyas:[false,true, ...]},{name:"Lydia",attendanceDyas:[false,true, ...]},{name:"Adam",attendanceDyas:[true,false, ...]},{name:"Daniel",attendanceDyas:[false,true, ...]},{name:"Amy",attendanceDyas:[true,false, ...]}
        console.log(JSON.parse(localStorage.studentData));
        return JSON.parse(localStorage.studentData);
    }

    
}


/* octopus */

let octopus = {
    getStudentNames: function() {
        // extract object keys
         return Object.keys(model.getAttendanceData());
    },

    getStudentAttendance: function() {
        let attendance = [];
        // extract object values
        for(let days in model.getAttendanceData()) {
            attendance.push(model.getAttendanceData()[days]);
        }
        return attendance;
    },

    getMissedDays: function() {
        const allDays = octopus.getStudentAttendance();
        let allMissed = [],
            missed = [];
        console.log(allDays);
        for(let i = 0; i < allDays.length; i++) {
            missed[i] = allDays[i].filter(function(days){
                
                return days === false ;
            });
            allMissed.push(missed[i]);
            console.log(allMissed)
            return missed
        }
        
        
    },

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
        this.render();
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
            let studentName = document.createTextNode(`${octopus.getStudentNames()[row-1]}`);
            let nameCell = tableRow.insertCell(0); // insert student name ex 'Slappy' at index 0
            nameCell.setAttribute('class','name-col')
            nameCell.appendChild(studentName);

            // create checkbox cells
            for(let cell=1; cell <= cells; cell++){
                let checkbox = document.createElement('input');
                let checkCell = tableRow.insertCell(cell); // index equal to cell to insert cell index 1, 2, 3, ..., 12
                checkCell.setAttribute('class','attend-col');
                checkbox.setAttribute('type','checkbox');
                checkCell.appendChild(checkbox);
            }

            // create days missed cells
            let daysMissed = document.createTextNode('0'); // all browsers support it equally without any quirks, it scape all HTML tags
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
octopus.getMissedDays();