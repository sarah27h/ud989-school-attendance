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
    }
}

octopus.init();