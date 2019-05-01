/* model */
let model = {
    studentNames : ["Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda"],
    
    // Create attendance records, use local storage to store them
    init: function() {
        if (!localStorage.studentAttendance) {
            console.log('Creating attendance records...');

            function getRandom() {
                return (Math.random() >= 0.5);
            }

            // create studentAttendance object
            const studentAttendance = {};
            this.studentNames.map(function(name) {
                // add studentsNames as its key
                studentAttendance[name] = [];
                
                // fill values of studentAttendance object keys
                // with random data
                for (let i = 0; i <= 11; i++) {
                    studentAttendance[name].push(getRandom());
                }
                return studentAttendance[name]
            });

            // converts a studentAttendance object to a JSON string
            // store studentAttendance JSON string
            // {"Slappy the Frog":[false,false,...],"Lilly the Lizard":[false,true, ...],"Paulrus the Walrus":[true,false,true, ...],"Gregory the Goat":[true,true, ...],"Adam the Anaconda":[false,true, ...]}
            localStorage.studentAttendance = JSON.stringify(studentAttendance);
        }
    },

    getAttendanceData: function() {
        // Parse a string (written in JSON) and return a JavaScript object
        // {Slappy the Frog: [...], Lilly the Lizard: [...], Paulrus the Walrus: Array[...], Gregory the Goat: [...], Adam the Anaconda: [...]}
        return JSON.parse(localStorage.studentAttendance);
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
        let cols = 12;

        // create table rows using DOM functions
        // https://stackoverflow.com/questions/13775519/html-draw-table-using-innerhtml
        for(let row = 1; row <= rows; row++) {
            
            // create rows
            let tableRow = this.tableBody.insertRow();

            // create days missed cells
            let daysMissed = document.createTextNode('0')
            let daysMissedCell = tableRow.insertCell(0);
            daysMissedCell.setAttribute('class','missed-col');
            daysMissedCell.appendChild(daysMissed);

            // create checkbox cells
            for(let col=1; col <= cols; col++){
                let checkbox = document.createElement('input');
                let checkCell = tableRow.insertCell(col-1);
                checkCell.setAttribute('class','attend-col');
                checkbox.setAttribute('type','checkbox');
                checkCell.appendChild(checkbox);
            }
            // create student name cells
            let studentName = document.createTextNode(`${octopus.getStudentNames()[row-1]}`);
            let nameCell = tableRow.insertCell(0);
            nameCell.setAttribute('class','name-col')
            nameCell.appendChild(studentName);

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