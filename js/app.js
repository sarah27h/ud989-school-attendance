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
                for (var i = 0; i <= 11; i++) {
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

