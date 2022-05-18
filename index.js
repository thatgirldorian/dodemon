#!/usr/bin/env node
//this makes the file executable 

// console.log('Yep, this works!')

const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const program = require("@caporal/core").default
const fs = require("fs")

//use the caporal package to build out our cli tool
program
    .version('1.0.0')
    .argument("[filename]", "This is the name of the file to be executed.")
    .action(async ({ filename }) => {
        //check if a filename is being provided
        const name = filename || "index.js"

        //check if the file exists
        try {
            await access(name)
        } catch {
            console.error(`Could not find the file ${name}`)
        }

        //this will start up a user's code 
            const start = debounce(() => {
                console.log("Starting the user's program")
            }, 100)

            //have chokidar send messages depending on what event is detected in our working directory
            chokidar.watch('.')
            //add a timer for the event for for  100 milliseconds (debouncing) with lodash
                .on('add', start)
                .on('change', start)
                .on('unlink', start)
                    // console.log(args)
    })

program.run(process.argv.slice(2))

